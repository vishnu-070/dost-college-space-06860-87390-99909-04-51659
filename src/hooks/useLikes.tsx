import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useLikes(postId: string, userId: string | undefined) {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      checkIfLiked();
    }
    fetchLikesCount();
  }, [postId, userId]);

  const checkIfLiked = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setHasLiked(!!data);
    } catch (error: any) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchLikesCount = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .maybeSingle();

      if (error) throw error;
      setLikesCount(data?.likes_count || 0);
    } catch (error: any) {
      console.error('Error fetching likes count:', error);
    }
  };

  const toggleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasLiked) {
        const { error } = await (supabase as any)
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
        setHasLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        const { error } = await (supabase as any)
          .from('likes')
          .insert({ post_id: postId, user_id: userId });

        if (error) throw error;
        setHasLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update like",
        variant: "destructive",
      });
    }
  };

  return { hasLiked, likesCount, toggleLike };
}
