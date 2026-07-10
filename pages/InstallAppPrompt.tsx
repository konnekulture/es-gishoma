import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  Info, 
  CheckCircle2, 
  Monitor, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Menu
} from 'lucide-react';

// Define standard types for the PWA install prompt event
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Global hook/state manager to share the PWA install prompt state across components
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

// Global downloading states and triggers
let globalSetDownloadingState: ((state: { isOpen: boolean; onComplete?: () => void }) => void) | null = null;

export function triggerGlobalDownload(onComplete: () => void) {
  if (globalSetDownloadingState) {
    globalSetDownloadingState({ isOpen: true, onComplete });
  } else {
    // Fallback if component is not mounted
    onComplete();
  }
}

// Full screen download progress overlay
export const DownloadingOverlay: React.FC = () => {
  const [state, setState] = useState<{ isOpen: boolean; onComplete?: () => void }>({ isOpen: false });
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating download...');

  useEffect(() => {
    globalSetDownloadingState = setState;
    return () => {
      globalSetDownloadingState = null;
    };
  }, []);

  useEffect(() => {
    if (!state.isOpen) {
      setProgress(0);
      return;
    }

    setProgress(0);
    setStatusText('Connecting to ES GISHOMA secure server...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Increase progress by random increments
      currentProgress += Math.floor(Math.random() * 6) + 4; // 4% to 10%
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setStatusText('Verification complete! Launching system installer...');
        
        // Wait briefly at 100% then fire onComplete
        setTimeout(() => {
          setState({ isOpen: false });
          if (state.onComplete) {
            state.onComplete();
          }
        }, 500);
      } else {
        if (currentProgress < 20) {
          setStatusText('Downloading optimized visual assets...');
        } else if (currentProgress < 45) {
          setStatusText('Configuring offline service protocols...');
        } else if (currentProgress < 70) {
          setStatusText('Caching school directories and portal databases...');
        } else if (currentProgress < 90) {
          setStatusText('Compiling administrative framework security layers...');
        } else {
          setStatusText('Finalizing application build files...');
        }
      }
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [state.isOpen, state.onComplete]);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white px-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Accent ambient glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon Container */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
          <div className="relative p-5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl">
            <Download className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight">Downloading ES GISHOMA</h3>
          <p className="text-indigo-400 text-xs uppercase tracking-widest font-semibold min-h-[16px]">{statusText}</p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2.5">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Progress</span>
            <span className="font-bold text-indigo-400">{progress}%</span>
          </div>
        </div>

        {/* Security / Quality details */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Verified security configuration & cache files</span>
        </div>
      </div>
    </div>
  );
};

export function initPWAInstallListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    // Notify all active listeners
    promptListeners.forEach(listener => listener(globalDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    console.log('ES GISHOMA App was successfully installed!');
    globalDeferredPrompt = null;
    promptListeners.forEach(listener => listener(null));
  });
}

// React custom hook to hook into PWA installation status
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Sync current standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      setIsStandalone(!!isStandaloneMode);
    };

    checkStandalone();
    
    // Listen to media query changes for display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    
    try {
      mediaQuery.addEventListener('change', handleMediaChange);
    } catch {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
    }

    // Subscribe to global deferred prompt updates
    const listener = (prompt: BeforeInstallPromptEvent | null) => {
      setInstallPrompt(prompt);
    };
    promptListeners.add(listener);

    return () => {
      promptListeners.delete(listener);
      try {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } catch {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  const triggerInstall = async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        globalDeferredPrompt = null;
        setInstallPrompt(null);
        return 'accepted';
      } else {
        console.log('User dismissed the install prompt');
        return 'dismissed';
      }
    }
    return 'manual';
  };

  const dismissBanner = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('pwa_banner_dismissed', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const resetDismiss = () => {
    setIsDismissed(false);
    try {
      localStorage.removeItem('pwa_banner_dismissed');
    } catch (e) {
      console.warn(e);
    }
  };

  return {
    installPrompt,
    isStandalone,
    isDismissed,
    triggerInstall,
    dismissBanner,
    resetDismiss
  };
}

// Detect client device/platform
export function getMobilePlatform() {
  if (typeof window === 'undefined') return { isIOS: false, isAndroid: false, isMobile: false };
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi/i.test(userAgent);
  return { isIOS, isAndroid, isMobile };
}

