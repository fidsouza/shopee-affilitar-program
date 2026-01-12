/**
 * WhatsApp Group Screenshot Generator Types
 * Feature: 001-whatsapp-proof-generator
 */

/**
 * Individual participant message in group chat
 */
export interface Participant {
  /** Unique identifier (UUID) */
  id: string;

  /** Sequential label ("pessoa 1", "pessoa 2", etc.) */
  label: string;

  /** Optional display name (empty = use label) */
  name: string;

  /** Message text content */
  message: string;

  /** Auto-generated timestamp (HH:MM format) */
  timestamp: string;

  /** Display order (0-19, ascending from top) */
  order: number;
}

/**
 * Complete WhatsApp group screenshot configuration
 */
export interface WhatsAppScreenshot {
  /** Group name displayed in header */
  groupName: string;

  /** Ordered list of participant messages */
  participants: Participant[];

  /** Creation timestamp (for filename generation) */
  createdAt: Date;

  /** Optional custom group icon URL (HTTPS only) */
  groupIconUrl?: string;
}

/**
 * Form state for WhatsApp screenshot generator component
 */
export interface WhatsAppGeneratorFormState {
  groupName: string;
  participants: Participant[];
  selectedParticipantId: string | null;
}

/**
 * Initial empty form state
 */
export const initialFormState: WhatsAppGeneratorFormState = {
  groupName: "",
  participants: [],
  selectedParticipantId: null
};

/**
 * Generate auto-incrementing timestamp for participant messages
 * @param index - Participant index (0-based)
 * @returns Time string in HH:MM format
 */
export const generateTimestamp = (index: number): string => {
  const baseTime = new Date();
  baseTime.setHours(10, 30, 0, 0); // Start at 10:30 AM
  baseTime.setMinutes(baseTime.getMinutes() + index); // Add 1 minute per participant

  const hours = baseTime.getHours().toString().padStart(2, '0');
  const minutes = baseTime.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

/**
 * Generate filename for downloaded screenshot
 * @param groupName - Group name from form
 * @param createdAt - Creation timestamp
 * @returns Filename string
 */
export const generateFilename = (groupName: string, createdAt: Date = new Date()): string => {
  const timestamp = createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedGroupName = groupName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `whatsapp-${sanitizedGroupName || 'grupo'}-${timestamp}.png`;
};
