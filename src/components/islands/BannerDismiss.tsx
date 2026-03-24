import { useState, useEffect } from 'react';

interface BannerDismissProps {
  storageKey?: string;
  children: React.ReactNode;
}

export default function BannerDismiss({ storageKey = 'pstn-banner-dismissed', children }: BannerDismissProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to avoid flash
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, [storageKey]);

  function handleDismiss() {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsDismissed(true);
      localStorage.setItem(storageKey, 'true');
    }, 300);
  }

  if (isDismissed) return null;

  return (
    <div
      className={`relative ${
        isAnimatingOut ? 'animate-slide-up' : 'animate-slide-down'
      }`}
      role="alert"
    >
      <div className="relative">
        {children}
        <button
          onClick={handleDismiss}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200 p-1"
          aria-label="Dismiss banner"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
