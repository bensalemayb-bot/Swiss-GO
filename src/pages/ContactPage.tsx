import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Votre message a bien été envoyé.");
  };

  const faqs = [
    {q: "Les standards suisses sont-ils respectés ?", r: "Absolument. Nous appliquons une rigueur helvétique stricte à chaque document produit."},
    {q: "Quel est le délai de livraison ?", r: "Vos documents sont générés instantanément après validation de vos informations par nos experts RH & standards suisses."},
    {q: "Proposez-vous une garantie ?", r: "Pour nos packs Prestige, nous offrons une garantie de satisfaction complète avec reprise manuelle si nécessaire."}
  ];

  return (
    <div className="animate-fade-in-up bg-luxury-black min-h-screen text-gray-200">
      <section className="py-20 px-4 text-center">
         <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">Support</span>
         <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 tracking-tight">Contactez-nous</h1>
         <p className="text-gray-400 max-w-lg mx-auto font-light text-lg">Une question sur nos services ? Notre équipe est à votre disposition.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        
        {/* FORMULAIRE STYLE "MODERN SAAS" */}
        <div>
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prénom</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-sm text-white px-4 py-3 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-colors" placeholder="Jean" required />
                 </div>
                 <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-sm text-white px-4 py-3 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-colors" placeholder="Dupont" required />
                 </div>
              </div>
              <div className="group">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Professionnel</label>
                 <input type="email" className="w-full bg-white/5 border border-white/10 rounded-sm text-white px-4 py-3 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-colors" placeholder="email@domaine.com" required />
              </div>
              <div className="group">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Votre Message</label>
                 <textarea className="w-full bg-white/5 border border-white/10 rounded-sm text-white px-4 py-3 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none h-40 resize-none transition-colors" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
              </div>
              <button type="submit" className="w-full bg-white text-luxury-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition duration-300">
                 Envoyer le message
              </button>
           </form>
           
           <div className="mt-12 flex items-center justify-center space-x-2 text-gray-500 text-sm">
              <Mail size={16} className="text-luxury-gold" />
              <span>contact@emploiensuisse.ch</span>
           </div>
        </div>

        {/* FAQ MODERNE */}
        <div className="bg-white/5 p-10 border border-white/10 rounded-sm h-fit">
            <h2 className="text-2xl font-sans font-bold text-white mb-10">Questions Fréquentes</h2>
            <div className="space-y-4">
              {faqs.map((item, index) => (
                 <div key={index} className="border-b border-white/5 pb-4 last:border-0">
                    <button 
                       onClick={() => toggleFaq(index)}
                       className="w-full text-left flex justify-between items-center group py-2"
                    >
                       <span className="font-medium text-gray-200 group-hover:text-luxury-gold transition">{item.q}</span>
                       {openFaq === index ? <ChevronUp size={18} className="text-luxury-gold"/> : <ChevronDown size={18} className="text-gray-500"/>}
                    </button>
                    {openFaq === index && (
                       <div className="pt-2 text-gray-400 font-light text-sm leading-relaxed animate-fade-in-up">
                          {item.r}
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
