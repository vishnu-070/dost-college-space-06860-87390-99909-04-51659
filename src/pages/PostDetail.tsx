import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/usePost";
import { useComments } from "@/hooks/useComments";
import { useLikes } from "@/hooks/useLikes";
import { AuthModalDialog } from "@/components/auth/AuthModalDialog";


const CommentCard = ({ comment }: { comment: any }) => {
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 mb-4 pb-4 border-b last:border-b-0">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/10">
        <span className="text-xs font-bold text-primary">
          {comment.profiles?.username?.substring(0, 2).toUpperCase() || 'AN'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{comment.profiles?.username || 'Anonymous'}</span>
          <span className="text-xs text-muted-foreground">• {timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="flex items-center gap-4 mt-2">
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
            <ThumbsUp className="h-3 w-3" />
            {comment.likes_count}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { post, loading: postLoading } = usePost(id);
  const { comments, loading: commentsLoading, addComment } = useComments(id || '');
  const { hasLiked, likesCount, toggleLike } = useLikes(id || '', user?.id);
  const [newComment, setNewComment] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddComment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (newComment.trim() && user && id) {
      await addComment(newComment, user.id);
      setNewComment("");
    }
  };

  const handleLike = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleLike();
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (postLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <p>Post not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <AuthModalDialog open={showAuthModal} onOpenChange={setShowAuthModal} />
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>

          <Card className="p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/10">
                <span className="text-sm font-bold text-primary">
                  {post.profiles?.username?.substring(0, 2).toUpperCase() || 'AN'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.profiles?.username || 'Anonymous'}</span>
                  <span className="text-sm text-muted-foreground">• {timeAgo(post.created_at)}</span>
                </div>
              </div>
            </div>

            <p className="text-base mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.category && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium mb-4">
                {post.category}
              </span>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:bg-primary/10 transition-all"
                onClick={handleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-primary text-primary' : ''}`} />
                {likesCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {post.comments_count}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Comments ({comments.length})</h3>
            <div className="mb-6">
              <Textarea
                placeholder={user ? "Join the conversation..." : "Please sign in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
                disabled={!user}
              />
              <Button onClick={handleAddComment}>
                {user ? 'Comment' : 'Sign in to Comment'}
              </Button>
            </div>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

export default PostDetail;
