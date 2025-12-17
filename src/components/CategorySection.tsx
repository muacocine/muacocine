import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi, TMDBGenre } from '@/lib/tmdb';
import { Film, Sword, Laugh, Ghost, Rocket, Heart, Wand2, Skull } from 'lucide-react';

const genreIcons: Record<number, React.ReactNode> = {
  28: <Sword className="w-6 h-6" />, // Action
  35: <Laugh className="w-6 h-6" />, // Comedy
  27: <Ghost className="w-6 h-6" />, // Horror
  878: <Rocket className="w-6 h-6" />, // Sci-Fi
  10749: <Heart className="w-6 h-6" />, // Romance
  14: <Wand2 className="w-6 h-6" />, // Fantasy
  80: <Skull className="w-6 h-6" />, // Crime
};

export default function CategorySection() {
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await tmdbApi.getGenres();
        setGenres(data.slice(0, 8)); // Show first 8 genres
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }
    fetchGenres();
  }, []);

  const handleGenreClick = (genreId: number, genreName: string) => {
    navigate(`/genre/${genreId}?name=${encodeURIComponent(genreName)}`);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display text-foreground mb-6">
          CATEGORIAS
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id, genre.name)}
              className="group flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <div className="text-primary mb-3 group-hover:scale-110 transition-transform">
                {genreIcons[genre.id] || <Film className="w-6 h-6" />}
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                {genre.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
