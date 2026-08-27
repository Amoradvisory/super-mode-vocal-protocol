import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InstallAppButton } from './InstallAppButton';

class FakeBeforeInstallPromptEvent extends Event {
  prompt = vi.fn().mockResolvedValue(undefined);
  userChoice = Promise.resolve({ outcome: 'accepted' as const, platform: 'web' });
}

describe('InstallAppButton', () => {
  it('affiche le bouton quand Android expose le prompt PWA et lance l’installation', async () => {
    const event = new FakeBeforeInstallPromptEvent('beforeinstallprompt');
    render(<InstallAppButton />);

    window.dispatchEvent(event);

    const button = await screen.findByRole('button', { name: /installer ma lecture/i });
    fireEvent.click(button);

    await waitFor(() => expect(event.prompt).toHaveBeenCalledTimes(1));
  });
});
