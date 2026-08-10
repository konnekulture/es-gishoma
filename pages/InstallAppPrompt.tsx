import React from 'react';

export function usePWAInstall() {
  return {
    installPrompt: null,
    isStandalone: true,
    isDismissed: true,
    dismissBanner: () => {},
    triggerInstall: async () => 'dismissed' as const
  };
}

export function initPWAInstallListener() {}

export function triggerGlobalDownload(onComplete?: () => void) {}

export const InstallInstructionsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = () => null;

export const DownloadingOverlay: React.FC = () => null;

export const InstallAppBanner: React.FC = () => null;

export const InstallAppButton: React.FC<{ variant?: 'nav' | 'mobile' | 'footer' | 'hero'; onClickAction?: () => void }> = () => null;
