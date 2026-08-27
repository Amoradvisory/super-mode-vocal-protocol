import { registerSW } from 'virtual:pwa-register';

export function registerPwa(): void {
  try {
    registerSW({
      immediate: true,
      onRegisterError(error) {
        console.warn('Service worker indisponible', error);
      },
    });
  } catch (error) {
    console.warn('PWA non enregistrée', error);
  }
}
