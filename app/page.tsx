/* Page d'accueil publique. Rendue sur le serveur : elle s'affiche avant même le chargement du JavaScript. */

import Link from 'next/link';
import { Icone, Logo, type NomIcone } from '@/components/Icone';
import { BadgeStatut } from '@/components/ui';
import { BoutonInstaller } from '@/components/BoutonInstaller';
import { RedirectionSiConnecte } from '@/components/Garde';
import { LANGUES } from '@/lib/data';

const ATOUT: React.CSSProperties = { gap: 8, fontSize: '.9rem', fontWeight: 600, color: 'var(--texte-2)' };

const ETAPES: { i: NomIcone; f: string; c: string; t: string; d: string }[] = [
  { i: 'photo', f: 'var(--lavande-clair)', c: '#4737A0', t: '1. Photographiez', d: 'Prenez en photo votre courrier ou importez votre PDF.' },
  { i: 'etincelle', f: 'var(--bleu-clair)', c: '#33509E', t: '2. Comprenez', d: 'LifeOS transforme le jargon administratif en explications simples, dans votre langue.' },
  { i: 'coche', f: 'var(--vert-clair)', c: '#1E5E3E', t: '3. Agissez', d: 'Suivez les étapes et recevez des rappels avant vos échéances.' }
];

const ORGANISMES = ['France Travail', 'CAF', 'Impôts', 'Assurance Maladie', 'Préfecture', 'Logement', 'Travail', 'Études'];

const CONFIDENTIALITE = [
  ['Supprimer un document', 'Chaque document peut être supprimé depuis sa fiche, à tout moment.'],
  ['Gérer mes données', 'Vous voyez ce qui est enregistré et vous pouvez l’exporter.'],
  ['Tout effacer', 'La suppression de votre compte efface vos documents et vos démarches.']
];

