'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icone } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';
import { LANGUES, UTILISATEUR } from '@/lib/data';
import { ecrire, reinitialiser, useEtatCharge, type Etat } from '@/lib/store';
import { exporterDonnees } from '@/lib/navigateur';

const LIGNES: [keyof Etat['reglages'], string, string][] = [
  ['rappels', 'Rappels de démarches', '7 jours, 2 jours et le jour même.'],
  ['analyses', 'Nouveau document analysé', 'Quand une analyse est terminée.'],
  ['resume', 'Résumé hebdomadaire', 'Chaque lundi matin.']
];

function Chevron() {
  return <Icone nom="chevron" taille={18} couleur="#6E6C7A" epaisseur={2.2} />;
}

export function Parametres() {
  const etat = useEtatCharge();
  const router = useRouter();
  const compte = etat.compte || UTILISATEUR;
  const langueNom = (LANGUES.find((l) => l.code === etat.langue) || LANGUES[0]).nom;

  function basculerReglage(cle: keyof Etat['reglages']) {
    ecrire({ reglages: { ...etat.reglages, [cle]: !etat.reglages[cle] } });
  }

  function supprimerDonnees() {
    if (confirm('Supprimer toutes vos données LifeOS enregistrées sur cet appareil ?')) {
      reinitialiser();
      router.push('/');
    }
  }

  function aide() {
    alert("Aide LifeOS\n\nPhotographiez un courrier, LifeOS vous explique ce qu'il signifie, ce que vous devez faire et avant quelle date.\n\nCette version de démonstration fonctionne avec des documents d'exemple.");
  }

  function deconnexion() {
    ecrire({ compte: null });
    router.push('/');
  }

  return (
    <>
      <EnteteEcran titre="Paramètres" retour="/tableau-de-bord" />
      <div className="pile">
        <div className="carte" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span className="vignette" style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--lavande-clair)', color: 'var(--lavande-fonce)', fontSize: '1.15rem' }}>{compte.prenom.slice(0, 1)}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
            <strong style={{ fontFamily: 'var(--police-titre)', fontSize: '1.1rem' }}>{compte.prenom}</strong>
            <span className="carte-detail">{compte.email}</span>
          </span>
        </div>

        <h2 className="titre-section">Rappels</h2>
        <div className="carte" style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
          {LIGNES.map(([cle, titre, detail]) => (
            <div key={cle} className="ligne-reglage">
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <strong>{titre}</strong>
                <span className="carte-detail" style={{ fontSize: '.84rem' }}>{detail}</span>
              </span>
              <button type="button" className="interrupteur" role="switch" aria-checked={Boolean(etat.reglages[cle])}
                aria-label={titre} onClick={() => basculerReglage(cle)}><span /></button>
            </div>
          ))}
        </div>

        <h2 className="titre-section">Lecture et langue</h2>
        <div className="liste-liens">
          <Link href="/langue"><Icone nom="globe" taille={21} couleur="#3A57A8" /><span style={{ flexGrow: 1 }}>Langue de l&apos;explication</span>
            <span style={{ fontWeight: 600, color: 'var(--texte-3)' }}>{langueNom}</span><Chevron /></Link>
          <Link href="/accessibilite"><Icone nom="texte" taille={21} couleur="#4737A0" /><span style={{ flexGrow: 1 }}>Mode lecture facile</span>
            <span style={{ fontWeight: 600, color: 'var(--texte-3)' }}>{etat.lectureFacile ? 'Activé' : 'Désactivé'}</span><Chevron /></Link>
        </div>

        <h2 className="titre-section">Application</h2>
        <Link className="bandeau-install" href="/installer">
          <Icone nom="telephone" taille={22} couleur="#4737A0" />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
            <strong>Installer LifeOS sur cet appareil</strong>
            <span style={{ fontSize: '.86rem', color: 'var(--texte-2)' }}>Ouvrez LifeOS depuis votre écran d&apos;accueil.</span>
          </span>
          <Chevron />
        </Link>

        <h2 className="titre-section">Confidentialité</h2>
        <div className="carte">
          <div className="rangee" style={{ gap: 10 }}>
            <Icone nom="cadenas" taille={20} couleur="#5A48B8" />
            <h3 style={{ fontSize: '1.05rem' }}>Vos documents vous appartiennent.</h3>
          </div>
          <p style={{ color: 'var(--texte-2)', fontSize: '.94rem' }}>Vos documents servent uniquement à vous expliquer vos démarches. Vous pouvez les consulter, les exporter ou les supprimer quand vous le souhaitez.</p>
          <button type="button" className="bouton bouton--secondaire bouton--bloc" style={{ justifyContent: 'space-between', minHeight: 52 }} onClick={exporterDonnees}>
            Gérer mes données<Chevron /></button>
          <button type="button" className="bouton bouton--danger bouton--bloc" style={{ justifyContent: 'space-between', minHeight: 52 }} onClick={supprimerDonnees}>
            Supprimer mes données<Icone nom="corbeille" taille={18} couleur="#9C362B" /></button>
        </div>

        <div className="liste-liens">
          <button type="button" onClick={aide}><Icone nom="aide" taille={21} /><span style={{ flexGrow: 1 }}>Aide et questions fréquentes</span><Chevron /></button>
          <button type="button" style={{ color: '#9C362B' }} onClick={deconnexion}><Icone nom="deconnexion" taille={21} couleur="#9C362B" />Me déconnecter</button>
        </div>

        <p className="note-bas">LifeOS est un service indépendant. LifeOS n&apos;est pas un service officiel de France Travail, de la CAF, des Impôts, de l&apos;Assurance Maladie ou d&apos;une préfecture.</p>
      </div>
    </>
  );
}
