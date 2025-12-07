export const META_STANDARD_EVENTS = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Lead",
  "Purchase",
  "AddPaymentInfo",
  "CompleteRegistration",
] as const;

export type MetaEvent = (typeof META_STANDARD_EVENTS)[number];

export const META_EVENT_SET = new Set<MetaEvent>(META_STANDARD_EVENTS);

export function isMetaEvent(value: string): value is MetaEvent {
  return META_EVENT_SET.has(value as MetaEvent);
}
