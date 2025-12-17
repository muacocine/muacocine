import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Film, Tv } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tmdbApi, TMDBMovie, getImageUrl, getGenreNames } from '@/lib/tmdb';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchType = 'movie' | 'tv';

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [searchType]);

  const searchContent = useCallback(async (searchQuery: string, pageNum: number, append = false) => {
    if (searchQuery.length < 2) {
      if (!append) setResults([]);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let data;
      if (searchType === 'movie') {
        data = await tmdbApi.searchMovies(searchQuery, pageNum);
      } else {
        data = await tmdbApi.searchTVShows(searchQuery, pageNum);
      }
      
      if (append) {
        setResults(prev => [...prev, ...data.movies]);
      } else {
        setResults(data.movies);
      }
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchType]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        searchContent(query, 1, false);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, searchContent]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchContent(query, nextPage, true);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 200 && hasMore && !loadingMore) {
      loadMore();
    }
  };

  const handleSelect = (id: number) => {
    const path = searchType === 'movie' ? `/movie/${id}` : `/tv/${id}`;
    navigate(path);
    setQuery('');
    setResults([]);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div className="container mx-auto px-4 pt-24 h-full flex flex-col">
        {/* Search Type Toggle */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant={searchType === 'movie' ? 'default' : 'outline'}
            onClick={() => setSearchType('movie')}
            className="gap-2"
          >
            <Film className="w-4 h-4" />
            Filmes
          </Button>
          <Button
            variant={searchType === 'tv' ? 'default' : 'outline'}
            onClick={() => setSearchType('tv')}
            className="gap-2"
          >
            <Tv className="w-4 h-4" />
            Séries
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-6 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={searchType === 'movie' ? 'Buscar filmes...' : 'Buscar séries...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-16 pl-14 pr-14 text-lg bg-secondary border-border focus:border-primary rounded-xl"
          />
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results with Scroll */}
        <div 
          ref={resultsRef}
          className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full pb-8"
          onScroll={handleScroll}
        >
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum resultado encontrado para "{query}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid gap-4">
              {results.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleSelect(item.id)}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg hover:bg-secondary transition-colors text-left animate-slide-up"
                  style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
                >
                  <img 
                    src={getImageUrl(item.poster_path, 'w200')} 
                    alt={item.title || (item as any).name}
                    className="w-16 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {searchType === 'tv' && <Tv className="w-4 h-4 text-primary" />}
                      <h3 className="font-display text-xl text-foreground">
                        {(item.title || (item as any).name || '').toUpperCase()}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {item.vote_average && (
                        <span className="flex items-center gap-1 text-primary">
                          <Star className="w-4 h-4 fill-primary" />
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                      {(item.release_date || (item as any).first_air_date) && (
                        <span>
                          {new Date(item.release_date || (item as any).first_air_date).getFullYear()}
                        </span>
                      )}
                      {item.genre_ids && item.genre_ids.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{getGenreNames(item.genre_ids).slice(0, 2).join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* Load More Indicator */}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {hasMore && !loadingMore && results.length > 0 && (
                <div className="text-center py-4">
                  <Button variant="outline" onClick={loadMore}>
                    Carregar mais
                  </Button>
                </div>
              )}

              {!hasMore && results.length > 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Fim dos resultados
                </p>
              )}
            </div>
          )}

          {/* Search hints */}
          {query.length < 2 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Digite pelo menos 2 caracteres para buscar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
