"use client";

import { useEffect, useRef } from "react";

type Props = {
  pixelId: string;
  events: string[];
  eventId: string;
  targetUrl: string;
};

export function ClientTracker({ pixelId, events, eventId, targetUrl }: Props) {
  const sent = useRef<Set<string>>(new Set());

  useEffect(() => {
    type FbqFunction = (...args: unknown[]) => void;
    type Fbq = FbqFunction & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: FbqFunction;
      loaded?: boolean;
      version?: string;
    };

    const w = window as Window & { fbq?: Fbq; _fbq?: Fbq };

    if (!w.fbq) {
      const fbq: Fbq = function fbqImpl(...args: unknown[]) {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue?.push(args);
        }
      };
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.push = fbq;
      w.fbq = fbq;
      w._fbq = fbq;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    }

    w.fbq?.("init", pixelId);

    events.forEach((ev) => {
      if (sent.current.has(ev)) return;
      w.fbq?.("track", ev, {}, { eventID: eventId });
      sent.current.add(ev);
    });

    const timeout = setTimeout(() => {
      window.location.href = targetUrl;
    }, 1200);

    return () => clearTimeout(timeout);
  }, [eventId, events, pixelId, targetUrl]);

  return null;
}
