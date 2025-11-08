'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PopularTopicsProps {
  tags: string[];
  selectedTag: string | null;
  onChange: (tag: string | null) => void;
  collapsedCount?: number;
}

export function PopularTopics({
  tags,
  selectedTag,
  onChange,
  collapsedCount = 12,
}: PopularTopicsProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleTags = useMemo(() => {
    if (expanded) {
      return tags;
    }

    return tags.slice(0, collapsedCount);
  }, [collapsedCount, expanded, tags]);

  if (tags.length === 0) {
    return null;
  }

  const handleTagClick = (tag: string) => {
    if (tag === selectedTag) {
      onChange(null);
    } else {
      onChange(tag);
    }
  };

  const canExpand = tags.length > collapsedCount;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Popular topics
        </span>
        <div className="flex items-center gap-2">
          {selectedTag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="h-7 px-2 text-foreground/80 hover:text-foreground"
            >
              Clear
            </Button>
          )}
          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((prev) => !prev)}
              className="h-7 px-2 text-foreground/80 hover:text-foreground"
            >
              {expanded ? (
                <span className="flex items-center gap-1">
                  Show less <ChevronUp className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Show more <ChevronDown className="h-4 w-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
      <div
        className={cn(
          'flex gap-2',
          expanded ? 'flex-wrap' : 'overflow-x-auto pb-2',
        )}
      >
        {visibleTags.map((tag) => {
          const isSelected = tag === selectedTag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-1 text-xs font-medium transition-colors duration-150',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/60 bg-muted/50 text-foreground hover:border-primary/60 hover:bg-primary/10',
              )}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
