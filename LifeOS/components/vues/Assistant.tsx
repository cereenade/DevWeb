'use client';

import { Fragment, useState, type FormEvent } from 'react';
import { Icone } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';
import type { DocumentAdmin } from '@/lib/data';

function Avatar() {
  return <span className="avatar"><Icone nom="etincelle" taille={18} couleur="#fff" /></span>;
}

export function Assistant({ doc }: { doc: DocumentAdmin }) {
  const [posees, setPosees] = useState<number[]>([]);
  const restantes = doc.questions.map((_, i) => i).filter((i) => !posees.includes(i));

  function poserLibre(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const champ = ev.currentTarget.elements.namedItem('question') as HTMLInputElement;
    if (champ.value.trim()) {
      alert('Démonstration : les questions libres ne sont pas encore reliées à une analyse réelle. Utilisez les suggestions proposées.');
      champ.value = '';
    }
  }

  return (
    <>
      <EnteteEcran titre="Assistant LifeOS" retour={`/document/${doc.slug}`} />
      <div className="pile">
        <div className="carte carte--lavande" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
          <Icone nom="fichier" taille={18} couleur="#5A48B8" />
          <p style={{ fontSize: '.88rem', color: '#3F3372' }}>Vos réponses portent sur : <strong>{doc.organisme} — {doc.demarche}</strong></p>
        </div>

        <div className="fil">
          <div className="rangee" style={{ alignItems: 'flex-start', gap: 10 }}>
            <Avatar />
            <p className="bulle bulle--lifeos">Bonjour. Posez-moi votre question sur ce document, je réponds en français simple.</p>
          </div>
          {posees.map((i) => (
            <Fragment key={i}>
              <p className="bulle bulle--moi apparition">{doc.questions[i].q}</p>
              <div className="rangee apparition" style={{ alignItems: 'flex-start', gap: 10 }}>
                <Avatar />
                <p className="bulle bulle--lifeos">{doc.questions[i].r}</p>
              </div>
            </Fragment>
          ))}
        </div>

        {restantes.length > 0 && (
          <div className="pile-s">
            <span className="titre-section">Suggestions</span>
            {restantes.map((i) => (
              <button key={i} type="button" className="carte carte--plate"
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 48, padding: '12px 16px', textAlign: 'left', fontWeight: 600, cursor: 'pointer', width: '100%' }}
                onClick={() => setPosees([...posees, i])}>
                {doc.questions[i].q}<Icone nom="chevron" taille={16} couleur="#6A57CC" epaisseur={2.2} />
              </button>
            ))}
          </div>
        )}

        <form className="zone-saisie" onSubmit={poserLibre}>
          <label className="visuellement-cache" htmlFor="question">Votre question</label>
          <input id="question" name="question" type="text" placeholder="Posez votre question à LifeOS…" autoComplete="off" />
          <button type="submit" className="envoyer" aria-label="Envoyer la question"><Icone nom="envoyer" taille={20} couleur="#fff" /></button>
        </form>
        <p className="note-bas">Démonstration : les réponses libres ne sont pas encore branchées sur une analyse réelle.</p>
      </div>
    </>
  );
}
