/* Données de démonstration de LifeOS.
   Contenus fictifs, réalistes mais clairement destinés à la démonstration.
   Dans une version réelle, ces objets viendraient de l'analyse du document importé. */

export const UTILISATEUR = { prenom: 'Camille', email: 'camille@exemple.fr' };

export const LANGUES = [
  { code: 'fr', nom: 'Français simple', sousTitre: 'Langue par défaut', rtl: false },
  { code: 'en', nom: 'English', sousTitre: 'Anglais', rtl: false },
  { code: 'es', nom: 'Español', sousTitre: 'Espagnol', rtl: false },
  { code: 'tr', nom: 'Türkçe', sousTitre: 'Turc', rtl: false },
  { code: 'ar', nom: 'العربية', sousTitre: 'Arabe', rtl: true },
  { code: 'pt', nom: 'Português', sousTitre: 'Portugais', rtl: false },
  { code: 'it', nom: 'Italiano', sousTitre: 'Italien', rtl: false },
  { code: 'de', nom: 'Deutsch', sousTitre: 'Allemand', rtl: false },
  { code: 'zh', nom: '中文', sousTitre: 'Chinois', rtl: false }
];

export const CATEGORIES = [
  'Tous', 'France Travail', 'CAF', 'Impôts', 'Assurance Maladie', 'Préfecture',
  'Logement', 'Travail', 'Études', 'Banque', 'Assurance', 'Autres'
];

export const STATUTS = {
  action: { libelle: 'Action nécessaire', classe: 'statut--action', couleur: '#C0483B', fond: '#FBE9E6', texte: '#A4382D', icone: 'alerte' },
  verifier: { libelle: 'À vérifier', classe: 'statut--verifier', couleur: '#C97C22', fond: '#FAEFDF', texte: '#8A5310', icone: 'attention' },
  info: { libelle: 'Pour information', classe: 'statut--info', couleur: '#3A57A8', fond: '#E9EFFB', texte: '#33509E', icone: 'info' },
  termine: { libelle: 'Terminé', classe: 'statut--termine', couleur: '#2F7D57', fond: '#E6F2EB', texte: '#1E5E3E', icone: 'coche' },
  archive: { libelle: 'Archivé', classe: 'statut--archive', couleur: '#8B8896', fond: '#EFEDE9', texte: '#5E5C6B', icone: 'boite' }
};

/* Le document du parcours principal : traduit et simplifié dans les neuf langues. */
const EN_CLAIR_ACTUALISATION = {
  fr: 'France Travail vous demande de déclarer votre situation pour ce mois-ci. Vous devez effectuer votre actualisation avant le 28 septembre 2026 afin de maintenir votre inscription et, selon votre situation, le versement de vos allocations.',
  en: 'France Travail needs you to report your situation for this month. You must complete your update before 28 September 2026 to stay registered and, depending on your situation, keep receiving your benefits.',
  es: 'France Travail necesita que declares tu situación de este mes. Debes hacer tu actualización antes del 28 de septiembre de 2026 para seguir inscrito y, según tu situación, seguir cobrando tus prestaciones.',
  tr: 'France Travail bu aya ait durumunuzu bildirmenizi istiyor. Kaydınızın devam etmesi ve durumunuza göre ödemelerinizin sürmesi için 28 Eylül 2026 tarihinden önce güncellemenizi yapmalısınız.',
  ar: 'تطلب منك France Travail الإبلاغ عن وضعك لهذا الشهر. يجب إتمام التحديث قبل 28 سبتمبر 2026 للحفاظ على تسجيلك، وبحسب وضعك، على صرف مخصصاتك.',
  pt: 'A France Travail pede que declare a sua situação deste mês. Deve fazer a atualização antes de 28 de setembro de 2026 para manter a sua inscrição e, conforme a sua situação, continuar a receber as prestações.',
  it: 'France Travail ti chiede di dichiarare la tua situazione di questo mese. Devi effettuare l’aggiornamento entro il 28 settembre 2026 per mantenere l’iscrizione e, a seconda della tua situazione, continuare a ricevere l’indennità.',
  de: 'France Travail bittet Sie, Ihre Situation für diesen Monat zu melden. Sie müssen die Aktualisierung vor dem 28. September 2026 vornehmen, um eingeschrieben zu bleiben und, je nach Situation, weiterhin Leistungen zu erhalten.',
  zh: 'France Travail 要求您申报本月的情况。请在 2026 年 9 月 28 日前完成月度更新，以保持您的登记状态，并根据您的情况继续领取补助。'
};

