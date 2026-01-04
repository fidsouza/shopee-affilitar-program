import type { ReactNode } from "react";

export interface PolicySection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface ContactInfo {
  name: string;
  email: string;
  cnpj?: string;
}

export interface PolicyMetadata {
  lastUpdated: string;
  language: string;
}
