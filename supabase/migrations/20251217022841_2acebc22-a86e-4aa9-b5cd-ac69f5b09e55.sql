-- Create user ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all ratings" 
ON public.ratings FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create their own ratings" 
ON public.ratings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.ratings FOR DELETE 
USING (auth.uid() = user_id);

-- Update favorites table to use TEXT for movie_id (TMDB IDs)
ALTER TABLE public.favorites DROP CONSTRAINT favorites_movie_id_fkey;
ALTER TABLE public.favorites ALTER COLUMN movie_id TYPE TEXT USING movie_id::TEXT;