export const DOCUMENTS = [
  {
    id: 'france-travail-actualisation',
    organisme: 'France Travail',
    initiales: 'FT',
    categorie: 'France Travail',
    objet: 'Actualisation — Septembre 2026',
    demarche: 'Actualisation mensuelle',
    recuLe: '2026-09-18',
    echeance: '2026-09-28',
    statut: 'action',
    teinte: { fond: '#E9EFFB', texte: '#33509E' },
    enClair: EN_CLAIR_ACTUALISATION,
    enClairFacile: 'Vous devez dire à France Travail ce que vous avez fait ce mois-ci. On appelle cela l’actualisation. C’est à faire avant le 28 septembre.',
    extrait: '« Vous devez procéder à l’actualisation mensuelle de votre situation entre le 28 du mois et le 15 du mois suivant. À défaut d’actualisation de votre situation avant la date indiquée, votre inscription sur la liste des demandeurs d’emploi pourra cesser. »',
    extraitExplique: 'Si vous ne faites pas votre actualisation avant la date limite, France Travail peut mettre fin à votre inscription comme demandeur d’emploi.',
    etapes: [
      'Connectez-vous à votre espace France Travail',
      'Cliquez sur « M’actualiser »',
      'Déclarez votre situation du mois',
      'Vérifiez vos informations',
      'Validez votre actualisation',
      'Conservez votre confirmation'
    ],
    questions: [
      { q: 'Est-ce que je dois répondre ?', r: 'Oui. Ce document demande une action de votre part : votre actualisation mensuelle, à faire avant le 28 septembre 2026.' },
      { q: 'Quels documents dois-je envoyer ?', r: 'Aucun document à envoyer ici. Vous déclarez simplement votre situation du mois : si vous avez travaillé, vos heures et vos salaires.' },
      { q: 'Où dois-je faire cette démarche ?', r: 'Depuis votre espace personnel France Travail, sur leur site ou leur application, rubrique « M’actualiser ». C’est aussi possible par téléphone.' },
      { q: 'Que se passe-t-il si je dépasse la date ?', r: 'Votre inscription comme demandeur d’emploi peut prendre fin, et le versement de vos allocations peut être interrompu. Contactez France Travail rapidement si la date est dépassée.' },
      { q: 'Expliquez-moi cette phrase.', r: '« À défaut d’actualisation » veut dire « si vous ne faites pas votre actualisation ». En clair : sans actualisation avant la date, votre inscription peut s’arrêter.' }
    ]
  },
  {
    id: 'caf-justificatif',
    organisme: 'CAF',
    initiales: 'CAF',
    categorie: 'CAF',
    objet: 'Demande de justificatif de domicile',
    demarche: 'Envoyer un justificatif',
    recuLe: '2026-09-15',
    echeance: '2026-10-04',
    statut: 'verifier',
    teinte: { fond: '#FAEFDF', texte: '#8A5310' },
    enClair: {
      fr: 'La CAF a besoin d’une preuve de votre adresse actuelle pour continuer à calculer vos droits. Vous devez envoyer un justificatif de domicile de moins de trois mois avant le 4 octobre 2026.'
    },
    enClairFacile: 'La CAF veut une preuve de votre adresse. Envoyez une facture récente avant le 4 octobre.',
    extrait: '« En l’absence de production des pièces justificatives sollicitées dans le délai imparti, le versement de vos prestations est susceptible d’être suspendu. »',
    extraitExplique: 'Si vous n’envoyez pas le document demandé à temps, la CAF peut arrêter de vous verser vos aides.',
    etapes: [
      'Trouvez un justificatif de moins de trois mois (facture d’électricité, quittance de loyer)',
      'Photographiez-le entièrement, bien à plat',
      'Connectez-vous à votre espace CAF',
      'Ouvrez « Transmettre un document »',
      'Envoyez le justificatif',
      'Vérifiez que la CAF l’a bien reçu'
    ],
    questions: [
      { q: 'Quels documents dois-je envoyer ?', r: 'Un justificatif de domicile de moins de trois mois : facture d’électricité, de gaz, d’internet, ou une quittance de loyer à votre nom.' },
      { q: 'Est-ce que je dois répondre ?', r: 'Oui. Sans ce document avant le 4 octobre 2026, le versement de vos aides peut être suspendu.' },
      { q: 'Où dois-je faire cette démarche ?', r: 'Dans votre espace personnel CAF, rubrique « Transmettre un document ». Vous pouvez aussi le déposer dans un accueil CAF.' }
    ]
  },
  {
    id: 'assurance-maladie-situation',
    organisme: 'Assurance Maladie',
    initiales: 'AM',
    categorie: 'Assurance Maladie',
    objet: 'Mise à jour de situation',
    demarche: 'Mise à jour de situation',
    recuLe: '2026-09-11',
    echeance: null,
    statut: 'termine',
    teinte: { fond: '#E6F2EB', texte: '#1E5E3E' },
    enClair: {
      fr: 'L’Assurance Maladie confirme que votre situation a bien été mise à jour. Aucune action n’est nécessaire de votre part.'
    },
    enClairFacile: 'Tout est en ordre. Vous n’avez rien à faire.',
    extrait: '« Nous accusons réception de votre déclaration de changement de situation, laquelle a été prise en compte à la date susmentionnée. »',
    extraitExplique: 'Votre changement de situation a bien été enregistré.',
    etapes: [],
    questions: [
      { q: 'Est-ce que je dois répondre ?', r: 'Non. Ce courrier vous informe simplement que votre dossier est à jour. Conservez-le.' }
    ]
  },
  {
    id: 'impots-avis',
    organisme: 'Impôts',
    initiales: 'IMP',
    categorie: 'Impôts',
    objet: 'Avis d’impôt 2026',
    demarche: 'Avis d’impôt sur le revenu',
    recuLe: '2026-09-02',
    echeance: null,
    statut: 'info',
    teinte: { fond: '#F1EEFC', texte: '#4737A0' },
    enClair: {
      fr: 'Cet avis récapitule le montant de votre impôt sur le revenu pour l’année. Il sert aussi de justificatif pour d’autres démarches, par exemple une demande de logement.'
    },
    enClairFacile: 'Ce papier dit combien d’impôt vous devez. Gardez-le : on vous le demandera pour d’autres démarches.',
    extrait: '« Le présent avis constitue un titre exécutoire au sens des dispositions du livre des procédures fiscales. »',
    extraitExplique: 'Ce document a une valeur officielle : il peut être utilisé pour réclamer le paiement de l’impôt.',
    etapes: ['Vérifiez que vos informations sont correctes', 'Conservez l’avis avec vos documents importants'],
    questions: [
      { q: 'Est-ce que je dois répondre ?', r: 'Non, sauf si une somme reste à payer ou si une information est fausse. Dans ce cas, contactez votre centre des finances publiques.' }
    ]
  },
  {
    id: 'prefecture-titre',
    organisme: 'Préfecture',
    initiales: 'PRE',
    categorie: 'Préfecture',
    objet: 'Renouvellement de titre de séjour',
    demarche: 'Rendez-vous en préfecture',
    recuLe: '2026-08-28',
    echeance: '2026-11-12',
    statut: 'info',
    teinte: { fond: '#F4F2ED', texte: '#4A4757' },
    enClair: {
      fr: 'La préfecture vous donne un rendez-vous le 12 novembre 2026 pour votre dossier. Vous devez vous présenter avec les documents demandés dans le courrier.'
    },
    enClairFacile: 'Vous avez un rendez-vous le 12 novembre. Apportez tous les papiers demandés.',
    extrait: '« Vous voudrez bien vous présenter, muni de l’intégralité des pièces mentionnées en annexe, au guichet susvisé à la date et l’heure indiquées. »',
    extraitExplique: 'Venez au guichet le jour et à l’heure du rendez-vous, avec tous les documents listés en annexe.',
    etapes: [
      'Notez la date et l’heure du rendez-vous',
      'Rassemblez les pièces listées en annexe',
      'Faites des photocopies de chaque pièce',
      'Présentez-vous au guichet le jour du rendez-vous'
    ],
    questions: [
      { q: 'Que se passe-t-il si je dépasse la date ?', r: 'Un rendez-vous manqué doit être repris, ce qui peut prendre du temps. Prévenez la préfecture le plus tôt possible si vous ne pouvez pas venir.' }
    ]
  }
];

