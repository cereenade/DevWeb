'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icone } from '@/components/Icone';
import { BadgeStatut, CarteLien, EnteteEcran } from '@/components/ui';
import { LANGUES, STATUTS, type DocumentAdmin } from '@/lib/data';
import { dateLongue, delaiEnMots, jaugeEcheance } from '@/lib/format';
import { basculerRappels, demarcheTerminee, etapesDe, progression, useEtatCharge } from '@/lib/store';
import { annoncer, demanderNotifications } from '@/lib/navigateur';

export function Document({ doc }: { doc: DocumentAdmin }) {
  const etat = useEtatCharge();
  const router = useRouter();
  const [explication, setExplication] = useState(false);

  const s = STATUTS[doc.statut];
  const langue = LANGUES.find((l) => l.code === etat.langue) || LANGUES[0];
  const traduction = doc.enClair[langue.code];
  const enClair = etat.lectureFacile && langue.code === 'fr'
    ? doc.enClairFacile
    : (traduction || doc.enClair.fr);
  const rappels = Boolean(etat.rappels[doc.id]);
  const terminee = demarcheTerminee(etat, doc);
  const part = progression(etat, doc);
  const faites = etapesDe(etat, doc).filter(Boolean).length;

  function basculer() {
    const actif = basculerRappels(doc.id);
    annoncer(actif ? 'Rappels activés.' : 'Rappels désactivés.');
    if (actif) demanderNotifications();
  }

  function supprimer() {
    if (confirm('Supprimer ce document et la démarche associée ? Cette action est définitive.')) {
      router.push('/documents');
    }
  }

  return (
    <>
      <EnteteEcran titre="Résultat de l'analyse" retour="/documents" />
      <div className="pile">

        <div className="carte">
          <div className="rangee">
            <span className="vignette" style={{ background: doc.teinte.fond, color: doc.teinte.texte }}>{doc.initiales}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="carte-titre" style={{ fontSize: '1.25rem' }}>{doc.organisme}</span>
              <span className="carte-detail">{doc.demarche}</span>
            </span>
          </div>
          <BadgeStatut cle={terminee ? 'termine' : doc.statut} />
        </div>

        <div className="carte carte--lavande">
          <div className="rangee" style={{ gap: 8 }}>
            <Icone nom="etincelle" taille={20} couleur="#5A48B8" />
            <h2 style={{ fontSize: '1.05rem', color: '#3F3372' }}>En clair</h2>
          </div>
          <p lang={langue.code} dir={langue.rtl ? 'rtl' : 'ltr'}
            style={{ fontSize: '1.04rem', lineHeight: 1.65, color: '#2F2B45', textAlign: langue.rtl ? 'right' : undefined }}>{enClair}</p>
          {!traduction && langue.code !== 'fr' && (
            <p style={{ fontSize: '.82rem', color: '#5A48B8' }}>Démonstration : ce document d&apos;exemple n&apos;est traduit qu&apos;en français. Le document France Travail montre les neuf langues.</p>
          )}
          <Link className="lien-texte" href="/langue"><Icone nom="globe" taille={16} /> Changer la langue de l&apos;explication</Link>
        </div>

        {doc.echeance && (
          <div className="carte">
            <div className="rangee">
              <span className="vignette" style={{ background: s.fond, color: s.texte }}><Icone nom="calendrier" taille={22} couleur={s.texte} /></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                <span style={{ fontSize: '.86rem', fontWeight: 700, color: 'var(--texte-3)' }}>Date limite</span>
                <span className="carte-titre" style={{ fontSize: '1.2rem' }}>{dateLongue(doc.echeance)}</span>
              </span>
            </div>
            <div className="rangee" style={{ padding: '12px 14px', background: 'var(--creme)', borderRadius: 14 }}>
              <div className="jauge"><span style={{ width: `${jaugeEcheance(doc.echeance)}%`, background: s.couleur }} /></div>
              <span style={{ fontSize: '.88rem', fontWeight: 800, color: s.texte }}>{delaiEnMots(doc.echeance)}</span>
            </div>
            <button type="button" className={`bouton ${rappels ? 'bouton--secondaire' : 'bouton--sombre'} bouton--bloc`}
              onClick={basculer} aria-pressed={rappels}>
              <Icone nom="cloche" taille={20} couleur={rappels ? '#1E5E3E' : '#fff'} />{rappels ? 'Rappels activés' : 'Activer les rappels'}
            </button>
            {rappels && (
              <div className="carte carte--plate apparition" style={{ background: 'var(--vert-clair)', border: 'none', gap: 8 }}>
                <strong style={{ fontSize: '.88rem', color: '#1E5E3E' }}>Vos rappels</strong>
                {['7 jours avant', '2 jours avant', 'Le jour même'].map((r) => (
                  <span key={r} className="rangee" style={{ gap: 8, fontSize: '.92rem' }}><Icone nom="coche" taille={16} couleur="#26714A" epaisseur={2.6} />{r}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="carte">
          <h2 style={{ fontSize: '1.05rem' }}>Le texte d&apos;origine</h2>
          <p style={{ fontStyle: 'italic', color: '#55535F', lineHeight: 1.65 }}>{doc.extrait}</p>
          <button type="button" className="bouton bouton--bloc" style={{ background: 'var(--lavande-clair)', color: 'var(--lavande-fonce)', boxShadow: 'none', minHeight: 52 }}
            onClick={() => setExplication(!explication)} aria-expanded={explication}>
            <Icone nom="etincelle" taille={20} couleur="#4737A0" />Expliquez-moi simplement
          </button>
          {explication && (
            <div className="carte carte--plate apparition" style={{ background: 'var(--creme)', gap: 6 }}>
              <strong style={{ fontSize: '.82rem', color: '#5A48B8' }}>En clair</strong>
              <p>{doc.extraitExplique}</p>
            </div>
          )}
        </div>

        {doc.etapes.length > 0 && (
          <Link className="carte" href={`/document/${doc.id}/etapes`}>
            <div className="rangee">
              <span className="vignette" style={{ background: 'var(--lavande-clair)', color: 'var(--lavande-fonce)' }}><Icone nom="demarches" taille={20} couleur="#5A48B8" /></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                <strong>{doc.etapes.length} étapes à suivre</strong>
                <span className="carte-detail">{faites} étape{faites > 1 ? 's' : ''} déjà faite{faites > 1 ? 's' : ''}</span>
              </span>
              <Icone nom="chevron" taille={18} couleur="#6E6C7A" epaisseur={2.2} />
            </div>
            <div className="jauge"><span style={{ width: `${Math.max(Math.round(part * 100), 2)}%`, background: terminee ? '#2F7D57' : 'var(--lavande)' }} /></div>
          </Link>
        )}

        <CarteLien href={`/document/${doc.id}/assistant`} icone="discussion">Une question sur ce document ?</CarteLien>

        <div className="rangee" style={{ gap: 10 }}>
          <button type="button" className="bouton bouton--secondaire" style={{ flexGrow: 1, minHeight: 52 }}><Icone nom="telecharger" taille={19} />Télécharger</button>
          <button type="button" className="bouton bouton--danger" style={{ flexGrow: 1, minHeight: 52 }} onClick={supprimer}><Icone nom="corbeille" taille={19} couleur="#9C362B" />Supprimer</button>
        </div>

        {doc.etapes.length > 0 && (
          <Link className="bouton bouton--bloc" href={`/document/${doc.id}/etapes`}>Ce que je dois faire <Icone nom="suivant" taille={20} couleur="#fff" /></Link>
        )}

        <p className="note-bas">Reçu le {dateLongue(doc.recuLe)} · Exemple de démonstration</p>
      </div>
    </>
  );
}
