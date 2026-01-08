"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { WhatsAppPageRecord } from "@/lib/repos/whatsapp-pages";
import type { WhatsAppAppearanceRecord } from "@/lib/repos/whatsapp-appearance";
import type { EmojiSize } from "@/lib/validation";
import { SocialProofNotification } from "@/components/social-proof-notification";
import { SocialProofCarousel } from "@/components/social-proof-carousel";
import { PageFooter } from "@/components/page-footer";

// Emoji size CSS classes mapping
const EMOJI_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-2xl",
  medium: "text-4xl",
  large: "text-6xl",
};

// Vacancy counter font size classes - added 2026-01-06
const VACANCY_HEADLINE_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-xl",
};

const VACANCY_COUNT_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-2xl",
  medium: "text-4xl",
  large: "text-6xl",
};

const VACANCY_FOOTER_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

// Updated 2025-12-31: Multi-event support (events[] + redirectEvent)
// Updated 2026-01-04: Global appearance configuration
// Updated 2026-01-06: Separate button event support (buttonEvent + buttonEventId)
type Props = {
  page: WhatsAppPageRecord;
  pixelId?: string;
  eventId: string;
  redirectEventId: string;
  buttonEventId: string;
  appearance: WhatsAppAppearanceRecord;
};

export function WhatsAppRedirectClient({ page, pixelId, eventId, redirectEventId, buttonEventId, appearance }: Props) {
  const [countdown, setCountdown] = useState(page.redirectDelay);
  const [vacancyCountDisplay, setVacancyCountDisplay] = useState(page.vacancyCount);
  const hasTrackedPageEvents = useRef(false);
  const hasTrackedRedirect = useRef(false);
  const hasTrackedButtonClick = useRef(false);
  const fbqInitialized = useRef(false);

  // Initialize Meta Pixel SDK and fire page load events
  useEffect(() => {
    if (!pixelId || fbqInitialized.current) return;

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
    fbqInitialized.current = true;

    // Fire PageView first (required for Meta Pixel Helper)
    w.fbq?.("track", "PageView");

    // Fire all page load events (with deduplication)
    if (!hasTrackedPageEvents.current) {
      hasTrackedPageEvents.current = true;
      page.events.forEach((eventName) => {
        w.fbq?.("track", eventName, {}, { eventID: eventId });
      });
    }
  }, [pixelId, page.events, eventId]);

  // Handle automatic redirect (fires redirectEvent)
  const handleAutoRedirect = useCallback(async () => {
    // Deduplication: only fire redirect event once
    if (hasTrackedRedirect.current) return;
    hasTrackedRedirect.current = true;

    // Fire client-side redirect event if pixel exists
    if (pixelId && typeof window !== "undefined") {
      const w = window as Window & { fbq?: (...args: unknown[]) => void };
      w.fbq?.("track", page.redirectEvent, {}, { eventID: redirectEventId });
    }

    // Fire server-side redirect event via API (best effort)
    try {
      await fetch("/api/whatsapp/track-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: page.id,
          eventName: page.redirectEvent,
          eventId: redirectEventId,
        }),
      });
    } catch {
      // Best-effort, don't block redirect
    }

    // Redirect to WhatsApp after short delay to ensure events fire
    setTimeout(() => {
      window.location.href = page.whatsappUrl;
    }, 100);
  }, [pixelId, page.id, page.redirectEvent, page.whatsappUrl, redirectEventId]);

  // Handle button click (fires buttonEvent or falls back to redirectEvent)
  const handleButtonClick = useCallback(async () => {
    // Deduplication: only fire button event once
    if (hasTrackedButtonClick.current) return;
    hasTrackedButtonClick.current = true;

    // Determine which event to fire (buttonEvent or fallback to redirectEvent)
    const eventToFire = page.buttonEvent ?? page.redirectEvent;

    // Fire client-side button event if pixel exists
    if (pixelId && typeof window !== "undefined") {
      const w = window as Window & { fbq?: (...args: unknown[]) => void };
      w.fbq?.("track", eventToFire, {}, { eventID: buttonEventId });
    }

    // Fire server-side button event via API (best effort)
    try {
      await fetch("/api/whatsapp/track-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: page.id,
          eventName: eventToFire,
          eventId: buttonEventId,
        }),
      });
    } catch {
      // Best-effort, don't block redirect
    }

    // Redirect to WhatsApp after short delay to ensure events fire
    setTimeout(() => {
      window.location.href = page.whatsappUrl;
    }, 100);
  }, [pixelId, page.id, page.buttonEvent, page.redirectEvent, page.whatsappUrl, buttonEventId]);

  // Countdown timer - only runs if redirectEnabled is true
  useEffect(() => {
    // Skip countdown if redirect is disabled
    if (!page.redirectEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAutoRedirect, page.redirectEnabled]);

  // Vacancy counter decrement timer - added 2026-01-06
  useEffect(() => {
    // Skip if vacancy counter is disabled or already at zero
    if (!page.vacancyCounterEnabled || vacancyCountDisplay <= 0) return;

    const interval = (page.vacancyDecrementInterval ?? 10) * 1000;
    const timer = setInterval(() => {
      setVacancyCountDisplay((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [page.vacancyCounterEnabled, page.vacancyDecrementInterval, vacancyCountDisplay]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Header Image */}
        {page.headerImageUrl && (
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-green-500 shadow-lg">
            <img
              src={page.headerImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Headline */}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {page.headline}
        </h1>

        {/* Legacy Social Proofs - Only show if no carousel items exist */}
        {(!page.socialProofCarouselItems || page.socialProofCarouselItems.length === 0) && page.socialProofs.length > 0 && (
          <div className="flex flex-col gap-2">
            {page.socialProofs.map((proof, idx) => (
              <span
                key={idx}
                className="text-gray-600 text-sm sm:text-base"
              >
                {proof}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button - also works as direct link for noscript */}
        {/* Updated 2026-01-06: Uses handleButtonClick for separate button event tracking */}
        <a
          href={page.whatsappUrl}
          onClick={(e) => {
            e.preventDefault();
            handleButtonClick();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {page.buttonText}
        </a>

        {/* Countdown - Updated 2026-01-04: Global appearance configuration */}
        {/* Updated 2026-01-06: Only show if redirectEnabled is true */}
        {page.redirectEnabled && (
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
              appearance.borderEnabled ? "border border-gray-200" : ""
            }`}
            style={{
              backgroundColor: appearance.backgroundColor || "transparent",
            }}
          >
            <svg
              className="h-4 w-4 animate-spin text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-gray-500">
              {appearance.redirectText.replace("...", "")} em{" "}
              <span className="font-bold text-green-600">{countdown}</span> segundos...
            </span>
          </div>
        )}

        {/* Progress bar - Only show if redirectEnabled is true */}
        {page.redirectEnabled && (
          <div className="h-1 w-48 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-1000 ease-linear"
              style={{
                width: `${((page.redirectDelay - countdown) / page.redirectDelay) * 100}%`
              }}
            />
          </div>
        )}
      </div>

      {/* Vacancy Counter - Added 2026-01-06 - Dynamic decrement and custom colors */}
      {page.vacancyCounterEnabled && (
        <div className="mt-6">
          <div
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-6 py-4 text-center"
            style={{ backgroundColor: page.vacancyBackgroundColor || "transparent" }}
          >
            <span
              className={`font-medium text-center ${VACANCY_HEADLINE_SIZE_CLASSES[page.vacancyHeadlineFontSize ?? "medium"]}`}
              style={{ color: page.vacancyHeadlineColor || "#374151" }}
            >
              {page.vacancyHeadline}
            </span>
            <span
              className={`font-bold text-center ${VACANCY_COUNT_SIZE_CLASSES[page.vacancyCountFontSize ?? "large"]}`}
              style={{ color: page.vacancyCountColor || "#16a34a" }}
            >
              {vacancyCountDisplay}
            </span>
            {page.vacancyFooter && (
              <span
                className={`text-center ${VACANCY_FOOTER_SIZE_CLASSES[page.vacancyFooterFontSize ?? "small"]}`}
                style={{ color: page.vacancyFooterColor || "#4b5563" }}
              >
                {page.vacancyFooter}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Benefit Cards Grid - Updated 2026-01-01 - Full width section below countdown */}
      {page.benefitCards && page.benefitCards.length > 0 && (
        <div className="w-full max-w-5xl px-4 mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.benefitCards.map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center rounded-lg border border-green-100 bg-white p-5 shadow-sm"
              >
                <span className={EMOJI_SIZE_CLASSES[page.emojiSize ?? "medium"]}>
                  {card.emoji}
                </span>
                <h3 className="mt-2 font-bold text-gray-900">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="mt-1 text-sm text-gray-600 text-center">
                    {card.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Proof Notification - Updated 2026-01-03 */}
      {page.socialProofEnabled && (
        <SocialProofNotification interval={page.socialProofInterval} />
      )}

      {/* Social Proof Carousel - Added 2026-01-07 */}
      {/* Positioned before footer for better visual flow */}
      {page.socialProofCarouselItems && page.socialProofCarouselItems.length > 0 && (
        <div className="w-full max-w-md px-4 mt-8">
          <SocialProofCarousel
            items={page.socialProofCarouselItems}
            autoPlay={page.carouselAutoPlay}
            interval={page.carouselInterval}
          />
        </div>
      )}

      {/* Custom Footer - Added 2026-01-07 */}
      <PageFooter text={page.footerText} />
    </main>
  );
}
