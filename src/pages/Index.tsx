import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  release_year: number | null;
  duration_minutes: number | null;
  rating: number | null;
  genre: string[] | null;
  featured: boolean | null;
}

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching movies:', error);
        return;
      }

      if (data) {
        setMovies(data);
        const featured = data.find(m => m.featured) || data[0];
        setFeaturedMovie(featured);
      }
      setLoading(false);
    }

    fetchMovies();
  }, []);

  // Group movies by genre
  const getMoviesByGenre = (genre: string) => {
    return movies.filter(m => m.genre?.includes(genre)).slice(0, 6);
  };

  const actionMovies = getMoviesByGenre('Ação');
  const dramaMovies = getMoviesByGenre('Drama');
  const scifiMovies = getMoviesByGenre('Ficção Científica');
  const thrillerMovies = getMoviesByGenre('Thriller');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <Skeleton className="h-[85vh] w-full" />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      {featuredMovie && <HeroSection movie={featuredMovie} />}

      {/* Movie Rows */}
      <div className="-mt-20 relative z-10">
        {user && (
          <MovieRow title="Continue Assistindo" movies={movies.slice(0, 6)} />
        )}
        
        <MovieRow title="Em Alta" movies={movies.slice(0, 6)} />
        
        {actionMovies.length > 0 && (
          <MovieRow title="Ação" movies={actionMovies} />
        )}
        
        {dramaMovies.length > 0 && (
          <MovieRow title="Drama" movies={dramaMovies} />
        )}
        
        {scifiMovies.length > 0 && (
          <MovieRow title="Ficção Científica" movies={scifiMovies} />
        )}
        
        {thrillerMovies.length > 0 && (
          <MovieRow title="Thriller" movies={thrillerMovies} />
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display text-gradient-gold">CINEMAX</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 CineMax. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
