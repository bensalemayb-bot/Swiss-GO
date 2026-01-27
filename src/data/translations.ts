export type Language = 'FR' | 'EN' | 'DE' | 'IT';

export const translations = {
  FR: {
    // ========== NAVIGATION ==========
    nav_home: "Accueil",
    nav_pricing: "Offres",
    nav_contact: "Contact",
    nav_candidate_space: "Espace Candidat",
    nav_access_file: "Accéder au dossier",

    // ========== FOOTER ==========
    footer_desc: "L'excellence au service de votre carrière. Nous accompagnons l'élite des candidats francophones vers les opportunités les plus prestigieuses de la Confédération Suisse.",
    footer_nav: "Navigation",
    footer_legal: "Légal",
    footer_swiss_made: "Swiss Made Excellence",
    footer_legal_mentions: "Mentions Légales",
    footer_legal_cgv: "CGV",
    footer_legal_privacy: "Confidentialité",

    // ========== LANDING PAGE - HERO ==========
    hero_badge: "SwissGo • Excellence Suisse 🇨🇭",
    hero_title: "L'Art de l'Excellence Suisse.",
    hero_subtitle: "SwissGo accompagne frontalier ou expatrié : accédez aux standards les plus exigeants du marché suisse. CV, Lettres et Coaching d'élite pour profils ambitieux.",
    hero_cta: "CRÉER MON DOSSIER D'ÉLITE →",

    // ========== LANDING PAGE - PRESENTATION ==========
    section_engineering_title: "L'INGÉNIERIE DE VOTRE SUCCÈS EN SUISSE",
    section_engineering_subtitle: "Ne postulez pas. Dominez le marché avec les standards d'élite SwissGo.",
    section_engineering_p1: "Bienvenue chez SwissGo, l'architecte de votre ascension professionnelle. Nous ne corrigeons pas vos documents ; nous optimisons votre identité pour répondre aux exigences les plus sélectives de la Confédération.",
    section_engineering_p2: "Le marché suisse ne pardonne pas l'approximation. Nous forgeons pour vous un arsenal de candidature complet (CV, Lettre de Motivation, Profil) calibré sur les codes invisibles des RH suisses : Sobriété, Précision et Excellence.",
    section_engineering_card1: "Standards Suisses Certifiés",
    section_engineering_card2: "Stratégie Frontalière & Cadre",
    section_engineering_card3: "Accès Immédiat",
    section_engineering_cta: "DEVENIR LE CANDIDAT ÉVIDENT",

    // ========== LANDING PAGE - PRODUCTS ==========
    prod_badge: "À la carte 📋",
    prod_title: "Documents Essentiels",
    prod_view_all: "Voir toutes les offres 👁️",
    btn_choose: "Choisir",
    btn_generate_now: "Générer maintenant",

    // ========== LANDING PAGE - PACK INTEGRAL ==========
    section_integral_title: "L'Offre Ultime",
    section_integral_subtitle: "Tout ce dont vous avez besoin pour réussir, regroupé dans un pack unique.",
    section_integral_badge: "Le Choix des Futurs Frontaliers",
    section_integral_cta: "Obtenir le Pack Complet",

    // ========== LANDING PAGE - TESTIMONIALS ==========
    section_testimonials_title: "Ce qu'ils disent de nous",
    section_testimonials_subtitle: "Témoignages authentiques de nos clients",

    // ========== PRICING PAGE ==========
    pricing_title: "Nos Offres",
    pricing_subtitle: "Investissez en vous-même",
    pricing_section_basics: "Les Basiques",
    pricing_section_integral: "Pack Intégral",
    pricing_badge_bestseller: "Best Seller",
    pricing_badge_top: "Top",
    pricing_badge_recommended: "Recommandé",
    pricing_integral_subtitle: "La trousse à outils complète pour réussir son expatriation.",
    pricing_integral_includes: "Inclus dans le pack :",
    pricing_btn_select: "Choisir",
    pricing_btn_order: "Commander",

    // ========== PAYMENT MODAL ==========
    payment_secure: "Paiement Sécurisé",
    payment_finalize_title: "Finaliser votre achat",
    payment_total: "Total à payer :",
    payment_btn_pay: "Payer maintenant",
    payment_security_badge: "🔒 Paiement 100% sécurisé • Accès instantané",
    payment_error_credits: "Erreur lors de l'ajout des crédits. Veuillez réessayer.",

    // ========== UPSELL MODAL ==========
    upsell_badge: "Offre Exclusive",
    upsell_title: "Attendez ! Ne partez pas les mains vides.",
    upsell_description: "Passez à la vitesse supérieure. Pour seulement {price} de plus, recevez 50 offres supplémentaires (soit 100 au total) et ma liste exclusive des 25 agences d'intérim avec liens de postulation directs.",
    upsell_initial_pack: "Pack Initial",
    upsell_complete_pack: "Pack Complet",
    upsell_btn_accept: "OUI, JE VEUX LES 100 OFFRES ET LES AGENCES",
    upsell_btn_decline: "Non, je garde mes 50 offres uniquement",
    upsell_trust_badge: "🔒 Paiement sécurisé • 📥 Téléchargement instantané • ✅ Satisfaction garantie",

    // ========== GENERATE PAGE ==========
    gen_pack_header: "Pack {packName}",
    gen_credits_cv: "{count} Crédits CV",
    gen_credits_lm: "{count} Crédits LM",
    gen_buy_credits: "Acheter des Crédits",
    gen_blocked_title: "Accès Restreint",
    gen_blocked_cv: "Vous avez besoin de crédits CV pour accéder à ce formulaire.",
    gen_blocked_lm: "Vous avez besoin de crédits LM (Lettre de Motivation) pour accéder à ce formulaire.",
    gen_blocked_both: "Vous avez besoin de crédits CV et LM pour accéder à ce formulaire.",
    gen_blocked_subtitle: "Payez d'abord, générez ensuite.",
    gen_btn_generate: "Générer mon dossier",

    // ========== BUY CREDITS MODAL ==========
    buy_modal_title: "Recharger votre Compte",
    buy_modal_subtitle: "Choisissez l'option adaptée à votre besoin.",
    buy_modal_discovery: "Offre Découverte",
    buy_modal_discovery_desc: "Pour tester sans engagement",
    buy_modal_free: "Gratuit",
    buy_modal_pack_cv: "Pack 5 CV",
    buy_modal_pack_lm: "Pack 5 LM",
    buy_modal_pack_duo: "Pack Duo",
    buy_modal_pack_integral: "Pack Intégral",
    buy_modal_guide_included: "+ Guide Expatriation",
    buy_modal_credits_included: "20 CV + 20 LM inclus",
    buy_modal_badge_ultimate: "Ultime",
    buy_modal_security: "Paiement sécurisé. Facture disponible après achat.",

    // ========== LOGIN PAGE ==========
    login_title: "Connexion",
    login_subtitle: "Accédez à votre espace candidat",
    login_email: "Email",
    login_password: "Mot de passe",
    login_btn: "Se connecter",
    login_no_account: "Pas encore de compte ?",
    login_signup: "S'inscrire",
    login_forgot_password: "Mot de passe oublié ?",

    // ========== COMMON LABELS ==========
    lbl_firstname: "Prénom",
    lbl_lastname: "Nom",
    lbl_email: "Email",
    lbl_phone: "Téléphone",
    lbl_address: "Adresse",
    lbl_city: "Ville",
    lbl_zip: "Code Postal",
    lbl_nationality: "Nationalité",
    lbl_target_job: "Poste visé",
    lbl_company: "Entreprise",

    // ========== COMMON BUTTONS ==========
    btn_close: "Fermer",
    btn_cancel: "Annuler",
    btn_confirm: "Confirmer",
    btn_save: "Enregistrer",
    btn_delete: "Supprimer",
    btn_edit: "Modifier",
    btn_download: "Télécharger",
    btn_back: "Retour",
    btn_next: "Suivant",

    // ========== ERROR MESSAGES ==========
    error_required_field: "Ce champ est requis",
    error_invalid_email: "Email invalide",
    error_auth_failed: "Échec de l'authentification",
    error_network: "Erreur réseau. Veuillez réessayer.",
    error_unknown: "Une erreur est survenue",
  },

  EN: {
    // ========== NAVIGATION ==========
    nav_home: "Home",
    nav_pricing: "Offers",
    nav_contact: "Contact",
    nav_candidate_space: "Candidate Area",
    nav_access_file: "Access File",

    // ========== FOOTER ==========
    footer_desc: "Excellence for your career. We guide elite francophone candidates towards the most prestigious opportunities in the Swiss Confederation.",
    footer_nav: "Navigation",
    footer_legal: "Legal",
    footer_swiss_made: "Swiss Made Excellence",
    footer_legal_mentions: "Legal Notice",
    footer_legal_cgv: "Terms & Conditions",
    footer_legal_privacy: "Privacy Policy",

    // ========== LANDING PAGE - HERO ==========
    hero_badge: "SwissGo • Swiss Excellence 🇨🇭",
    hero_title: "The Art of Swiss Excellence.",
    hero_subtitle: "SwissGo supports cross-border workers and expats: access the highest Swiss market standards. Elite CVs, Cover Letters, and Coaching for ambitious profiles.",
    hero_cta: "CREATE MY ELITE APPLICATION →",

    // ========== LANDING PAGE - PRESENTATION ==========
    section_engineering_title: "ENGINEERING YOUR SUCCESS IN SWITZERLAND",
    section_engineering_subtitle: "Don't just apply. Dominate the market with SwissGo's elite standards.",
    section_engineering_p1: "Welcome to SwissGo, the architect of your professional ascent. We don't correct your documents; we optimize your identity to meet the most selective requirements of the Confederation.",
    section_engineering_p2: "The Swiss market doesn't forgive approximation. We forge for you a complete application arsenal (CV, Cover Letter, Profile) calibrated on the invisible codes of Swiss HR: Sobriety, Precision, and Excellence.",
    section_engineering_card1: "Certified Swiss Standards",
    section_engineering_card2: "Cross-Border & Executive Strategy",
    section_engineering_card3: "Immediate Access",
    section_engineering_cta: "BECOME THE OBVIOUS CANDIDATE",

    // ========== LANDING PAGE - PRODUCTS ==========
    prod_badge: "A La Carte 📋",
    prod_title: "Essential Documents",
    prod_view_all: "View all offers 👁️",
    btn_choose: "Select",
    btn_generate_now: "Generate now",

    // ========== LANDING PAGE - PACK INTEGRAL ==========
    section_integral_title: "The Ultimate Offer",
    section_integral_subtitle: "Everything you need to succeed, grouped in a unique pack.",
    section_integral_badge: "The Choice of Future Cross-Border Workers",
    section_integral_cta: "Get the Complete Pack",

    // ========== LANDING PAGE - TESTIMONIALS ==========
    section_testimonials_title: "What they say about us",
    section_testimonials_subtitle: "Authentic testimonials from our clients",

    // ========== PRICING PAGE ==========
    pricing_title: "Our Offers",
    pricing_subtitle: "Invest in yourself",
    pricing_section_basics: "The Basics",
    pricing_section_integral: "Integral Pack",
    pricing_badge_bestseller: "Best Seller",
    pricing_badge_top: "Top",
    pricing_badge_recommended: "Recommended",
    pricing_integral_subtitle: "The complete toolkit to succeed in your expatriation.",
    pricing_integral_includes: "Included in the pack:",
    pricing_btn_select: "Select",
    pricing_btn_order: "Order",

    // ========== PAYMENT MODAL ==========
    payment_secure: "Secure Payment",
    payment_finalize_title: "Finalize your purchase",
    payment_total: "Total to pay:",
    payment_btn_pay: "Pay now",
    payment_security_badge: "🔒 100% secure payment • Instant access",
    payment_error_credits: "Error adding credits. Please try again.",

    // ========== UPSELL MODAL ==========
    upsell_badge: "Exclusive Offer",
    upsell_title: "Wait! Don't leave empty-handed.",
    upsell_description: "Upgrade now. For only {price} more, receive 50 additional offers (100 total) and my exclusive list of 25 temp agencies with direct application links.",
    upsell_initial_pack: "Initial Pack",
    upsell_complete_pack: "Complete Pack",
    upsell_btn_accept: "YES, I WANT THE 100 OFFERS AND AGENCIES",
    upsell_btn_decline: "No, I'll keep my 50 offers only",
    upsell_trust_badge: "🔒 Secure payment • 📥 Instant download • ✅ Satisfaction guaranteed",

    // ========== GENERATE PAGE ==========
    gen_pack_header: "{packName} Pack",
    gen_credits_cv: "{count} CV Credits",
    gen_credits_lm: "{count} CL Credits",
    gen_buy_credits: "Buy Credits",
    gen_blocked_title: "Restricted Access",
    gen_blocked_cv: "You need CV credits to access this form.",
    gen_blocked_lm: "You need CL (Cover Letter) credits to access this form.",
    gen_blocked_both: "You need CV and CL credits to access this form.",
    gen_blocked_subtitle: "Pay first, generate later.",
    gen_btn_generate: "Generate my application",

    // ========== BUY CREDITS MODAL ==========
    buy_modal_title: "Recharge Your Account",
    buy_modal_subtitle: "Choose the option that fits your needs.",
    buy_modal_discovery: "Discovery Offer",
    buy_modal_discovery_desc: "To test without commitment",
    buy_modal_free: "Free",
    buy_modal_pack_cv: "5 CV Pack",
    buy_modal_pack_lm: "5 CL Pack",
    buy_modal_pack_duo: "Duo Pack",
    buy_modal_pack_integral: "Integral Pack",
    buy_modal_guide_included: "+ Expatriation Guide",
    buy_modal_credits_included: "20 CV + 20 CL included",
    buy_modal_badge_ultimate: "Ultimate",
    buy_modal_security: "Secure payment. Invoice available after purchase.",

    // ========== LOGIN PAGE ==========
    login_title: "Login",
    login_subtitle: "Access your candidate area",
    login_email: "Email",
    login_password: "Password",
    login_btn: "Log in",
    login_no_account: "Don't have an account yet?",
    login_signup: "Sign up",
    login_forgot_password: "Forgot password?",

    // ========== COMMON LABELS ==========
    lbl_firstname: "First Name",
    lbl_lastname: "Last Name",
    lbl_email: "Email",
    lbl_phone: "Phone",
    lbl_address: "Address",
    lbl_city: "City",
    lbl_zip: "Postal Code",
    lbl_nationality: "Nationality",
    lbl_target_job: "Target Position",
    lbl_company: "Company",

    // ========== COMMON BUTTONS ==========
    btn_close: "Close",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    btn_save: "Save",
    btn_delete: "Delete",
    btn_edit: "Edit",
    btn_download: "Download",
    btn_back: "Back",
    btn_next: "Next",

    // ========== ERROR MESSAGES ==========
    error_required_field: "This field is required",
    error_invalid_email: "Invalid email",
    error_auth_failed: "Authentication failed",
    error_network: "Network error. Please try again.",
    error_unknown: "An error occurred",
  },

  DE: {
    // ========== NAVIGATION ==========
    nav_home: "Startseite",
    nav_pricing: "Angebote",
    nav_contact: "Kontakt",
    nav_candidate_space: "Kandidatenbereich",
    nav_access_file: "Zugang zur Akte",

    // ========== FOOTER ==========
    footer_desc: "Exzellenz für Ihre Karriere. Wir begleiten erstklassige frankophone Kandidaten zu den prestigeträchtigsten Möglichkeiten in der Schweizer Eidgenossenschaft.",
    footer_nav: "Navigation",
    footer_legal: "Rechtliches",
    footer_swiss_made: "Swiss Made Excellence",
    footer_legal_mentions: "Impressum",
    footer_legal_cgv: "AGB",
    footer_legal_privacy: "Datenschutz",

    // ========== LANDING PAGE - HERO ==========
    hero_badge: "SwissGo • Swiss Excellence 🇨🇭",
    hero_title: "Die Kunst der Schweizer Exzellenz.",
    hero_subtitle: "SwissGo unterstützt Grenzgänger und Expats: Zugang zu höchsten Schweizer Marktstandards. Elite-Lebensläufe, Motivationsschreiben und Coaching für ambitionierte Profile.",
    hero_cta: "MEINE ELITE-BEWERBUNG ERSTELLEN →",

    // ========== LANDING PAGE - PRESENTATION ==========
    section_engineering_title: "ENGINEERING IHRES ERFOLGS IN DER SCHWEIZ",
    section_engineering_subtitle: "Bewerben Sie sich nicht einfach. Dominieren Sie den Markt mit SwissGos Elite-Standards.",
    section_engineering_p1: "Willkommen bei SwissGo, dem Architekten Ihres beruflichen Aufstiegs. Wir korrigieren Ihre Dokumente nicht; wir optimieren Ihre Identität, um den selektivsten Anforderungen der Eidgenossenschaft gerecht zu werden.",
    section_engineering_p2: "Der Schweizer Markt verzeiht keine Annäherung. Wir schmieden für Sie ein komplettes Bewerbungsarsenal (Lebenslauf, Motivationsschreiben, Profil), kalibriert auf die unsichtbaren Codes der Schweizer HR: Nüchternheit, Präzision und Exzellenz.",
    section_engineering_card1: "Zertifizierte Schweizer Standards",
    section_engineering_card2: "Grenzgänger & Executive-Strategie",
    section_engineering_card3: "Sofortiger Zugang",
    section_engineering_cta: "DER OFFENSICHTLICHE KANDIDAT WERDEN",

    // ========== LANDING PAGE - PRODUCTS ==========
    prod_badge: "À la Carte 📋",
    prod_title: "Wesentliche Dokumente",
    prod_view_all: "Alle Angebote anzeigen 👁️",
    btn_choose: "Auswählen",
    btn_generate_now: "Jetzt generieren",

    // ========== LANDING PAGE - PACK INTEGRAL ==========
    section_integral_title: "Das ultimative Angebot",
    section_integral_subtitle: "Alles, was Sie zum Erfolg brauchen, in einem einzigartigen Paket.",
    section_integral_badge: "Die Wahl zukünftiger Grenzgänger",
    section_integral_cta: "Das komplette Paket erhalten",

    // ========== LANDING PAGE - TESTIMONIALS ==========
    section_testimonials_title: "Was sie über uns sagen",
    section_testimonials_subtitle: "Authentische Erfahrungsberichte unserer Kunden",

    // ========== PRICING PAGE ==========
    pricing_title: "Unsere Angebote",
    pricing_subtitle: "Investieren Sie in sich selbst",
    pricing_section_basics: "Die Grundlagen",
    pricing_section_integral: "Integrales Paket",
    pricing_badge_bestseller: "Bestseller",
    pricing_badge_top: "Top",
    pricing_badge_recommended: "Empfohlen",
    pricing_integral_subtitle: "Das komplette Toolkit für Ihre erfolgreiche Auswanderung.",
    pricing_integral_includes: "Im Paket enthalten:",
    pricing_btn_select: "Auswählen",
    pricing_btn_order: "Bestellen",

    // ========== PAYMENT MODAL ==========
    payment_secure: "Sichere Zahlung",
    payment_finalize_title: "Kauf abschließen",
    payment_total: "Zu zahlender Betrag:",
    payment_btn_pay: "Jetzt bezahlen",
    payment_security_badge: "🔒 100% sichere Zahlung • Sofortiger Zugang",
    payment_error_credits: "Fehler beim Hinzufügen von Credits. Bitte versuchen Sie es erneut.",

    // ========== UPSELL MODAL ==========
    upsell_badge: "Exklusives Angebot",
    upsell_title: "Warten Sie! Gehen Sie nicht mit leeren Händen.",
    upsell_description: "Upgraden Sie jetzt. Für nur {price} mehr erhalten Sie 50 zusätzliche Angebote (insgesamt 100) und meine exklusive Liste von 25 Zeitarbeitsfirmen mit direkten Bewerbungslinks.",
    upsell_initial_pack: "Anfangspaket",
    upsell_complete_pack: "Komplettes Paket",
    upsell_btn_accept: "JA, ICH MÖCHTE DIE 100 ANGEBOTE UND AGENTUREN",
    upsell_btn_decline: "Nein, ich behalte nur meine 50 Angebote",
    upsell_trust_badge: "🔒 Sichere Zahlung • 📥 Sofortiger Download • ✅ Zufriedenheit garantiert",

    // ========== GENERATE PAGE ==========
    gen_pack_header: "{packName} Paket",
    gen_credits_cv: "{count} Lebenslauf-Credits",
    gen_credits_lm: "{count} Anschreiben-Credits",
    gen_buy_credits: "Credits kaufen",
    gen_blocked_title: "Eingeschränkter Zugang",
    gen_blocked_cv: "Sie benötigen Lebenslauf-Credits, um auf dieses Formular zuzugreifen.",
    gen_blocked_lm: "Sie benötigen Anschreiben-Credits, um auf dieses Formular zuzugreifen.",
    gen_blocked_both: "Sie benötigen Lebenslauf- und Anschreiben-Credits, um auf dieses Formular zuzugreifen.",
    gen_blocked_subtitle: "Erst bezahlen, dann generieren.",
    gen_btn_generate: "Meine Bewerbung generieren",

    // ========== BUY CREDITS MODAL ==========
    buy_modal_title: "Ihr Konto aufladen",
    buy_modal_subtitle: "Wählen Sie die Option, die Ihren Bedürfnissen entspricht.",
    buy_modal_discovery: "Entdeckungsangebot",
    buy_modal_discovery_desc: "Zum Testen ohne Verpflichtung",
    buy_modal_free: "Kostenlos",
    buy_modal_pack_cv: "5 Lebensläufe Paket",
    buy_modal_pack_lm: "5 Anschreiben Paket",
    buy_modal_pack_duo: "Duo-Paket",
    buy_modal_pack_integral: "Integrales Paket",
    buy_modal_guide_included: "+ Expatriationsführer",
    buy_modal_credits_included: "20 Lebensläufe + 20 Anschreiben inklusive",
    buy_modal_badge_ultimate: "Ultimativ",
    buy_modal_security: "Sichere Zahlung. Rechnung nach dem Kauf verfügbar.",

    // ========== LOGIN PAGE ==========
    login_title: "Anmeldung",
    login_subtitle: "Zugang zu Ihrem Kandidatenbereich",
    login_email: "E-Mail",
    login_password: "Passwort",
    login_btn: "Anmelden",
    login_no_account: "Noch kein Konto?",
    login_signup: "Registrieren",
    login_forgot_password: "Passwort vergessen?",

    // ========== COMMON LABELS ==========
    lbl_firstname: "Vorname",
    lbl_lastname: "Nachname",
    lbl_email: "E-Mail",
    lbl_phone: "Telefon",
    lbl_address: "Adresse",
    lbl_city: "Stadt",
    lbl_zip: "Postleitzahl",
    lbl_nationality: "Nationalität",
    lbl_target_job: "Zielposition",
    lbl_company: "Unternehmen",

    // ========== COMMON BUTTONS ==========
    btn_close: "Schließen",
    btn_cancel: "Abbrechen",
    btn_confirm: "Bestätigen",
    btn_save: "Speichern",
    btn_delete: "Löschen",
    btn_edit: "Bearbeiten",
    btn_download: "Herunterladen",
    btn_back: "Zurück",
    btn_next: "Weiter",

    // ========== ERROR MESSAGES ==========
    error_required_field: "Dieses Feld ist erforderlich",
    error_invalid_email: "Ungültige E-Mail",
    error_auth_failed: "Authentifizierung fehlgeschlagen",
    error_network: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
    error_unknown: "Ein Fehler ist aufgetreten",
  },

  IT: {
    // ========== NAVIGATION ==========
    nav_home: "Home",
    nav_pricing: "Offerte",
    nav_contact: "Contatto",
    nav_candidate_space: "Area Candidati",
    nav_access_file: "Accedi al fascicolo",

    // ========== FOOTER ==========
    footer_desc: "L'eccellenza al servizio della vostra carriera. Accompagniamo candidati francofoni d'élite verso le opportunità più prestigiose della Confederazione Svizzera.",
    footer_nav: "Navigazione",
    footer_legal: "Legale",
    footer_swiss_made: "Swiss Made Excellence",
    footer_legal_mentions: "Note legali",
    footer_legal_cgv: "Condizioni Generali",
    footer_legal_privacy: "Privacy",

    // ========== LANDING PAGE - HERO ==========
    hero_badge: "SwissGo • Eccellenza Svizzera 🇨🇭",
    hero_title: "L'Arte dell'Eccellenza Svizzera.",
    hero_subtitle: "SwissGo accompagna lavoratori frontalieri ed expat: accesso ai più alti standard del mercato svizzero. CV, Lettere di Presentazione e Coaching d'élite per profili ambiziosi.",
    hero_cta: "CREA LA MIA CANDIDATURA D'ÉLITE →",

    // ========== LANDING PAGE - PRESENTATION ==========
    section_engineering_title: "L'INGEGNERIA DEL VOSTRO SUCCESSO IN SVIZZERA",
    section_engineering_subtitle: "Non candidatevi semplicemente. Dominate il mercato con gli standard d'élite di SwissGo.",
    section_engineering_p1: "Benvenuti in SwissGo, l'architetto della vostra ascesa professionale. Non correggiamo i vostri documenti; ottimizziamo la vostra identità per soddisfare i requisiti più selettivi della Confederazione.",
    section_engineering_p2: "Il mercato svizzero non perdona l'approssimazione. Forgiamo per voi un arsenale completo di candidature (CV, Lettera di Presentazione, Profilo) calibrato sui codici invisibili delle HR svizzere: Sobrietà, Precisione ed Eccellenza.",
    section_engineering_card1: "Standard Svizzeri Certificati",
    section_engineering_card2: "Strategia Frontaliera & Executive",
    section_engineering_card3: "Accesso Immediato",
    section_engineering_cta: "DIVENTARE IL CANDIDATO OVVIO",

    // ========== LANDING PAGE - PRODUCTS ==========
    prod_badge: "À la Carte 📋",
    prod_title: "Documenti Essenziali",
    prod_view_all: "Visualizza tutte le offerte 👁️",
    btn_choose: "Scegli",
    btn_generate_now: "Genera ora",

    // ========== LANDING PAGE - PACK INTEGRAL ==========
    section_integral_title: "L'Offerta Definitiva",
    section_integral_subtitle: "Tutto ciò di cui avete bisogno per avere successo, raggruppato in un pacchetto unico.",
    section_integral_badge: "La Scelta dei Futuri Frontalieri",
    section_integral_cta: "Ottieni il Pacchetto Completo",

    // ========== LANDING PAGE - TESTIMONIALS ==========
    section_testimonials_title: "Cosa dicono di noi",
    section_testimonials_subtitle: "Testimonianze autentiche dei nostri clienti",

    // ========== PRICING PAGE ==========
    pricing_title: "Le Nostre Offerte",
    pricing_subtitle: "Investi in te stesso",
    pricing_section_basics: "I Fondamentali",
    pricing_section_integral: "Pacchetto Integrale",
    pricing_badge_bestseller: "Best Seller",
    pricing_badge_top: "Top",
    pricing_badge_recommended: "Consigliato",
    pricing_integral_subtitle: "Il toolkit completo per riuscire nella vostra espatriazione.",
    pricing_integral_includes: "Incluso nel pacchetto:",
    pricing_btn_select: "Seleziona",
    pricing_btn_order: "Ordina",

    // ========== PAYMENT MODAL ==========
    payment_secure: "Pagamento Sicuro",
    payment_finalize_title: "Finalizza il tuo acquisto",
    payment_total: "Totale da pagare:",
    payment_btn_pay: "Paga ora",
    payment_security_badge: "🔒 Pagamento 100% sicuro • Accesso istantaneo",
    payment_error_credits: "Errore nell'aggiunta dei crediti. Riprova.",

    // ========== UPSELL MODAL ==========
    upsell_badge: "Offerta Esclusiva",
    upsell_title: "Aspetta! Non andartene a mani vuote.",
    upsell_description: "Fai l'upgrade ora. Per soli {price} in più, ricevi 50 offerte aggiuntive (100 totali) e la mia lista esclusiva di 25 agenzie interinali con link di candidatura diretti.",
    upsell_initial_pack: "Pacchetto Iniziale",
    upsell_complete_pack: "Pacchetto Completo",
    upsell_btn_accept: "SÌ, VOGLIO LE 100 OFFERTE E LE AGENZIE",
    upsell_btn_decline: "No, tengo solo le mie 50 offerte",
    upsell_trust_badge: "🔒 Pagamento sicuro • 📥 Download istantaneo • ✅ Soddisfazione garantita",

    // ========== GENERATE PAGE ==========
    gen_pack_header: "Pacchetto {packName}",
    gen_credits_cv: "{count} Crediti CV",
    gen_credits_lm: "{count} Crediti Lettera",
    gen_buy_credits: "Acquista Crediti",
    gen_blocked_title: "Accesso Limitato",
    gen_blocked_cv: "Hai bisogno di crediti CV per accedere a questo modulo.",
    gen_blocked_lm: "Hai bisogno di crediti Lettera di Presentazione per accedere a questo modulo.",
    gen_blocked_both: "Hai bisogno di crediti CV e Lettera per accedere a questo modulo.",
    gen_blocked_subtitle: "Paga prima, genera dopo.",
    gen_btn_generate: "Genera la mia candidatura",

    // ========== BUY CREDITS MODAL ==========
    buy_modal_title: "Ricarica il Tuo Conto",
    buy_modal_subtitle: "Scegli l'opzione adatta alle tue esigenze.",
    buy_modal_discovery: "Offerta Scoperta",
    buy_modal_discovery_desc: "Per testare senza impegno",
    buy_modal_free: "Gratuito",
    buy_modal_pack_cv: "Pacchetto 5 CV",
    buy_modal_pack_lm: "Pacchetto 5 Lettere",
    buy_modal_pack_duo: "Pacchetto Duo",
    buy_modal_pack_integral: "Pacchetto Integrale",
    buy_modal_guide_included: "+ Guida Espatrio",
    buy_modal_credits_included: "20 CV + 20 Lettere inclusi",
    buy_modal_badge_ultimate: "Definitivo",
    buy_modal_security: "Pagamento sicuro. Fattura disponibile dopo l'acquisto.",

    // ========== LOGIN PAGE ==========
    login_title: "Accesso",
    login_subtitle: "Accedi alla tua area candidati",
    login_email: "Email",
    login_password: "Password",
    login_btn: "Accedi",
    login_no_account: "Non hai ancora un account?",
    login_signup: "Registrati",
    login_forgot_password: "Password dimenticata?",

    // ========== COMMON LABELS ==========
    lbl_firstname: "Nome",
    lbl_lastname: "Cognome",
    lbl_email: "Email",
    lbl_phone: "Telefono",
    lbl_address: "Indirizzo",
    lbl_city: "Città",
    lbl_zip: "Codice Postale",
    lbl_nationality: "Nazionalità",
    lbl_target_job: "Posizione Obiettivo",
    lbl_company: "Azienda",

    // ========== COMMON BUTTONS ==========
    btn_close: "Chiudi",
    btn_cancel: "Annulla",
    btn_confirm: "Conferma",
    btn_save: "Salva",
    btn_delete: "Elimina",
    btn_edit: "Modifica",
    btn_download: "Scarica",
    btn_back: "Indietro",
    btn_next: "Avanti",

    // ========== ERROR MESSAGES ==========
    error_required_field: "Questo campo è obbligatorio",
    error_invalid_email: "Email non valida",
    error_auth_failed: "Autenticazione fallita",
    error_network: "Errore di rete. Riprova.",
    error_unknown: "Si è verificato un errore",
  }
};
