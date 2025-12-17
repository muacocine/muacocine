import { supabase } from '@/integrations/supabase/client';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  similar?: {
    results: TMDBMovie[];
  };
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null) => {
  if (!path) return null;
  return `${IMAGE_BASE}/original${path}`;
};

export const tmdbApi = {
  async getTrending(): Promise<TMDBMovie[]> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'trending' }
    });
    if (error) throw error;
    return data.results || [];
  },

  async getPopular(page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'popular', params: { page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getTopRated(page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'top_rated', params: { page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getNowPlaying(page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'now_playing', params: { page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getUpcoming(page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'upcoming', params: { page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'movie_details', params: { movieId } }
    });
    if (error) throw error;
    return data;
  },

  async searchMovies(query: string, page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'search', params: { query, searchPage: page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getGenres(): Promise<TMDBGenre[]> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'genres' }
    });
    if (error) throw error;
    return data.genres || [];
  },

  async getByGenre(genreId: number, page = 1): Promise<{ movies: TMDBMovie[]; totalPages: number }> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'by_genre', params: { genreId, genrePage: page } }
    });
    if (error) throw error;
    return { movies: data.results || [], totalPages: data.total_pages };
  },

  async getBulkMovies(pages = 15): Promise<TMDBMovie[]> {
    const { data, error } = await supabase.functions.invoke('tmdb-api', {
      body: { action: 'bulk_movies', params: { pages } }
    });
    if (error) throw error;
    return data.results || [];
  }
};

// Genre ID mapping
export const GENRE_MAP: Record<number, string> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste'
};

export const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
};
