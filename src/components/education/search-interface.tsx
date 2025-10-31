'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EducationArticle } from '@/types/education';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchInterface({ onSearch, placeholder = "Search articles, techniques, ingredients..." }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<EducationArticle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Popular search terms
  const popularSearches = [
    'shaking techniques',
    'muddling basics',
    'stirring vs shaking',
    'glassware guide',
    'bitters guide',
    'classic cocktails',
    'garnishing tips',
    'bar tools'
  ];

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

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: EducationArticle) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const handlePopularSearchClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
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
                {suggestions.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSuggestionClick(article)}
                    className="w-full text-left p-4 transition-colors hover:bg-muted/40 border-b border-border/60 last:border-b-0"
                  >
                    <div className="font-medium mb-1">{article.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs border border-border/60 bg-muted/40 text-foreground/70">
                        {article.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs border border-border/60 text-foreground/60">
                        {article.difficulty}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                No articles found for "{query}"
              </div>
            ) : (
              <div className="p-4">
                <div className="text-sm text-muted-foreground mb-3">Popular searches:</div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer border border-border/60 text-foreground/70 hover:bg-muted/40 transition-colors"
                      onClick={() => handlePopularSearchClick(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
