import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  category?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

export function usePosts(isAuthenticated: boolean = true) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      if (!isAuthenticated) {
        // For non-logged users: 30% B.Tech, 30% Abroad, 40% Entrance Exam
        const [btechData, abroadData, entranceData] = await Promise.all([
          (supabase as any)
            .from('posts')
            .select(`
              *,
              profiles:user_id (
                username,
                avatar_url
              )
            `)
            .eq('category', 'B.Tech')
            .order('created_at', { ascending: false })
            .limit(3),
          (supabase as any)
            .from('posts')
            .select(`
              *,
              profiles:user_id (
                username,
                avatar_url
              )
            `)
            .eq('category', 'Abroad')
            .order('created_at', { ascending: false })
            .limit(3),
          (supabase as any)
            .from('posts')
            .select(`
              *,
              profiles:user_id (
                username,
                avatar_url
              )
            `)
            .eq('category', 'Entrance Exam')
            .order('created_at', { ascending: false })
            .limit(4)
        ]);

        const combinedPosts = [
          ...(btechData.data || []),
          ...(abroadData.data || []),
          ...(entranceData.data || [])
        ];
        
        setPosts(combinedPosts);
      } else {
        // For authenticated users: show all posts
        const { data, error } = await (supabase as any)
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up realtime subscription only for authenticated users
    if (isAuthenticated) {
      const channel = supabase
        .channel('posts-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'posts'
          },
          () => {
            fetchPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  return { posts, loading, refetch: fetchPosts };
}
