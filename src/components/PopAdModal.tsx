'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PopAdModalProps {
  html?: string | null;
}

const DISMISS_KEY = 'qw_popAdState';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const PopAdModal: React.FC<PopAdModalProps> = ({ html }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!html) return;

    try {
      if (typeof window === 'undefined') {
        setIsOpen(false);
        return;
      }

      const stored = window.localStorage.getItem(DISMISS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { html?: string | null; dismissedAt?: number };
        const lastHtml = parsed?.html ?? null;
        const dismissedAt = parsed?.dismissedAt ?? 0;

        // If same HTML and within 24h, keep it hidden
        if (lastHtml === html && dismissedAt > 0) {
          const now = Date.now();
          if (now - dismissedAt < DISMISS_DURATION_MS) {
            setIsOpen(false);
            return;
          }
        }
      }
    } catch {
      // Ignore parsing/storage errors and just show popup
    }

    // Either first time, or content changed, or 24h passed
    setIsOpen(true);
  }, [html]);

  if (!html || !isOpen) return null;

  const handleClose = () => {
    try {
      if (typeof window !== 'undefined') {
        const state = JSON.stringify({
          html: html ?? null,
          dismissedAt: Date.now(),
        });
        window.localStorage.setItem(DISMISS_KEY, state);
      }
    } catch {
      // ignore storage errors
    }
    setIsOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative max-w-xl w-[92%] max-h-[80vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-100/40 dark:border-amber-900/40 transform transition-all duration-300 ease-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-gray-900 shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-150 cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <div
          className="overflow-auto max-h-[80vh] prose prose-sm sm:prose-base dark:prose-invert [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          // HTML from WordPress (can include inline styles/markup)
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};


