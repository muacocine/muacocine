import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { tmdbApi, TMDBMovie, getImageUrl, getGenreNames } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GenrePage() {
  const { genreId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const genreName = searchParams.get('name') || 'Categoria';

  useEffect(() => {
    async function fetchMovies() {
      if (!genreId) return;
      
      setLoading(true);
      try {
        const data = await tmdbApi.getByGenre(parseInt(genreId), page);
        setMovies(data.movies);
        setTotalPages(Math.min(data.totalPages, 50)); // Limit to 50 pages (1000 movies)
      } catch (error) {
        console.error('Error fetching genre movies:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMovies();
  }, [genreId, page]);

  const transformMovie = (movie: TMDBMovie) => ({
    id: movie.id.toString(),
    title: movie.title,
    poster_url: getImageUrl(movie.poster_path),
    release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
    rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : null,
    genre: movie.genre_ids ? getGenreNames(movie.genre_ids) : [],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-4xl font-display text-foreground mb-8">
          {genreName.toUpperCase()}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={transformMovie(movie)} index={index} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              
              <span className="text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
