import { useNavigate } from 'react-router-dom';
import { ChevronRight, Tv } from 'lucide-react';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  poster_url: string | null;
  release_year: number | null;
  rating: number | null;
  genre: string[] | null;
  isTV?: boolean;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isTV?: boolean;
}

export default function MovieRow({ title, movies, isTV = false }: MovieRowProps) {
  const navigate = useNavigate();

  if (movies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isTV && <Tv className="w-6 h-6 text-primary" />}
            <h2 className="text-2xl md:text-3xl font-display text-foreground">
              {title.toUpperCase()}
            </h2>
          </div>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium">
            Ver todos
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              index={index} 
              isTV={isTV || movie.isTV}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
