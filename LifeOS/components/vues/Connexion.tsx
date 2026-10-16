'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { Icone, Logo } from '@/components/Icone';
import { Separateur } from '@/components/ui';
import { creerCompte, seConnecter, type EtatFormulaire } from '@/serveur/actions/compte';

export function Connexion() {
  const [mode, setMode] = useState<'creation' | 'connexion'>('creation');
  const creation = mode === 'creation';

  return (
    <div className="pile">
      <Link className="marque" href="/" style={{ marginBottom: 6 }}><Logo taille={32} /><span>LifeOS</span></Link>
      <h1 style={{ fontSize: '1.85rem' }}>{creation ? 'Créer votre compte' : 'Content de vous revoir'}</h1>
      <p style={{ color: 'var(--texte-3)' }}>{creation
        ? 'Quelques secondes suffisent pour commencer à comprendre vos courriers.'
        : 'Connectez-vous pour retrouver vos démarches et vos échéances.'}</p>

      <div className="segments" role="tablist" aria-label="Créer un compte ou se connecter">
        <button type="button" role="tab" aria-selected={creation} onClick={() => setMode('creation')}>Créer un compte</button>
        <button type="button" role="tab" aria-selected={!creation} onClick={() => setMode('connexion')}>Se connecter</button>
      </div>

      {/* La clé repart d'un formulaire vierge (et sans erreur) à chaque changement de mode. */}
      <Formulaire key={mode} creation={creation} />

      <Separateur>
        <span style={{ fontSize: '.85rem', color: 'var(--texte-4)' }}>ou</span>
      </Separateur>
      <button type="button" className="bouton bouton--secondaire bouton--bloc"
        onClick={() => alert('La connexion par lien e-mail n’est pas encore disponible. Utilisez votre mot de passe.')}>
        <Icone nom="courrier" taille={20} couleur="#6A57CC" />Recevoir un lien par e-mail
      </button>

      <div className="carte carte--lavande" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
        <Icone nom="cadenas" taille={18} couleur="#5A48B8" />
        <p style={{ fontSize: '.88rem', color: '#4A4757' }}>Vos documents restent privés et protégés.</p>
      </div>
    </div>
  );
}

function Formulaire({ creation }: { creation: boolean }) {
  const [etat, envoyer, enCours] = useActionState<EtatFormulaire, FormData>(creation ? creerCompte : seConnecter, {});

  return (
    <form className="pile" action={envoyer} noValidate>
      {creation && (
        <div className="champ">
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" type="text" autoComplete="given-name" placeholder="Camille" required defaultValue={etat.valeurs?.prenom} />
        </div>
      )}
      <div className="champ">
        <label htmlFor="email">Adresse e-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="camille@exemple.fr" required defaultValue={etat.valeurs?.email} />
      </div>
      <div className="champ">
        <label htmlFor="motdepasse">Mot de passe</label>
        <input id="motdepasse" name="motdepasse" type="password" autoComplete={creation ? 'new-password' : 'current-password'} placeholder="8 caractères minimum" required minLength={creation ? 8 : undefined} />
      </div>
      {creation && (
        <div className="case-a-cocher">
          <input id="conditions" name="conditions" type="checkbox" required />
          <label htmlFor="conditions">J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité de LifeOS.</label>
        </div>
      )}
      <p role="alert" style={{ color: '#9C362B', fontWeight: 700, fontSize: '.9rem' }} hidden={!etat.erreur}>{etat.erreur}</p>
      <button type="submit" className="bouton bouton--bloc" disabled={enCours}>
        {enCours ? 'Un instant…' : creation ? 'Créer mon compte' : 'Me connecter'}
      </button>
    </form>
  );
}
