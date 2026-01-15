import React from 'react';

export const ConfidentialitePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-luxury-black text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-12 text-center">
                    Politique de Confidentialité
                </h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <p className="text-sm italic text-gray-400">
                            La présente politique de confidentialité décrit comment SwissGo collecte,
                            utilise et protège vos données personnelles, conformément au Règlement Général
                            sur la Protection des Données (RGPD).
                        </p>
                    </section>

                    {/* Données collectées */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Données Collectées</h2>
                        <p className="mb-3">
                            Les données personnelles collectées sont <strong className="text-white">uniquement</strong>
                            nécessaires à la génération de vos dossiers de candidature :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone</li>
                            <li>Parcours professionnel et formations</li>
                            <li>Compétences et atouts</li>
                            <li>Informations relatives au poste visé</li>
                        </ul>
                        <p className="mt-3 text-sm text-gray-400">
                            Ces informations sont utilisées exclusivement pour générer vos CV et lettres de motivation personnalisés.
                        </p>
                    </section>

                    {/* Utilisation des données */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Utilisation des Données</h2>
                        <p>
                            Vos données sont traitées dans le <strong className="text-white">seul but</strong> de :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Générer vos documents de candidature (CV, lettres de motivation)</li>
                            <li>Gérer votre compte utilisateur et vos crédits</li>
                            <li>Vous contacter en cas de besoin lié à votre demande</li>
                        </ul>
                    </section>

                    {/* Sécurité */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Sécurité et Protection</h2>
                        <p className="mb-3">
                            SwissGo met en œuvre des mesures techniques et organisationnelles pour garantir la sécurité de vos données :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong className="text-white">Cryptage des données</strong> lors du stockage et de la transmission
                            </li>
                            <li>
                                <strong className="text-white">Stockage sécurisé</strong> sur des serveurs protégés
                            </li>
                            <li>
                                <strong className="text-white">Accès restreint</strong> aux données personnelles
                            </li>
                        </ul>
                        <p className="mt-4 text-luxury-gold font-semibold">
                            Aucune donnée n'est revendue à des tiers.
                        </p>
                    </section>

                    {/* Partage des données */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Partage des Données</h2>
                        <p>
                            Vos données personnelles <strong className="text-white">ne sont jamais partagées, vendues ou louées</strong> à
                            des tiers à des fins commerciales.
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Seuls nos prestataires techniques (hébergement, paiement) peuvent avoir accès à certaines données
                            dans le cadre strict de la fourniture du service, sous engagement de confidentialité.
                        </p>
                    </section>

                    {/* Droits des utilisateurs */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Vos Droits (RGPD)</h2>
                        <p className="mb-3">
                            Conformément au RGPD, vous disposez des droits suivants :
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>
                                <strong className="text-white">Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles
                            </li>
                            <li>
                                <strong className="text-white">Droit de rectification :</strong> Vous pouvez demander la correction de vos données
                            </li>
                            <li>
                                <strong className="text-white">Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données
                            </li>
                            <li>
                                <strong className="text-white">Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données
                            </li>
                        </ul>
                        <p className="mt-4">
                            Pour exercer ces droits, contactez-nous à tout moment via{' '}
                            <a
                                href="mailto:contact@swissgo.ch"
                                className="text-luxury-gold hover:underline transition font-semibold"
                            >
                                contact@swissgo.ch
                            </a>
                        </p>
                    </section>

                    {/* Conservation des données */}
                    <section>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Conservation des Données</h2>
                        <p>
                            Vos données sont conservées tant que votre compte est actif.
                            En cas de demande de suppression, vos données seront intégralement effacées sous{' '}
                            <strong className="text-white">30 jours ouvrés</strong>.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-white/10 pt-6">
                        <h2 className="text-2xl font-serif text-luxury-gold mb-4">Contact</h2>
                        <p>
                            Pour toute question relative à la protection de vos données personnelles,
                            n'hésitez pas à nous contacter :
                        </p>
                        <p className="mt-2">
                            <a
                                href="mailto:contact@swissgo.ch"
                                className="text-luxury-gold hover:underline transition text-lg font-semibold"
                            >
                                contact@swissgo.ch
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
