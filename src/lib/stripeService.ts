import { supabase } from './supabaseClient';

interface CreateCheckoutParams {
    packId: string;
    packName: string;
    packPrice: string;
}

export const createStripeCheckout = async ({ packId, packName, packPrice }: CreateCheckoutParams) => {
    // URLs de retour après paiement (avec hash routing)
    const successUrl = `${window.location.origin}/#payment-success?pack=${packId}`;
    const cancelUrl = `${window.location.origin}/#pricing`;

    // Vérifier que Supabase est configuré
    if (!supabase) {
        throw new Error('Supabase non configuré');
    }

    try {
        console.log('Appel de create-checkout avec:', { packId, packName, packPrice });

        // Appeler l'Edge Function Supabase
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: {
                packId,
                packName,
                packPrice,
                successUrl,
                cancelUrl,
            },
        });

        console.log('Réponse de create-checkout:', { data, error });

        if (error) {
            console.error('Erreur lors de la création de la session:', error);
            throw error;
        }

        // Rediriger vers la page de paiement Stripe
        if (data?.url) {
            window.location.href = data.url;
        } else {
            throw new Error('URL de paiement non reçue');
        }

        return data;
    } catch (error) {
        console.error('Erreur Stripe:', error);
        throw error;
    }
};
