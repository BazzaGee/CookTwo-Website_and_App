import { useCallback, useEffect, useRef, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const IOS_DISMISS_KEY = 'cfs.ios_install_dismissed';

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return true;
  // iPadOS 13+ reports as MacIntel with touch support.
  if (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1) return true;
  return false;
}

function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  if (typeof nav.standalone === 'boolean' && nav.standalone) return true;
  return false;
}

export function useInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS] = useState(detectIOS);
  const [iosHintDismissed, setIosHintDismissed] = useState(() => {
    try {
      return localStorage.getItem(IOS_DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const promptRef = useRef<InstallPromptEvent | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      promptRef.current = e as InstallPromptEvent;
      setIsInstallable(true);
    }

    window.addEventListener('beforeinstallprompt', handler);

    setIsInstalled(detectInstalled());
    const mq = window.matchMedia('(display-mode: standalone)');
    const onChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener('change', onChange);

    const installedHandler = () => setIsInstalled(true);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptRef.current) return;
    promptRef.current.prompt();
    const choice = await promptRef.current.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setIsInstallable(false);
    promptRef.current = null;
  }, []);

  const dismiss = useCallback(() => {
    setIsInstallable(false);
    promptRef.current = null;
  }, []);

  const dismissIOS = useCallback(() => {
    setIosHintDismissed(true);
    try {
      localStorage.setItem(IOS_DISMISS_KEY, '1');
    } catch {
    }
  }, []);

  // iOS never fires beforeinstallprompt, so we surface a manual-instructions hint
  // instead — but only when not already installed, not dismissed, and not on a
  // browser that already offered the native prompt.
  const showIOSHint = isIOS && !isInstalled && !iosHintDismissed && !isInstallable;

  return { isInstallable, isInstalled, isIOS, showIOSHint, install, dismiss, dismissIOS };
}
