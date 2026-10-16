'use client';

import Link from 'next/link';
import { Icone } from '@/components/Icone';
import { CarteDocument } from '@/components/ui';
import { BoutonInstaller } from '@/components/BoutonInstaller';
import { DOCUMENTS, NOTIFICATIONS, STATUTS, UTILISATEUR } from '@/lib/data';
import { delaiCourt } from '@/lib/format';
import { demarcheTerminee, ecrire, progression, useEtatCharge } from '@/lib/store';
import { useInstallable } from '@/lib/navigateur';

export function TableauDeBord() {
  const etat = useEtatCharge();
  const prenom = etat.compte?.prenom || UTILISATEUR.prenom;
  const aFaire = DOCUMENTS.filter((d) => d.echeance && !demarcheTerminee(etat, d));
  const rien = DOCUMENTS.filter((d) => !d.echeance || demarcheTerminee(etat, d));
  const prochaine = aFaire.slice().sort((a, b) => a.echeance!.localeCompare(b.echeance!))[0];
  const nonLues = NOTIFICATIONS.filter((n) => !etat.notificationsLues.includes(n.id)).length;

  return (
    <div className="pile">
      <div className="rangee-entre" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Bonjour {prenom}</h1>
          <p style={{ color: 'var(--texte-3)' }}>Voici ce qui nécessite votre attention.</p>
        </div>
        <Link className="bouton-icone" href="/notifications" aria-label={`Centre de notifications${nonLues ? `, ${nonLues} non lues` : ''}`} style={{ position: 'relative' }}>
          <Icone nom="cloche" taille={22} />
          {nonLues > 0 && <span style={{ position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 99, background: '#C0483B', border: '2px solid #fff' }} />}
        </Link>
      </div>

      <Link className="bouton bouton--bloc" href="/analyser" style={{ justifyContent: 'flex-start', gap: 14, padding: 18, borderRadius: 22, minHeight: 84 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,.18)' }}>
          <Icone nom="plus" taille={26} couleur="#fff" />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
          <span style={{ fontFamily: 'var(--police-titre)', fontSize: '1.15rem' }}>Analyser un document</span>
          <span style={{ fontSize: '.85rem', fontWeight: 600, color: '#E4DEFA' }}>Photo, PDF ou scan</span>
        </span>
      </Link>

      <BandeauInstallation masque={etat.installMasque} />

      <div className="rangee-entre">
        <h2 style={{ fontSize: '1.12rem' }}>À faire</h2>
        <Link className="lien-texte" href="/demarches">Tout voir</Link>
      </div>

      {aFaire.length
        ? aFaire.map((d) => <CarteDocument key={d.id} doc={d} part={progression(etat, d)} />)
        : (
          <div className="carte" style={{ alignItems: 'center', textAlign: 'center', padding: 26 }}>
            <Icone nom="coche" taille={34} couleur="#2F7D57" epaisseur={2.2} />
            <p style={{ fontWeight: 700 }}>Rien à faire pour le moment</p>
            <p className="carte-detail">Toutes vos démarches sont à jour.</p>
          </div>
        )}

      {rien.map((d) => {
        const s = STATUTS[d.statut];
        return (
          <div key={d.id} className="carte carte--plate" style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
            <span className="vignette" style={{ background: s.fond, color: s.texte }}><Icone nom={s.icone} taille={20} couleur={s.texte} epaisseur={2.2} /></span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link href={`/document/${d.id}`} style={{ fontWeight: 700, color: 'var(--anthracite)' }}>{d.organisme}</Link>
              <span className="carte-detail">{d.statut === 'termine' ? 'Aucune action nécessaire' : d.objet}</span>
            </span>
          </div>
        );
      })}

      {prochaine && (
        <Link className="carte carte--lavande" href="/echeances" style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <Icone nom="calendrier" taille={20} couleur="#5A48B8" />
          <p style={{ flexGrow: 1, color: '#4A4757' }}>Prochaine échéance <strong>{delaiCourt(prochaine.echeance)}</strong></p>
          <span className="lien-texte">Voir</span>
        </Link>
      )}
    </div>
  );
}

function BandeauInstallation({ masque }: { masque: boolean }) {
  const installable = useInstallable();
  if (masque || !installable) return null;
  return (
    <div className="bandeau-install">
      <Icone nom="telephone" taille={22} couleur="#4737A0" />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
        <strong>Installer LifeOS</strong>
        <span style={{ fontSize: '.86rem', color: 'var(--texte-2)' }}>Ouvrez l&apos;application depuis votre écran d&apos;accueil.</span>
      </span>
      <BoutonInstaller className="puce">Installer</BoutonInstaller>
      <button type="button" className="bouton-icone" onClick={() => ecrire({ installMasque: true })} aria-label="Masquer la proposition d'installation">
        <Icone nom="chevron" taille={18} />
      </button>
    </div>
  );
}
