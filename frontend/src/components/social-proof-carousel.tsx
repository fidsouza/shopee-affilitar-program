"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Quote } from "lucide-react";
import type { SocialProofItem, SocialProofTextItem, SocialProofImageItem } from "@/lib/validation";

// Text proof card subcomponent
function TextProofCard({ item }: { item: SocialProofTextItem }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Quote className="h-8 w-8 text-green-500 opacity-50" />
      <p className="text-center text-gray-700 text-sm sm:text-base leading-relaxed">
        &ldquo;{item.description}&rdquo;
      </p>
      <div className="mt-2 text-center">
        <p className="font-semibold text-gray-900">{item.author}</p>
        <p className="text-sm text-gray-500">{item.city}</p>
      </div>
    </div>
  );
}

// Image proof card subcomponent
function ImageProofCard({ item }: { item: SocialProofImageItem }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-8">
        <ImageOff className="h-12 w-12 text-gray-400" />
        <span className="text-sm text-gray-500">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center rounded-lg overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        onError={() => setImgError(true)}
        alt="Prova social"
        className="max-w-full h-auto max-h-80 rounded-lg object-contain"
      />
    </div>
  );
}

type SocialProofCarouselProps = {
  items: SocialProofItem[];
  autoPlay?: boolean;
  interval?: number;
};

export function SocialProofCarousel({
  items,
  autoPlay = false,
  interval = 5,
}: SocialProofCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Compute derived values
  const itemsLength = items?.length ?? 0;
  const hasMultipleItems = itemsLength > 1;
  const isEmpty = itemsLength === 0;

  // Navigation functions - defined before any conditional returns
  const goToNext = useCallback(() => {
    if (itemsLength === 0) return;
    setCurrentIndex((prev) => (prev + 1) % itemsLength);
  }, [itemsLength]);

  const goToPrev = useCallback(() => {
    if (itemsLength === 0) return;
    setCurrentIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
  }, [itemsLength]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Pause auto-play on interaction, resume after 3 seconds
  const handleInteraction = useCallback(() => {
    if (!autoPlay) return;
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  }, [autoPlay]);

  // Touch handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    handleInteraction();
  }, [handleInteraction]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const deltaX = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  }, [goToNext, goToPrev]);

  // Handle button clicks with interaction pause
  const handlePrevClick = useCallback(() => {
    handleInteraction();
    goToPrev();
  }, [handleInteraction, goToPrev]);

  const handleNextClick = useCallback(() => {
    handleInteraction();
    goToNext();
  }, [handleInteraction, goToNext]);

  const handleDotClick = useCallback((index: number) => {
    handleInteraction();
    goToIndex(index);
  }, [handleInteraction, goToIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !hasMultipleItems || isPaused || isEmpty) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, interval * 1000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, hasMultipleItems, isPaused, interval, goToNext, isEmpty]);

  // Edge case: no items - render nothing
  if (isEmpty) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Carousel container */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation buttons - only show if multiple items */}
        {hasMultipleItems && (
          <>
            <button
              type="button"
              onClick={handlePrevClick}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNextClick}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Carousel content with transition */}
        <div className="overflow-hidden px-2">
          <div
            className="transition-opacity duration-300 ease-in-out"
            key={currentIndex}
          >
            {currentItem.type === "text" ? (
              <TextProofCard item={currentItem} />
            ) : (
              <ImageProofCard item={currentItem} />
            )}
          </div>
        </div>
      </div>

      {/* Dot indicators - only show if multiple items */}
      {hasMultipleItems && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-green-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Ir para item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
