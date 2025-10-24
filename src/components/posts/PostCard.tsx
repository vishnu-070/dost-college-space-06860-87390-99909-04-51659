import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLikes } from "@/hooks/useLikes";
import { useState } from "react";
import { AuthModalDialog } from "@/components/auth/AuthModalDialog";

interface PostCardProps {
  id: string;
  authorId: string;
  author: string;
  avatar?: string;
  location?: string;
  timeAgo: string;
  title: string;
  content?: string;
  category?: string;
  image?: boolean;
  likes: string[];
  dislikes: string[];
  comments: number;
  views: number;
}

export const PostCard = ({
  id,
  authorId,
  author,
  location,
  timeAgo,
  title,
  content,
  category,
  image,
  likes,
  dislikes,
  comments,
  views,
}: PostCardProps) => {
  const { user } = useAuth();
  const { hasLiked, likesCount, toggleLike } = useLikes(id, user?.id);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleLike();
  };

  return (
    <>
      <AuthModalDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      <Card className="p-4 md:p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/10">
          <span className="text-sm font-bold text-primary">
            {author.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{author}</span>
            <span className="text-xs text-muted-foreground">• {timeAgo}</span>
          </div>
          {location && (
            <p className="text-xs text-muted-foreground">{location}</p>
          )}
        </div>
      </div>

      <Link to={`/post/${id}`} className="block space-y-3">
        <h2 className="font-bold text-base md:text-lg hover:text-primary transition-colors leading-tight">
          {title}
        </h2>
        {category && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
            {category}
          </span>
        )}
        {content && (
          <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
        )}
        {image && (
          <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-2 bg-muted rounded" />
              <p className="text-xs">Image Placeholder</p>
            </div>
          </div>
        )}
      </Link>

        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 pt-4 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 hover:bg-primary/10 transition-all"
            onClick={handleLike}
          >
            <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-primary text-primary' : ''}`} />
            <span className="hidden sm:inline">{likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 hover:bg-secondary transition-all"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setShowAuthModal(true);
              }
            }}
            asChild={!!user}
          >
            {user ? (
              <Link to={`/post/${id}`}>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">{comments}</span>
              </Link>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">{comments}</span>
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-secondary transition-all">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </>
  );
};
