'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EducationArticle } from '@/types/education';
import { PopularTopics } from './popular-topics';

interface SearchInterfaceProps {
  onSearch: (query: string) => Promise<void> | void;
  placeholder?: string;
  onSearchApplied?: () => void;
  popularTags?: string[];
}

export function SearchInterface({
  onSearch,
  placeholder = "Search articles, techniques, ingredients...",
  onSearchApplied,
  popularTags = [],
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<EducationArticle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTag && !popularTags.includes(selectedTag)) {
      setSelectedTag(null);
    }
  }, [popularTags, selectedTag]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (value: string) => {
    setQuery(value);
    if (selectedTag) {
      setSelectedTag(null);
    }

    if (value.length >= 2) {
      setLoading(true);
      try {
        const response = await fetch(`/api/education/search?q=${encodeURIComponent(value)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.data || []);
          setShowSuggestions(true);
        } else {
          console.error('Search API error:', response.status);
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    const normalizedQuery = searchQuery.trim();

    if (normalizedQuery) {
      await Promise.resolve(onSearch(normalizedQuery));
      setShowSuggestions(false);
      onSearchApplied?.();
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: EducationArticle) => {
    const title = suggestion.title;
    setQuery(title);
    setShowSuggestions(false);
    void handleSearch(title);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedTag(null);
    void Promise.resolve(onSearch(''));
  };

  const handlePopularTagChange = (tag: string | null) => {
    if (!tag) {
      clearSearch();
      return;
    }

    setSelectedTag(tag);
    setQuery(tag);
    void handleSearch(tag);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="pl-10 pr-10 h-12 text-sm md:text-base rounded-xl border border-border/60 bg-background/80 focus:border-foreground/40 focus:ring-0"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-foreground/60 hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 z-50 border border-border/60 bg-background/95 shadow-sm backdrop-blur">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin w-5 h-5 border-2 border-foreground/40 border-t-transparent rounded-full mx-auto mb-2"></div>
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors"
                  >
                    <div className="font-medium text-foreground">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{suggestion.excerpt}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">No suggestions found</div>
            )}
          </CardContent>
        </Card>
      )}

      {popularTags.length > 0 && (
        <PopularTopics tags={popularTags} selectedTag={selectedTag} onChange={handlePopularTagChange} />
      )}
    </div>
  );
}
