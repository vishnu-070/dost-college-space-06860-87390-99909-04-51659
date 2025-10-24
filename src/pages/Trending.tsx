import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";

const Trending = () => {
  const { posts, loading } = usePosts();

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Sort by trending (likes + comments)
  const trendingPosts = [...posts].sort((a, b) => 
    (b.likes_count + b.comments_count * 2) - (a.likes_count + a.comments_count * 2)
  ).slice(0, 10);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Trending Posts</h1>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <PostCard 
              key={post.id}
              id={post.id}
              authorId={post.user_id}
              author={post.profiles?.username || 'Anonymous'}
              timeAgo={getTimeAgo(post.created_at)}
              title={post.content.substring(0, 100)}
              content={post.content}
              image={!!post.image_url}
              likes={[]}
              dislikes={[]}
              comments={post.comments_count}
              views={0}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Trending;
