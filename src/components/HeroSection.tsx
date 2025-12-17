import { Play, Plus, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Movie {
  id: string;
  title: string;
  description: string | null;
  backdrop_url: string | null;
  release_year: number | null;
  duration_minutes: number | null;
  rating: number | null;
  genre: string[] | null;
}

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.backdrop_url})` }}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-hero-bottom" />
      <div className="absolute inset-0 bg-background/30" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-slide-up">
          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4">
            {movie.rating && (
              <div className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-primary" />
                <span className="font-semibold">{movie.rating}</span>
              </div>
            )}
            {movie.release_year && (
              <span className="text-muted-foreground">{movie.release_year}</span>
            )}
            {movie.duration_minutes && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(movie.duration_minutes)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-display text-foreground mb-4 leading-tight">
            {movie.title.toUpperCase()}
          </h1>

          {/* Genres */}
          {movie.genre && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g) => (
                <span 
                  key={g} 
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-lg text-foreground/80 mb-8 line-clamp-3">
            {movie.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl">
              <Play className="w-5 h-5 fill-primary-foreground" />
              Assistir Agora
            </Button>
            <Button variant="hero-outline" size="xl">
              <Plus className="w-5 h-5" />
              Minha Lista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
