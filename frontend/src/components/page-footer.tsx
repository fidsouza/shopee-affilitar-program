"use client";

type PageFooterProps = {
  text: string | null;
};

export function PageFooter({ text }: PageFooterProps) {
  // Conditional render: only show if text is not null/empty
  if (!text || text.trim() === '') {
    return null;
  }

  return (
    <footer className="mt-8 w-full max-w-md mx-auto px-4 text-center">
      <p className="text-sm text-gray-500 whitespace-pre-wrap">
        {text}
      </p>
    </footer>
  );
}