export default function Accueil() {
  return (
    <main id="contenu" className="ecran ecran--large" tabIndex={-1}>
      <RedirectionSiConnecte />
      <div className="landing">
        <header className="entete-site">
          <Link className="marque" href="/"><Logo taille={34} /><span>LifeOS</span></Link>
          <nav aria-label="Navigation du site">
            <a href="#comprendre">Comment ça marche</a>
            <a href="#organismes">Organismes</a>
            <a href="#langues">Langues</a>
            <a href="#confidentialite">Confidentialité</a>
          </nav>
          <Link className="lien-texte" href="/connexion" style={{ color: '#3B3947' }}>Se connecter</Link>
        </header>

        <section className="heros pile">
          <span className="etiquette"><Icone nom="etincelle" taille={16} epaisseur={2} />Vos papiers. En clair.</span>
          <h1>Comprenez enfin vos papiers administratifs.</h1>
          <p className="accroche">Prenez votre document en photo. LifeOS vous explique ce qu&apos;il signifie, ce que vous devez faire et avant quelle date.</p>
          <Link className="bouton bouton--bloc" href="/connexion"><Icone nom="photo" taille={22} />Analyser mon premier document</Link>
          <a className="bouton bouton--secondaire bouton--bloc" href="#comprendre">Voir comment ça marche</a>
          <div className="rangee" style={{ flexWrap: 'wrap', gap: 18, marginTop: 4 }}>
            <span className="rangee" style={ATOUT}>
              <Icone nom="cadenas" taille={18} couleur="#5A48B8" epaisseur={2} />Vos documents restent privés
            </span>
            <span className="rangee" style={ATOUT}>
              <Icone nom="telephone" taille={18} couleur="#5A48B8" epaisseur={2} />Installable sur votre téléphone
            </span>
          </div>
        </section>

        <section className="pile" style={{ marginTop: 44 }}>
          <div className="carte carte--plate" style={{ background: 'var(--creme-2)', border: 'none' }}>
            <span className="titre-section">Votre document</span>
            <p style={{ fontStyle: 'italic', color: '#55535F', lineHeight: 1.7 }}>« À défaut d&apos;actualisation de votre situation avant la date indiquée, votre inscription sur la liste des demandeurs d&apos;emploi pourra cesser. »</p>
          </div>
          <div className="rangee" style={{ justifyContent: 'center', gap: 10 }}>
            <Icone nom="suivant" taille={24} couleur="#B9AEEB" epaisseur={2} />
            <span className="statut" style={{ background: 'var(--lavande)', color: '#fff', padding: '9px 15px', fontSize: '.88rem' }}>
              <Icone nom="etincelle" taille={15} couleur="#fff" epaisseur={1.9} />LifeOS analyse
            </span>
            <Icone nom="suivant" taille={24} couleur="#B9AEEB" epaisseur={2} />
          </div>
          <div className="carte">
            <div className="rangee-entre">
              <span className="carte-titre" style={{ fontSize: '1.2rem' }}>France Travail</span>
              <BadgeStatut cle="action" />
            </div>
            <p>Vous devez effectuer votre actualisation mensuelle.</p>
            <span className="rangee" style={{ gap: 9, padding: '10px 13px', background: 'var(--creme)', border: '1px solid var(--bordure)', borderRadius: 13, fontWeight: 700, fontSize: '.92rem', alignSelf: 'flex-start' }}>
              <Icone nom="calendrier" taille={17} couleur="#A4382D" epaisseur={2} />Avant le 28 septembre
            </span>
            <ul className="pile-s">
              {['Connectez-vous à France Travail', 'Effectuez votre actualisation', 'Vérifiez vos informations', 'Validez'].map((e) => (
                <li key={e} className="rangee" style={{ gap: 10, fontSize: '.96rem' }}>
                  <Icone nom="coche" taille={18} couleur="#2F7D57" epaisseur={2.6} />{e}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="comprendre" className="pile" style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: '1.9rem' }}>Comment ça marche ?</h2>
          <div className="grille-3">
            {ETAPES.map((b) => (
              <div key={b.t} className="carte">
                <span className="vignette" style={{ background: b.f, color: b.c }}><Icone nom={b.i} taille={24} couleur={b.c} /></span>
                <h3 style={{ fontSize: '1.3rem' }}>{b.t}</h3>
                <p style={{ color: 'var(--texte-2)' }}>{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="organismes" className="pile" style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: '1.9rem' }}>Un seul endroit pour comprendre vos démarches.</h2>
          <div className="grille-2">
            {ORGANISMES.map((o) => (
              <span key={o} className="carte carte--plate" style={{ alignItems: 'center', justifyContent: 'center', padding: '16px 12px', fontWeight: 700, fontSize: '.95rem', textAlign: 'center' }}>{o}</span>
            ))}
          </div>
          <p className="note-bas">LifeOS est un service indépendant. LifeOS n&apos;est pas un service officiel de ces organismes et n&apos;a aucun partenariat avec eux.</p>
        </section>

        <section id="langues" className="pile" style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: '1.9rem' }}>Comprenez dans la langue que vous maîtrisez le mieux.</h2>
          <p style={{ color: 'var(--texte-2)' }}>LifeOS ne traduit pas mot à mot : il réécrit le document en phrases simples, dans votre langue. L&apos;interface, elle, reste en français.</p>
          <div className="rangee" style={{ flexWrap: 'wrap', gap: 8 }}>
            {LANGUES.map((l) => (
              <span key={l.code} className="puce" style={{ display: 'inline-flex', alignItems: 'center' }}>{l.nom}</span>
            ))}
          </div>
        </section>

        <section id="installer-pwa" className="carte carte--lavande" style={{ marginTop: 56, padding: 26 }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2F2B45' }}>Une application à installer, pas un logiciel à télécharger.</h2>
          <p style={{ color: '#3F3372' }}>LifeOS s&apos;ajoute à votre écran d&apos;accueil en un appui, depuis votre navigateur. L&apos;appareil photo s&apos;ouvre directement, les rappels arrivent comme des notifications et vos explications restent lisibles hors connexion.</p>
          <BoutonInstaller className="bouton bouton--bloc"><Icone nom="telecharger" taille={20} couleur="#fff" />Installer LifeOS</BoutonInstaller>
        </section>

        <section id="confidentialite" className="pile" style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: '1.9rem' }}>Vos documents vous appartiennent.</h2>
          <p style={{ color: 'var(--texte-2)' }}>Un courrier administratif contient des informations personnelles. LifeOS les utilise uniquement pour vous expliquer votre démarche, et vous gardez la main dessus.</p>
          <div className="grille-3">
            {CONFIDENTIALITE.map(([t, d]) => (
              <div key={t} className="carte"><h3 style={{ fontSize: '1.1rem' }}>{t}</h3><p style={{ color: 'var(--texte-2)' }}>{d}</p></div>
            ))}
          </div>
        </section>

        <section className="bloc-sombre" style={{ marginTop: 56 }}>
          <h2>Le prochain courrier, vous le comprendrez.</h2>
          <p>Créez votre compte, photographiez votre premier document et voyez ce que LifeOS en fait.</p>
          <Link className="bouton bouton--bloc" href="/connexion">Analyser mon premier document</Link>
        </section>

        <footer className="pied-site">
          <span className="marque"><Logo taille={28} /><span style={{ fontSize: '1.05rem' }}>LifeOS</span></span>
          <p className="note-bas" style={{ textAlign: 'left' }}>LifeOS est un service indépendant d&apos;aide à la compréhension des documents administratifs. Il ne remplace pas les organismes officiels et n&apos;a aucun partenariat avec eux.</p>
        </footer>
      </div>
    </main>
  );
}
