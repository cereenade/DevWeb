'use client';

import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { Icone } from '@/components/Icone';
import { CarteLien, EnteteEcran } from '@/components/ui';
import type { DocumentAdmin } from '@/lib/data';
import { dateLongue } from '@/lib/format';
import { basculerEtape } from '@/serveur/actions/documents';
import { annoncer, notifierLocalement } from '@/lib/navigateur';

export function Etapes({ doc }: { doc: DocumentAdmin }) {
  /* La case se coche tout de suite ; la base suit en arrière-plan. */
  const [faites, cocher] = useOptimistic(doc.etapesFaites, (liste: boolean[], index: number) =>
    liste.map((f, i) => (i === index ? !f : f)));
  const [, demarrer] = useTransition();
  const nb = faites.filter(Boolean).length;
  const terminee = nb === doc.etapes.length;

  function basculer(index: number) {
    demarrer(async () => {
      cocher(index);
      const liste = await basculerEtape(doc.slug, index);
      if (liste.length && liste.every(Boolean)) {
        annoncer('Démarche terminée. LifeOS ne vous enverra plus de rappel pour cette échéance.');
        notifierLocalement('Démarche terminée', `${doc.demarche} : c'est fait.`);
      }
    });
  }

  return (
    <>
      <EnteteEcran titre="Ce que vous devez faire" retour={`/document/${doc.slug}`} />
      <div className="pile">
        <div className="carte">
          <div>
            <span className="carte-titre">{doc.demarche}</span>
            {doc.echeance && <p className="carte-detail">À effectuer avant le {dateLongue(doc.echeance)}</p>}
          </div>
          <div className="rangee">
            <div className="jauge"><span style={{ width: `${Math.round((nb / doc.etapes.length) * 100)}%`, background: terminee ? '#2F7D57' : 'var(--lavande)' }} /></div>
            <span style={{ fontSize: '.88rem', fontWeight: 800, color: 'var(--texte-2)' }}>{nb} / {doc.etapes.length}</span>
          </div>
        </div>

        <ul className="pile-s">
          {doc.etapes.map((e, i) => (
            <li key={e}>
              <button type="button" className="etape" aria-pressed={faites[i]} onClick={() => basculer(i)}>
                <span className="etape-case">{faites[i] ? <Icone nom="coche" taille={18} couleur="#fff" epaisseur={2.8} /> : i + 1}</span>
                <span className="etape-texte">{e}</span>
              </button>
            </li>
          ))}
        </ul>

        {terminee ? (
          <div className="carte surgit" style={{ background: 'var(--vert-clair)', border: 'none', alignItems: 'center', textAlign: 'center', padding: 26 }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 99, background: '#2F7D57' }}>
              <Icone nom="coche" taille={34} couleur="#fff" epaisseur={3} />
            </span>
            <h2 style={{ fontSize: '1.35rem', color: '#1B5138' }}>Démarche terminée !</h2>
            <p style={{ color: '#2C4F3E' }}>Vous avez terminé cette démarche. LifeOS ne vous enverra plus de rappel pour cette échéance.</p>
            <Link className="bouton bouton--bloc" style={{ background: '#2F7D57', boxShadow: 'none' }} href="/tableau-de-bord">Revenir à l&apos;accueil</Link>
          </div>
        ) : (
          <div className="carte carte--lavande">
            <div className="rangee" style={{ gap: 9 }}>
              <Icone nom="cloche" taille={20} couleur="#4737A0" />
              <h2 style={{ fontSize: '1rem', color: '#3F3372' }}>LifeOS vous rappellera</h2>
            </div>
            <p style={{ color: '#2F2B45' }}>Vous recevrez un rappel 7 jours, 2 jours et le jour même de l&apos;échéance, tant que la démarche n&apos;est pas terminée.</p>
          </div>
        )}

        <CarteLien href={`/document/${doc.slug}/assistant`} icone="discussion">Une étape n&apos;est pas claire ?</CarteLien>

        <Link className="bouton bouton--secondaire bouton--bloc" href="/echeances"><Icone nom="calendrier" taille={20} />Voir mes échéances</Link>
      </div>
    </>
  );
}
