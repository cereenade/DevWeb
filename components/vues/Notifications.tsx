'use client';

import Link from 'next/link';
import { Icone } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';
import { NOTIFICATIONS, STATUTS } from '@/lib/data';
import { ecrire, useEtatCharge } from '@/lib/store';
import { annoncer, demanderNotifications } from '@/lib/navigateur';

export function Notifications() {
  const etat = useEtatCharge();

  function toutLu() {
    ecrire({ notificationsLues: NOTIFICATIONS.map((n) => n.id) });
    annoncer('Toutes les notifications sont marquées comme lues.');
  }

  return (
    <>
      <EnteteEcran titre="Notifications" retour="/tableau-de-bord">
        <Link className="bouton-icone" href="/parametres" aria-label="Réglages des notifications"><Icone nom="reglages" taille={20} /></Link>
      </EnteteEcran>

      <div className="pile">
        {NOTIFICATIONS.map((n) => {
          const s = STATUTS[n.ton];
          const lue = etat.notificationsLues.includes(n.id);
          return (
            <div key={n.id} className={`carte${lue ? ' carte--plate' : ''}`} style={{ flexDirection: 'row', gap: 13, borderColor: lue ? undefined : '#E0DBF4' }}>
              <span className="vignette" style={{ background: s.fond, color: s.texte }}><Icone nom={s.icone} taille={20} couleur={s.texte} epaisseur={2.1} /></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
                <span className="rangee-entre">
                  <strong style={{ fontSize: '1rem' }}>{n.titre}</strong>
                  <span style={{ fontSize: '.78rem', color: '#8B8896', whiteSpace: 'nowrap' }}>{n.quand}</span>
                </span>
                <span style={{ fontSize: '.92rem', color: 'var(--texte-2)' }}>{n.texte}</span>
                <Link className="puce" href={n.lien} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>{n.action}</Link>
              </span>
            </div>
          );
        })}

        <button type="button" className="bouton bouton--secondaire bouton--bloc" onClick={toutLu}>
          <Icone nom="coche" taille={19} epaisseur={2.2} />Tout marquer comme lu
        </button>

        <div className="carte carte--lavande" style={{ flexDirection: 'row', gap: 10 }}>
          <Icone nom="cloche" taille={20} couleur="#5A48B8" />
          <span style={{ flexGrow: 1 }}>
            <strong style={{ display: 'block', color: '#3F3372' }}>Recevoir les rappels sur cet appareil</strong>
            <span style={{ fontSize: '.88rem', color: '#4A4757' }}>Autorisez les notifications pour être prévenu avant vos échéances.</span>
          </span>
          <button type="button" className="puce" onClick={demanderNotifications}>Autoriser</button>
        </div>
      </div>
    </>
  );
}
