/* Icônes dessinées en SVG : jamais d'émoji dans l'interface,
   et toujours accompagnées d'un texte visible ou d'un aria-label. */

const TRACES = {
  accueil: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M6 9.8V20h12V9.8"/>',
  analyser: '<path d="M3.5 8.5v-3a2 2 0 0 1 2-2h3M15.5 3.5h3a2 2 0 0 1 2 2v3M20.5 15.5v3a2 2 0 0 1-2 2h-3M8.5 20.5h-3a2 2 0 0 1-2-2v-3"/><path d="M7.5 12h9"/>',
  demarches: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="m3.5 6.3 1.4 1.4 2.4-2.6M3.5 11.8l1.4 1.4 2.4-2.6M3.5 17.3l1.4 1.4 2.4-2.6"/>',
  documents: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2.5h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/>',
  cloche: '<path d="M18 16.5V11a6 6 0 1 0-12 0v5.5L4.5 19h15z"/><path d="M10 21.5h4"/>',
  calendrier: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  retour: '<path d="M19 12H5m0 0 6-6m-6 6 6 6"/>',
  suivant: '<path d="M5 12h14m0 0-6-6m6 6-6 6"/>',
  coche: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alerte: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5M12 16.4v.2"/>',
  attention: '<path d="M12 4.5 21 19.5H3z"/><path d="M12 10v3.4M12 16.6v.2"/>',
  info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.6v.2"/>',
  boite: '<rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M3.5 11.5h17M10 15.5h4"/>',
  cadenas: '<rect x="4.5" y="10" width="15" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/>',
  etincelle: '<path d="M12 3.6 13.9 9.2 19.6 11 13.9 12.8 12 18.4 10.1 12.8 4.4 11l5.7-1.8z"/>',
  photo: '<path d="M3.5 8.5a2 2 0 0 1 2-2h2.2l1.4-2h5.8l1.4 2h2.2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
  image: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 16.5 5-4.5 4 3.5 3-2.5 3 3.5"/>',
  televerser: '<path d="M12 16.5V4m0 0-5 5m5-5 5 5"/><path d="M4.5 15.5V19a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3.5"/>',
  telecharger: '<path d="M12 3v13m0 0-4.5-4.5M12 16l4.5-4.5"/><path d="M4.5 17v3h15v-3"/>',
  fichier: '<path d="M6.5 3.5h8l4 4v13a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5v-15A1.5 1.5 0 0 1 6.5 3.5z"/><path d="M14 3.5v4.5h4.5"/>',
  scan: '<path d="M3.5 8V5.5A2 2 0 0 1 5.5 3.5H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16"/><path d="M3.5 12h17"/>',
  discussion: '<path d="M20.5 12.2c0 4.1-3.8 7.4-8.5 7.4-1 0-2-.15-2.9-.42L4 20.5l1.5-3.4A6.9 6.9 0 0 1 3.5 12.2c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4z"/>',
  envoyer: '<path d="M4.5 19.5 20 12 4.5 4.5l2.6 7.5z"/>',
  recherche: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
  reglages: '<path d="M4 7.5h8M17.5 7.5h2.5M4 16.5h3.5M13 16.5h7"/><circle cx="14.5" cy="7.5" r="2.5"/><circle cx="10" cy="16.5" r="2.5"/>',
  aide: '<circle cx="12" cy="12" r="9.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.5M12 16.6v.2"/>',
  corbeille: '<path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5V19a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5"/>',
  oeil: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  texte: '<path d="M4 6.5h9M4 12h9M4 17.5h6"/><path d="M17 8.5v9M14 11.5l3-3 3 3"/>',
  telephone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  deconnexion: '<path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14"/><path d="M17 8.5 20.5 12 17 15.5M20.5 12h-9"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  courrier: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7 8.2 6 8.2-6"/>',
  reseau: '<path d="M3 4 21 20"/><path d="M5.5 10.5a11 11 0 0 1 4-2.4M15 8.4a11 11 0 0 1 3.6 2.1M8.6 14.2a6 6 0 0 1 6.8.6M12 19.4v.2"/>'
} as const;

export type NomIcone = keyof typeof TRACES;

interface ProprietesIcone {
  nom: NomIcone;
  taille?: number;
  couleur?: string;
  epaisseur?: number;
}

/* Les tracés sont des constantes du code : les injecter tels quels est sans risque. */
export function Icone({ nom, taille = 22, couleur = 'currentColor', epaisseur = 1.9 }: ProprietesIcone) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke={couleur}
      strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
      dangerouslySetInnerHTML={{ __html: TRACES[nom] }} />
  );
}

/** Le logo LifeOS. */
export function Logo({ taille = 32 }: { taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="9" fill="#6A57CC" />
      <path d="M9.5 8.5h7l2.5 2.5v9a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m11.4 15 2 2 3.6-3.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
