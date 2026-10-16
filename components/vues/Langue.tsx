'use client';

import Link from 'next/link';
import { Icone } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';
import { LANGUES } from '@/lib/data';
import { DOCUMENTS_DEMO } from '@/lib/demo';
import { documentDemoDate } from '@/lib/demoDates';
import { choisirLangue } from '@/serveur/actions/preferences';

export function Langue({ langue }: { langue: string }) {
  const choisie = LANGUES.find((l) => l.code === langue) || LANGUES[0];
  const exemple = documentDemoDate(DOCUMENTS_DEMO[0]);
  const apercu = exemple.enClair[choisie.code] || exemple.enClair.fr;

  return (
    <>
      <EnteteEcran titre="Langue de l'explication" retour="/parametres" />
      <div className="pile">
        <p style={{ color: 'var(--texte-3)' }}>LifeOS reste en français. Choisissez la langue dans laquelle vous souhaitez que vos documents vous soient expliqués.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
          {LANGUES.map((l) => {
            const active = l.code === choisie.code;
            return (
              <button key={l.code} type="button" aria-pressed={active} onClick={() => choisirLangue(l.code)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 64, padding: '13px 15px', borderRadius: 16, textAlign: 'left',
                  background: active ? 'var(--lavande)' : '#fff', color: active ? '#fff' : 'var(--anthracite)', border: `1.5px solid ${active ? 'var(--lavande)' : 'var(--bordure-forte)'}`
                }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontWeight: 700 }}>{l.nom}</span>
                  <span style={{ fontSize: '.76rem', fontWeight: 600, color: active ? '#DDD6F7' : 'var(--texte-4)' }}>{l.sousTitre}</span>
                </span>
                {active && <Icone nom="coche" taille={20} couleur="#fff" epaisseur={2.6} />}
              </button>
            );
          })}
        </div>

        <div className="carte">
          <div className="rangee" style={{ gap: 9 }}>
            <Icone nom="etincelle" taille={20} couleur="#5A48B8" />
            <h2 style={{ fontSize: '1.05rem' }}>Aperçu de l&apos;explication</h2>
          </div>
          <p style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--texte-4)' }}>{exemple.organisme} — {exemple.demarche}</p>
          <p lang={choisie.code} dir={choisie.rtl ? 'rtl' : 'ltr'}
            style={{ padding: 16, background: 'var(--creme)', borderRadius: 16, lineHeight: 1.65, textAlign: choisie.rtl ? 'right' : undefined }}>{apercu}</p>
          <p style={{ fontSize: '.84rem', color: 'var(--texte-4)' }}>LifeOS ne traduit pas mot à mot : il réécrit le document en phrases simples dans la langue choisie.</p>
        </div>

        <div className="carte carte--lavande" style={{ flexDirection: 'row', gap: 10 }}>
          <Icone nom="info" taille={20} couleur="#5A48B8" />
          <p style={{ fontSize: '.9rem', color: '#3F3372' }}>L&apos;interface de LifeOS (menus, boutons, réglages) reste en français. Seules les explications de vos documents changent de langue.</p>
        </div>

        <Link className="bouton bouton--bloc" href="/tableau-de-bord">Enregistrer ce choix</Link>
      </div>
    </>
  );
}
