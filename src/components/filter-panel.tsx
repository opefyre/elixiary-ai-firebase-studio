"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { SlidersHorizontal, X } from "lucide-react";

type ChipProps = {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
};

function Chip({ label, count, isActive, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-transparent hover:bg-secondary"
      }`}
    >
      {label} <span className="ml-1 text-xs opacity-60">{count}</span>
    </button>
  );
}

const categories = [
  { label: "Classic", count: 12 },
  { label: "Modern", count: 8 },
  { label: "Tropical", count: 5 },
  { label: "Non-Alcoholic", count: 3 },
];

const moods = [
  { label: "Celebratory", count: 7 },
  { label: "Relaxing", count: 9 },
  { label: "Party", count: 4 },
  { label: "Sophisticated", count: 6 },
];

export function FilterPanel() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleClearFilters = () => {
    setActiveCategory(null);
    setActiveMood(null);
  };

  const hasActiveFilters = activeCategory || activeMood;

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full" defaultValue="filters">
        <AccordionItem value="filters" className="border-b-0">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5" />
              <div className="text-left">
                <h4 className="text-base font-semibold">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Refine recipes by category and mood
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </h5>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Chip
                      key={cat.label}
                      label={cat.label}
                      count={cat.count}
                      isActive={activeCategory === cat.label}
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === cat.label ? null : cat.label
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mood
                </h5>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Chip
                      key={mood.label}
                      label={mood.label}
                      count={mood.count}
                      isActive={activeMood === mood.label}
                      onClick={() =>
                        setActiveMood(
                          activeMood === mood.label ? null : mood.label
                        )
                      }
                    />
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button variant="ghost" onClick={handleClearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
