interface PatternPageProps {
  params: { slug: string };
}

export default function PatternPage({ params }: PatternPageProps) {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-3xl font-bold capitalize">{params.slug.replace(/-/g, " ")}</h1>
    </main>
  );
}
