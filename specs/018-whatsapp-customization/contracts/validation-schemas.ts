/**
 * Validation Schema Contracts: WhatsApp Group Customization Features
 * Feature: 018-whatsapp-customization
 * Date: 2026-01-11
 *
 * This file defines the Zod validation schemas for the new customization fields.
 * These schemas will be added to lib/validation.ts
 */

import { z } from 'zod';

// ==============================================================================
// FIELD VALIDATION SCHEMAS
// ==============================================================================

/**
 * Group Image URL validation schema
 *
 * Rules:
 * - Must be valid URL
 * - Must use HTTPS protocol
 * - Must end with image extension (.jpg, .jpeg, .png, .gif, .webp)
 * - Can include query parameters
 * - Max length: 2048 characters
 * - Optional field
 *
 * Examples:
 * - Valid: "https://example.com/image.jpg"
 * - Valid: "https://cdn.example.com/images/profile.png?size=large"
 * - Invalid: "http://example.com/image.jpg" (not HTTPS)
 * - Invalid: "https://example.com/file.pdf" (not an image)
 */
export const groupImageUrlSchema = z
  .string()
  .url('URL inválida')
  .regex(
    /^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
    'URL deve ser HTTPS e apontar para uma imagem válida (.jpg, .png, .gif, .webp)'
  )
  .max(2048, 'URL deve ter no máximo 2048 caracteres')
  .optional();

/**
 * Participant Count validation schema
 *
 * Rules:
 * - Must be a number
 * - Must be an integer (no decimals)
 * - Minimum: 0 (non-negative)
 * - Maximum: 999,999 (practical display limit)
 * - Optional field
 *
 * Examples:
 * - Valid: 0, 1, 247, 999999
 * - Invalid: -1 (negative)
 * - Invalid: 1.5 (decimal)
 * - Invalid: 1000000 (too large)
 */
export const participantCountSchema = z
  .number({
    invalid_type_error: 'Quantidade deve ser um número',
  })
  .int('Quantidade deve ser um número inteiro')
  .min(0, 'Quantidade deve ser maior ou igual a 0')
  .max(999999, 'Quantidade deve ser menor que 1.000.000')
  .optional();

/**
 * Footer Enabled validation schema
 *
 * Rules:
 * - Must be boolean
 * - Defaults to false (footer disabled)
 * - Non-optional (always has value)
 *
 * Examples:
 * - Valid: true, false
 * - Default: false
 */
export const footerEnabledSchema = z.boolean().default(false);

// ==============================================================================
// EXTENDED WHATSAPP PAGE SCHEMA
// ==============================================================================

/**
 * Extended WhatsApp Page schema with new fields
 *
 * This schema extends the existing whatsAppPageSchema in lib/validation.ts
 * Add these fields to the existing schema object:
 *
 * ```typescript
 * export const whatsAppPageSchema = z.object({
 *   // ... existing fields ...
 *
 *   // NEW FIELDS (Feature 018)
 *   groupImageUrl: groupImageUrlSchema,
 *   participantCount: participantCountSchema,
 *   footerEnabled: footerEnabledSchema,
 * });
 * ```
 */

// ==============================================================================
// FORM INPUT SCHEMA (Admin Panel)
// ==============================================================================

/**
 * Admin form input schema for customization fields
 *
 * This schema can be used to validate the admin form input
 * before submitting to the server action.
 */
export const whatsAppCustomizationFormSchema = z.object({
  groupImageUrl: groupImageUrlSchema,
  participantCount: participantCountSchema,
  footerEnabled: footerEnabledSchema,
});

export type WhatsAppCustomizationFormInput = z.infer<
  typeof whatsAppCustomizationFormSchema
>;

// ==============================================================================
// VALIDATION HELPER FUNCTIONS
// ==============================================================================

/**
 * Validate group image URL with detailed error information
 *
 * @param url - URL string to validate
 * @returns Validation result with error message if invalid
 */
export function validateGroupImageUrl(url: string | undefined): {
  isValid: boolean;
  error?: string;
} {
  if (!url) {
    return { isValid: true }; // Optional field
  }

  try {
    groupImageUrlSchema.parse(url);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'URL inválida',
      };
    }
    return { isValid: false, error: 'Erro desconhecido ao validar URL' };
  }
}

/**
 * Validate participant count with detailed error information
 *
 * @param count - Number to validate
 * @returns Validation result with error message if invalid
 */
export function validateParticipantCount(count: number | undefined): {
  isValid: boolean;
  error?: string;
} {
  if (count === undefined) {
    return { isValid: true }; // Optional field
  }

  try {
    participantCountSchema.parse(count);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Quantidade inválida',
      };
    }
    return { isValid: false, error: 'Erro desconhecido ao validar quantidade' };
  }
}

/**
 * Sanitize group image URL input
 *
 * Trims whitespace and returns undefined if empty
 *
 * @param url - Raw URL input from form
 * @returns Sanitized URL or undefined
 */
export function sanitizeGroupImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Sanitize participant count input
 *
 * Converts string to number and returns undefined if empty
 *
 * @param count - Raw count input from form (may be string)
 * @returns Sanitized number or undefined
 */
export function sanitizeParticipantCount(
  count: number | string | undefined
): number | undefined {
  if (count === undefined || count === '') return undefined;
  const num = typeof count === 'string' ? parseInt(count, 10) : count;
  return isNaN(num) ? undefined : num;
}

// ==============================================================================
// ERROR MESSAGE CONSTANTS
// ==============================================================================

/**
 * Portuguese error messages for customization fields
 */
export const CUSTOMIZATION_ERROR_MESSAGES = {
  groupImageUrl: {
    required: 'URL da imagem é obrigatória',
    invalid: 'URL inválida',
    notHttps: 'URL deve começar com https://',
    notImage: 'URL deve apontar para uma imagem válida (.jpg, .png, .gif, .webp)',
    tooLong: 'URL deve ter no máximo 2048 caracteres',
  },
  participantCount: {
    required: 'Quantidade de participantes é obrigatória',
    notNumber: 'Quantidade deve ser um número',
    notInteger: 'Quantidade deve ser um número inteiro',
    negative: 'Quantidade deve ser maior ou igual a 0',
    tooLarge: 'Quantidade deve ser menor que 1.000.000',
  },
  footerEnabled: {
    required: 'Configuração do footer é obrigatória',
    notBoolean: 'Valor deve ser verdadeiro ou falso',
  },
} as const;

// ==============================================================================
// SCHEMA EXAMPLES (for testing)
// ==============================================================================

/**
 * Example valid inputs
 */
export const VALID_EXAMPLES = {
  groupImageUrl: [
    'https://example.com/image.jpg',
    'https://cdn.example.com/profile.png',
    'https://storage.example.com/photos/group.webp?size=large&quality=high',
    undefined, // Optional
  ],
  participantCount: [
    0,
    1,
    247,
    999999,
    undefined, // Optional
  ],
  footerEnabled: [true, false],
} as const;

/**
 * Example invalid inputs
 */
export const INVALID_EXAMPLES = {
  groupImageUrl: [
    'http://example.com/image.jpg', // Not HTTPS
    'https://example.com/file.pdf', // Not an image
    'not-a-url', // Invalid URL format
    'ftp://example.com/image.jpg', // Wrong protocol
  ],
  participantCount: [
    -1, // Negative
    1.5, // Decimal
    1000000, // Too large
    NaN, // Not a number
    Infinity, // Invalid
  ],
  footerEnabled: [
    'true', // String instead of boolean
    1, // Number instead of boolean
    null, // Null
  ],
} as const;
