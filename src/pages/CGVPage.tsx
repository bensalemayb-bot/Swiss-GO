import React from 'react';

export const CGVPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-luxury-black text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-12 text-center">
                    Conditions Générales de Vente
                </h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <p className="text-sm italic text-gray-400">
                            Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation
                            des services proposés par SwissGo. En passant commande, vous acceptez sans réserve les présentes conditions.
                        </p>
                    </section>

                    {/* Produits et Prix */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Produits et Prix</h2>
                        <div className="space-y-3">
                            <div className="border-l-2 border-luxury-gold pl-4">
                                <p className="font-semibold text-white">Pack Élite</p>
                                <p className="text-sm">Expérience complète + E-book d'Expertise</p>
                                <p className="text-luxury-gold font-bold">149 €</p>
                            </div>
                            <div className="border-l-2 border-luxury-gold pl-4">
                                <p className="font-semibold text-white">Pack Duo Standard</p>
                                <p className="text-sm">1 CV + 1 Lettre de Motivation</p>
                                <p className="text-luxury-gold font-bold">49,90 €</p>
                            </div>
                            <div className="border-l-2 border-luxury-gold pl-4">
                                <p className="font-semibold text-white">Unité</p>
                                <p className="text-sm">1 CV seul ou 1 Lettre seule</p>
                                <p className="text-luxury-gold font-bold">29,90 €</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm">
                            Les prix sont indiqués en euros (€) et incluent toutes les taxes applicables.
                        </p>
                    </section>

                    {/* Paiement */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Paiement</h2>
                        <p>
                            Le paiement s'effectue de manière sécurisée via <strong className="text-white">Stripe</strong>.
                            Les informations bancaires ne sont ni collectées ni stockées par SwissGo.
                        </p>
                    </section>

                    {/* Livraison */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Livraison</h2>
                        <p>
                            L'accès aux crédits de génération est <strong className="text-white">immédiat</strong> dès
                            validation du paiement. Les documents générés sont accessibles directement depuis votre espace candidat.
                        </p>
                    </section>

                    {/* Droit de rétractation */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Droit de Rétractation</h2>
                        <p>
                            Conformément aux dispositions légales sur les produits numériques,
                            l'utilisateur renonce expressément à son droit de rétractation
                            <strong className="text-white"> une fois les crédits consommés pour générer un document</strong>.
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Avant toute génération, les crédits non utilisés peuvent faire l'objet d'une demande de remboursement
                            dans un délai de 14 jours suivant l'achat.
                        </p>
                    </section>

                    {/* Responsabilité */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Responsabilité</h2>
                        <p>
                            SwissGo fournit des outils d'optimisation de candidature basés sur l'intelligence artificielle.
                        </p>
                        <p className="mt-2">
                            <strong className="text-white">L'obtention d'un emploi reste soumise à la décision souveraine des recruteurs.</strong>
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            SwissGo ne saurait être tenu responsable en cas de non-embauche. Les documents générés
                            constituent une aide à la candidature et ne garantissent aucun résultat.
                        </p>
                    </section>

                    {/* Litiges */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Litiges</h2>
                        <p>
                            Les présentes CGV sont régies par le droit suisse.
                            En cas de litige, une solution amiable sera recherchée en priorité via{' '}
                            <a
                                href="mailto:contact@swissgo.ch"
                                className="text-luxury-gold hover:underline transition"
                            >
                                contact@swissgo.ch
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
