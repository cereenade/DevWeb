'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { lancerInstallation } from '@/lib/navigateur';

/** Lance l'installation si le navigateur le permet, sinon ouvre l'écran d'explications. */
export function BoutonInstaller({ className, children }: { className: string; children: ReactNode }) {
  const router = useRouter();

  async function installer() {
    if (!(await lancerInstallation())) router.push('/installer');
  }

  return <button type="button" className={className} onClick={installer}>{children}</button>;
}
