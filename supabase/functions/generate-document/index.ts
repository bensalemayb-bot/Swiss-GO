import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.30.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type InlineFile = {
  data: string;
  mimeType: string;
};

type RequestBody = {
  prompt: string;
  type?: string;
  model?: string;
  responseMimeType?: string;
  temperature?: number;
  systemInstruction?: string;
  files?: InlineFile[];
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Supabase env vars not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: RequestBody = await req.json();
    if (!body?.prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY") ?? "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model =
      body.model ||
      (body.type === "image" ? "gemini-2.5-flash-image" : "gemini-3-flash-preview");

    const parts: Array<{ text?: string; inlineData?: InlineFile }> = [];
    if (Array.isArray(body.files)) {
      for (const file of body.files) {
        if (file?.data && file?.mimeType) {
          parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
        }
      }
    }
    parts.unshift({ text: body.prompt });

    const config: Record<string, unknown> = {};
    if (typeof body.temperature === "number") {
      config.temperature = body.temperature;
    }
    if (body.responseMimeType) {
      config.responseMimeType = body.responseMimeType;
    }
    if (body.systemInstruction) {
      config.systemInstruction = body.systemInstruction;
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config,
    });

    let text = response.text ?? "";
    if (body.type === "image") {
      const responseParts = response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = responseParts.find((part: any) => part.inlineData?.data);
      if (imagePart?.inlineData?.data && imagePart?.inlineData?.mimeType) {
        text = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      }
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