/* Étapes affichées pendant l'analyse d'un document. */
export const ETAPES_ANALYSE = [
  'Identification de l’organisme',
  'Lecture du document',
  'Recherche des informations importantes',
  'Identification des démarches à effectuer',
  'Détection des dates limites'
];

export const NOTIFICATIONS = [
  {
    id: 'n1',
    titre: 'N’oubliez pas votre actualisation France Travail',
    texte: 'Il vous reste 2 jours pour effectuer votre actualisation.',
    quand: 'Aujourd’hui',
    ton: 'action',
    lien: '#/document/france-travail-actualisation/etapes',
    action: 'Voir les étapes'
  },
  {
    id: 'n2',
    titre: 'CAF — Justificatif demandé',
    texte: 'Un document est à envoyer avant le 4 octobre.',
    quand: 'Il y a 3 jours',
    ton: 'verifier',
    lien: '#/document/caf-justificatif',
    action: 'Voir le document'
  },
  {
    id: 'n3',
    titre: 'Démarche terminée',
    texte: 'Votre mise à jour Assurance Maladie est enregistrée.',
    quand: 'Il y a 5 jours',
    ton: 'termine',
    lien: '#/document/assurance-maladie-situation',
    action: 'Voir le document'
  }
];

export function documentParId(id) {
  return DOCUMENTS.find((d) => d.id === id) || null;
}
