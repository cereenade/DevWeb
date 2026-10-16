import type { Metadata, Viewport } from 'next';
import { Nunito_Sans, Outfit } from 'next/font/google';
import { Demarrage } from '@/components/Demarrage';
import './globals.css';

const nunito = Nunito_Sans({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['500', '600', '700']
});

export const metadata: Metadata = {
  title: {
    default: 'LifeOS — Vos papiers. En clair.',
    template: '%s — LifeOS'
  },
  description: "LifeOS explique vos documents administratifs français : ce qu'ils signifient, ce que vous devez faire et avant quelle date.",
  applicationName: 'LifeOS',
  appleWebApp: { capable: true, title: 'LifeOS' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FBFAF7'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" className={`${nunito.variable} ${outfit.variable}`}>
      <body>
        <a className="saut-contenu" href="#contenu">Aller au contenu principal</a>
        <Demarrage />
        {children}
        <div id="annonces" className="visuellement-cache" role="status" aria-live="polite" />
      </body>
    </html>
  );
}
