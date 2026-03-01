import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { patternSlugs, getPattern } from "@/content";
import { PatternPageLayout } from "@/components/pattern/pattern-page-layout";

interface PatternPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return patternSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const pattern = getPattern(params.slug);
  if (!pattern) return {};
  return {
    title: pattern.name,
    description: pattern.tagline,
    openGraph: {
      title: `${pattern.name} Pattern`,
      description: pattern.tagline,
    },
  };
}

export default function PatternPage({ params }: PatternPageProps) {
  const pattern = getPattern(params.slug);
  if (!pattern) notFound();
  return <PatternPageLayout pattern={pattern} />;
}
