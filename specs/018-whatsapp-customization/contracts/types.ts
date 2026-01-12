/**
 * Type Contracts: WhatsApp Group Customization Features
 * Feature: 018-whatsapp-customization
 * Date: 2026-01-11
 *
 * This file defines the TypeScript type contracts for the new customization fields.
 * These types will be integrated into the existing codebase.
 */

// ==============================================================================
// NEW FIELD TYPES (Feature 018)
// ==============================================================================

/**
 * Custom group profile image URL
 * - Must be HTTPS
 * - Must point to valid image file (.jpg, .jpeg, .png, .gif, .webp)
 * - Optional field (can be undefined)
 */
export type GroupImageUrl = string | undefined;

/**
 * Custom participant count to display
 * - Must be non-negative integer
 * - Range: 0 to 999,999
 * - Optional field (can be undefined)
 */
export type ParticipantCount = number | undefined;

/**
 * Footer enabled toggle
 * - Controls whether WhatsApp-style footer is displayed
 * - Defaults to false
 */
export type FooterEnabled = boolean;

// ==============================================================================
// EXTENDED WHATSAPP PAGE RECORD
// ==============================================================================

/**
 * Extended WhatsAppPageRecord with new customization fields
 * Extends the existing type defined in lib/repos/whatsapp-pages.ts
 */
export interface WhatsAppPageRecordExtended {
  // ... all existing fields remain unchanged ...
  id: string;
  slug: string;
  headline: string;
  headerImageUrl?: string;
  socialProofs: string[];
  buttonText: string;
  whatsappUrl: string;
  pixelConfigId?: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: 'active' | 'inactive';
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
  socialProofEnabled: boolean;
  socialProofInterval: number;
  redirectEnabled: boolean;
  buttonEvent?: MetaEvent;
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string | null;
  vacancyBackgroundColor: string | null;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
  vacancyDecrementInterval: number;
  vacancyHeadlineColor: string | null;
  vacancyCountColor: string | null;
  vacancyFooterColor: string | null;
  socialProofCarouselItems: SocialProofItem[];
  carouselAutoPlay: boolean;
  carouselInterval: number;
  footerText: string | null;
  subheadlineFontSize: EmojiSize;
  buttonSize: EmojiSize;
  createdAt: string;
  updatedAt: string;

  // NEW FIELDS (Feature 018)
  groupImageUrl?: GroupImageUrl;
  participantCount?: ParticipantCount;
  footerEnabled: FooterEnabled;
}

// ==============================================================================
// COMPONENT PROPS
// ==============================================================================

/**
 * Props for WhatsAppFooter component
 */
export interface WhatsAppFooterProps {
  /**
   * Callback fired when send button is clicked or Enter is pressed
   * Should trigger WhatsApp redirect (same as main CTA button)
   */
  onSendClick: () => void;

  /**
   * Optional placeholder text for input field
   * @default "Digite uma mensagem..."
   */
  placeholder?: string;

  /**
   * Optional CSS classes for styling
   */
  className?: string;
}

/**
 * Props for WhatsAppRedirectClient component (extended)
 * Extends existing Props type in app/w/[slug]/client.tsx
 */
export interface WhatsAppRedirectClientPropsExtended {
  page: WhatsAppPageRecordExtended;
  pixelId?: string;
  eventId: string;
  redirectEventId: string;
  buttonEventId: string;
  appearance: WhatsAppAppearanceRecord;
}

// ==============================================================================
// ADMIN FORM TYPES
// ==============================================================================

/**
 * Admin form input for new fields
 * Used in parametrizacao/whatsapp/page.tsx
 */
export interface WhatsAppCustomizationFormInput {
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled: boolean;
}

/**
 * Form field state for group image
 */
export interface GroupImageFieldState {
  value: string;
  error?: string;
  isValid: boolean;
}

/**
 * Form field state for participant count
 */
export interface ParticipantCountFieldState {
  value: number | '';
  error?: string;
  isValid: boolean;
}

// ==============================================================================
// VALIDATION TYPES
// ==============================================================================

/**
 * Validation result for group image URL
 */
export interface GroupImageValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

/**
 * Validation result for participant count
 */
export interface ParticipantCountValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: number;
}

// ==============================================================================
// LEGACY SUPPORT TYPES
// ==============================================================================

/**
 * Legacy WhatsAppPageRecord without new fields
 * Used for backward compatibility in migration
 */
export type LegacyWhatsAppPageRecord = Omit<
  WhatsAppPageRecordExtended,
  'groupImageUrl' | 'participantCount' | 'footerEnabled'
> & {
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled?: boolean;
};

// ==============================================================================
// RE-EXPORTS OF EXISTING TYPES (for reference)
// ==============================================================================

/**
 * Meta Pixel event type
 * From: lib/meta-events.ts
 */
export type MetaEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';

/**
 * Benefit card structure
 * From: lib/validation.ts
 */
export interface BenefitCard {
  emoji: string;
  title: string;
  description?: string;
}

/**
 * Emoji/text size variants
 * From: lib/validation.ts
 */
export type EmojiSize = 'small' | 'medium' | 'large';

/**
 * Social proof carousel item
 * From: lib/validation.ts
 */
export type SocialProofItem =
  | { id: string; type: 'text'; description: string; author: string; }
  | { id: string; type: 'image'; imageUrl: string; caption?: string; };

/**
 * WhatsApp appearance configuration
 * From: lib/repos/whatsapp-appearance.ts
 */
export interface WhatsAppAppearanceRecord {
  redirectText: string;
  backgroundColor: string | null;
  borderEnabled: boolean;
}

// ==============================================================================
// TYPE GUARDS
// ==============================================================================

/**
 * Type guard to check if a value is a valid group image URL
 */
export function isValidGroupImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (!value.startsWith('https://')) return false;
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(value);
}

/**
 * Type guard to check if a value is a valid participant count
 */
export function isValidParticipantCount(value: unknown): value is number {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  return value >= 0 && value <= 999999;
}

/**
 * Type guard to check if a record has new customization fields
 */
export function hasCustomizationFields(
  record: unknown
): record is WhatsAppPageRecordExtended {
  const r = record as Partial<WhatsAppPageRecordExtended>;
  return (
    'groupImageUrl' in r ||
    'participantCount' in r ||
    'footerEnabled' in r
  );
}