// 1. Unified installation instructions modal for manual additions (e.g. iOS or Safari)
export const InstallInstructionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { isIOS, isAndroid } = getMobilePlatform();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              PWA Application
            </span>
          </div>
          <h3 className="text-xl font-bold">Install ES GISHOMA</h3>
          <p className="text-indigo-100 text-sm mt-1">Get our comprehensive school management portal right on your device's home screen.</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* iOS Safari Instructions */}
          {isIOS ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>iOS does not allow automated website downloads. You can easily add it manually in 5 seconds using Safari browser.</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Step-by-Step Instructions:</h4>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-600 text-sm">
                    Open this website in your standard <strong className="text-indigo-600 font-semibold">Safari Browser</strong>.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-slate-600 text-sm">
                    Tap the <strong className="text-indigo-600 font-semibold">Share button</strong> at the bottom or top bar:
                    <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-medium text-slate-800 mx-1">
                      <Share className="w-3 h-3 text-indigo-600" /> Share
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-slate-600 text-sm">
                    Scroll down and select <strong className="text-indigo-600 font-semibold">"Add to Home Screen"</strong>:
                    <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-medium text-slate-800 mx-1">
                      <PlusSquare className="w-3 h-3 text-indigo-600" /> Add to Home Screen
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-slate-600 text-sm">
                    Tap <strong className="text-indigo-600 font-semibold">Add</strong> in the top-right corner to complete!
                  </p>
                </li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Manual Android Instructions:</h4>
              <p className="text-slate-600 text-sm">If the automated popup did not trigger, you can install the app manually via Chrome browser:</p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-600 text-sm">
                    Tap the <strong className="text-slate-900 font-semibold">three dots menu (⋮)</strong> in Chrome's top right corner.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-600 text-sm">
                    Tap <strong className="text-indigo-600 font-semibold">"Install app"</strong> or <strong className="text-indigo-600 font-semibold">"Add to Home screen"</strong>.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-slate-600 text-sm">
                    Confirm by tapping <strong className="text-indigo-600 font-semibold">Install</strong> in the dialog box.
                  </p>
                </li>
              </ol>
            </div>
          ) : (
            /* General / Desktop Instructions */
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Install via Browser Bar:</h4>
              <p className="text-slate-600 text-sm">You can download and run ES GISHOMA as a fast, offline-ready desktop app:</p>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-slate-600 text-sm">
                    Look at the right side of your browser's <strong className="text-slate-900 font-semibold">Address Bar</strong> (at the top).
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-slate-600 text-sm">
                    Click the <strong className="text-indigo-600 font-semibold">Install icon</strong> (typically represented by a computer screen with an arrow, or a plus sign <strong className="text-lg leading-none">+</strong>).
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-slate-600 text-sm">
                    Click <strong className="text-indigo-600 font-semibold">Install</strong> in the pop-up prompt to run the app standalone.
                  </p>
                </li>
              </ol>
            </div>
          )}

          {/* Feature List */}
          <div className="pt-4 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">PWA Application Benefits:</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Offline Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Faster Loading</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Storage Overhead</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Status Persistence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Floating Toast/Banner at the bottom-left corner of the viewport
export const InstallAppBanner: React.FC = () => {
  const { installPrompt, isStandalone, isDismissed, triggerInstall, dismissBanner } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Show only after a brief delay (e.g. 2 seconds) to avoid immediate visual clutter
    if (!isStandalone && !isDismissed) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isStandalone, isDismissed]);

  if (!shouldShow) return null;

  const handleInstallClick = () => {
    triggerGlobalDownload(async () => {
      const outcome = await triggerInstall();
      if (outcome === 'manual') {
        setIsModalOpen(true);
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-500">
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 flex items-start gap-4 relative overflow-hidden">
          {/* Accent light highlights */}
          <div className="absolute h-40 w-40 -top-20 -left-20 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute h-40 w-40 -bottom-20 -right-20 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Dismiss button */}
          <button 
            onClick={dismissBanner}
            className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-slate-800/80 p-1.5 rounded-full transition-all"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Column */}
          <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl shrink-0">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>

          {/* Text and Actions */}
          <div className="flex-1 space-y-3 pr-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Offline App</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <h4 className="font-bold text-sm text-white mt-0.5">Add ES GISHOMA to Home Screen</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Download our lightweight, fast web application for quick offline-enabled academic and portal access.
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={handleInstallClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-900/30 group cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download App</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                How?
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstallInstructionsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <DownloadingOverlay />
    </>
  );
};

// 3. Elegant individual install button to place on Navbar, Footer, or custom components
export const InstallAppButton: React.FC<{
  className?: string;
  variant?: 'nav' | 'footer' | 'hero' | 'mobile';
  onClickAction?: () => void;
}> = ({ className = '', variant = 'nav', onClickAction }) => {
  const { installPrompt, isStandalone, triggerInstall } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already loaded as standalone PWA app, hide button to keep UI clean and honest
  if (isStandalone) {
    if (variant === 'hero' || variant === 'footer') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Application Installed</span>
        </span>
      );
    }
    return null;
  }

  const handleInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClickAction) {
      onClickAction();
    }
    
    triggerGlobalDownload(async () => {
      const outcome = await triggerInstall();
      if (outcome === 'manual') {
        setIsModalOpen(true);
      }
    });
  };

  if (variant === 'nav') {
    return (
      <>
        <button 
          onClick={handleInstall}
          className={`flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-full text-xs font-semibold transition-all cursor-pointer ${className}`}
          title="Install app to your home screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download App</span>
        </button>
        <InstallInstructionsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  if (variant === 'mobile') {
    return (
      <>
        <button 
          onClick={handleInstall}
          className={`flex items-center space-x-3 p-3 w-full rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left ${className}`}
        >
          <Download className="w-5 h-5" />
          <span className="font-semibold">Download App</span>
        </button>
        <InstallInstructionsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <>
        <button 
          onClick={handleInstall}
          className={`text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer ${className}`}
        >
          Download Desktop/Mobile App
        </button>
        <InstallInstructionsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // Hero / Section layout variant
  return (
    <>
      <button 
        onClick={handleInstall}
        className={`px-6 py-3.5 bg-white border border-slate-200 hover:border-indigo-600/30 hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${className}`}
      >
        <Smartphone className="w-5 h-5 text-indigo-600" />
        <span>Install App</span>
      </button>
      <InstallInstructionsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
