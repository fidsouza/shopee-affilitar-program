"use client";

import { useState, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

/**
 * WhatsApp-style footer with text input and send button
 * Added 2026-01-11 for feature 018-whatsapp-customization (US3)
 */

export interface WhatsAppFooterProps {
  /** Callback triggered when send button is clicked or Enter is pressed */
  onSendClick: () => void;
  /** Optional placeholder text for the input field */
  placeholder?: string;
  /** Optional additional CSS classes */
  className?: string;
}

export function WhatsAppFooter({
  onSendClick,
  placeholder = "Digite uma mensagem",
  className = "",
}: WhatsAppFooterProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    onSendClick();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg ${className}`}
    >
      <div className="max-w-md mx-auto flex items-center gap-2 p-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />
        <button
          type="button"
          onClick={handleSend}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600 active:scale-95"
          aria-label="Enviar"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
