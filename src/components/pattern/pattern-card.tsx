"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PatternCategory } from "@/content/types";

const categoryColors: Record<PatternCategory, string> = {
  creational: "border-accent/40 text-accent",
  structural: "border-secondary/40 text-secondary",
  behavioral: "border-primary/40 text-primary",
};

interface PatternCardProps {
  title: string;
  description: string;
  slug: string;
  category: PatternCategory;
}

export function PatternCard({ title, description, slug, category }: PatternCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/patterns/${slug}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        <Card className="h-full bg-card border-border/60 transition-colors hover:border-accent/40 hover:shadow-[0_0_20px_hsl(var(--accent)/0.08)]">
          <CardHeader className="pb-2">
            <Badge
              variant="outline"
              className={`mb-2 w-fit capitalize ${categoryColors[category]}`}
            >
              {category}
            </Badge>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          </CardContent>
          <CardFooter>
            <span className="flex items-center gap-1 text-xs text-accent font-medium">
              Explore <ArrowRight className="h-3 w-3" />
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
