import { notFound } from "next/navigation";
import { patternSlugs, getPattern } from "@/content";
import { PatternPageLayout } from "@/components/pattern/pattern-page-layout";

interface PatternPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return patternSlugs.map((slug) => ({ slug }));
}

export default function PatternPage({ params }: PatternPageProps) {
  const pattern = getPattern(params.slug);
  if (!pattern) notFound();
  return <PatternPageLayout pattern={pattern} />;
}
