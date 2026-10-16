/* Écrans accessibles sans compte, sans barre d'onglets. */

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return <main id="contenu" className="ecran" tabIndex={-1}>{children}</main>;
}
