"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { BRAZILIAN_NAMES, BRAZILIAN_CITIES } from "@/lib/social-proof-data";

type Props = {
  /** Interval between notifications in seconds (5-60) */
  interval: number;
};

type NotificationState = {
  name: string;
  city: string;
  visible: boolean;
};

const DISPLAY_DURATION = 4000; // 4 seconds display time
const ANIMATION_DURATION = 300; // 300ms for animations
const INITIAL_DELAY = 3000; // 3 seconds before first notification
const MAX_RECENT = 5; // Track last 5 combinations to prevent repetition

export function SocialProofNotification({ interval }: Props) {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const recentCombinations = useRef<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get random name/city that hasn't been used recently
  const getRandomPerson = useCallback(() => {
    let name: string;
    let city: string;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    do {
      name = BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];
      city = BRAZILIAN_CITIES[Math.floor(Math.random() * BRAZILIAN_CITIES.length)];
      key = `${name}-${city}`;
      attempts++;
    } while (recentCombinations.current.includes(key) && attempts < maxAttempts);

    // Update recent combinations
    recentCombinations.current.push(key);
    if (recentCombinations.current.length > MAX_RECENT) {
      recentCombinations.current.shift();
    }

    return { name, city };
  }, []);

  // Show a notification
  const showNotification = useCallback(() => {
    const { name, city } = getRandomPerson();
    setNotification({ name, city, visible: true });

    // Hide after display duration
    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => (prev ? { ...prev, visible: false } : null));

      // Clear notification after animation
      setTimeout(() => {
        setNotification(null);
      }, ANIMATION_DURATION);
    }, DISPLAY_DURATION);
  }, [getRandomPerson]);

  // Setup notification cycle
  useEffect(() => {
    // Show first notification after initial delay
    const initialTimeout = setTimeout(() => {
      showNotification();

      // Then show notifications at configured interval
      intervalRef.current = setInterval(() => {
        showNotification();
      }, interval * 1000);
    }, INITIAL_DELAY);

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [interval, showNotification]);

  if (!notification) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-50
        max-w-xs sm:max-w-sm
        rounded-lg bg-white shadow-lg border border-gray-200
        px-4 py-3
        transition-all duration-300 ease-in-out
        ${notification.visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
        }
      `}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.name} de {notification.city}
          </p>
          <p className="text-xs text-gray-500">
            acabou de entrar no grupo!
          </p>
        </div>
      </div>
    </div>
  );
}
