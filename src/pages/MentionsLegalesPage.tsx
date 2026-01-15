import React from 'react';

export const MentionsLegalesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-luxury-black text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-12 text-center">
                    Mentions Légales
                </h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    {/* Éditeur */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Éditeur</h2>
                        <p className="mb-2">
                            <strong className="text-white">Nom :</strong> Ayoub Bensalem
                        </p>
                        <p className="mb-2">
                            <strong className="text-white">Statut :</strong> Entrepreneur Indépendant
                        </p>
                        <p className="text-sm italic text-gray-400">
                            Note : L'adresse complète est disponible sur demande via l'email de contact pour des raisons de confidentialité.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Contact</h2>
                        <p>
                            <strong className="text-white">Email :</strong>{' '}
                            <a
                                href="mailto:contact@swissgo.ch"
                                className="text-luxury-gold hover:underline transition"
                            >
                                contact@swissgo.ch
                            </a>
                        </p>
                    </section>

                    {/* Hébergeur */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Hébergeur</h2>
                        <p className="mb-2">
                            <strong className="text-white">Raison sociale :</strong> Infomaniak Network SA
                        </p>
                        <p className="mb-2">
                            <strong className="text-white">Adresse :</strong> Rue Eugène-Marziano 25
                        </p>
                        <p className="mb-2">
                            <strong className="text-white">Code postal et ville :</strong> 1227 Les Acacias, Genève
                        </p>
                        <p>
                            <strong className="text-white">Pays :</strong> Suisse
                        </p>
                    </section>

                    {/* Propriété intellectuelle */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Propriété Intellectuelle</h2>
                        <p>
                            L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes)
                            est la propriété exclusive de SwissGo, sauf mention contraire.
                            Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
