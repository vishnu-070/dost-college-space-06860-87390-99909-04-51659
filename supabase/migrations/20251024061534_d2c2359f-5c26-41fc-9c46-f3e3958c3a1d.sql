-- Add category column to posts table
ALTER TABLE public.posts 
ADD COLUMN category text CHECK (category IN ('B.Tech', 'Abroad', 'Entrance Exam'));

-- Add index for better performance when filtering by category
CREATE INDEX idx_posts_category ON public.posts(category);