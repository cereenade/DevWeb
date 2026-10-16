'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Icone, Logo } from '@/components/Icone';
import { Separateur } from '@/components/ui';
import { ecrire, lire } from '@/lib/store';
import { UTILISATEUR } from '@/lib/data';

export function Connexion() {
  const router = useRouter();
  const [mode, setMode] = useState<'creation' | 'connexion'>('creation');
  const [erreur, setErreur] = useState('');
  const creation = mode === 'creation';

  function creerCompte(prenom: string, email: string) {
    ecrire({ compte: { prenom: prenom || UTILISATEUR.prenom, email: email || UTILISATEUR.email } });
    router.push(lire().onboardingVu ? '/tableau-de-bord' : '/onboarding');
  }

  function valider(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const donnees = new FormData(ev.currentTarget);
    const prenom = String(donnees.get('prenom') || '').trim();
    const email = String(donnees.get('email') || '').trim();
    if (creation && !prenom) {
      setErreur('Merci d’indiquer votre prénom.');
      return;
    }
    creerCompte(prenom, email);
  }

  return (
    <div className="pile">
      <Link className="marque" href="/" style={{ marginBottom: 6 }}><Logo taille={32} /><span>LifeOS</span></Link>
      <h1 style={{ fontSize: '1.85rem' }}>{creation ? 'Créer votre compte' : 'Content de vous revoir'}</h1>
      <p style={{ color: 'var(--texte-3)' }}>{creation
        ? 'Quelques secondes suffisent pour commencer à comprendre vos courriers.'
        : 'Connectez-vous pour retrouver vos démarches et vos échéances.'}</p>

      <div className="segments" role="tablist" aria-label="Créer un compte ou se connecter">
        <button type="button" role="tab" aria-selected={creation} onClick={() => { setMode('creation'); setErreur(''); }}>Créer un compte</button>
        <button type="button" role="tab" aria-selected={!creation} onClick={() => { setMode('connexion'); setErreur(''); }}>Se connecter</button>
      </div>

      <form className="pile" onSubmit={valider} noValidate>
        {creation && (
          <div className="champ">
            <label htmlFor="prenom">Prénom</label>
            <input id="prenom" name="prenom" type="text" autoComplete="given-name" placeholder="Camille" required />
          </div>
        )}
        <div className="champ">
          <label htmlFor="email">Adresse e-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="camille@exemple.fr" required />
        </div>
        <div className="champ">
          <label htmlFor="motdepasse">Mot de passe</label>
          <input id="motdepasse" name="motdepasse" type="password" autoComplete={creation ? 'new-password' : 'current-password'} placeholder="8 caractères minimum" required />
        </div>
        {creation && (
          <div className="case-a-cocher">
            <input id="conditions" type="checkbox" required />
            <label htmlFor="conditions">J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité de LifeOS.</label>
          </div>
        )}
        <p role="alert" style={{ color: '#9C362B', fontWeight: 700, fontSize: '.9rem' }} hidden={!erreur}>{erreur}</p>
        <button type="submit" className="bouton bouton--bloc">{creation ? 'Créer mon compte' : 'Me connecter'}</button>
      </form>

      <Separateur>
        <span style={{ fontSize: '.85rem', color: 'var(--texte-4)' }}>ou</span>
      </Separateur>
      <button type="button" className="bouton bouton--secondaire bouton--bloc" onClick={() => creerCompte('', '')}>
        <Icone nom="courrier" taille={20} couleur="#6A57CC" />Recevoir un lien par e-mail
      </button>

      <div className="carte carte--lavande" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: '14px 16px' }}>
        <Icone nom="cadenas" taille={18} couleur="#5A48B8" />
        <p style={{ fontSize: '.88rem', color: '#4A4757' }}>Vos documents restent privés et protégés.</p>
      </div>
    </div>
  );
}
