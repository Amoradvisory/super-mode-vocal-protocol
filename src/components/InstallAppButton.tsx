import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isStandalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches === true ||
    window.matchMedia?.('(display-mode: fullscreen)').matches === true;
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return undefined;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => setDeferredPrompt(null);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!deferredPrompt) return null;

  const install = async () => {
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <button className="install-app-button" type="button" onClick={install}>
      <span className="install-icon" aria-hidden="true">↓</span>
      <span><strong>Installer Ma Lecture</strong><small>Plein écran · disponible hors ligne</small></span>
    </button>
  );
}
