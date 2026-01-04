import type { PolicySection as PolicySectionType } from "./types";

interface PolicySectionProps {
  section: PolicySectionType;
}

export function PolicySection({ section }: PolicySectionProps) {
  return (
    <section id={section.id} className="scroll-mt-8">
      <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
        {section.title}
      </h2>
      <div className="prose prose-sm max-w-none text-muted-foreground md:prose-base">
        {section.content}
      </div>
    </section>
  );
}
