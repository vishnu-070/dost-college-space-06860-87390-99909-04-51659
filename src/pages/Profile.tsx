import { Edit, ThumbsUp, ThumbsDown, MessageSquare, Share2, Eye, Plus, Pencil, UserPlus, UserMinus, Mail, MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import { useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { usePosts } from "@/hooks/usePosts";
import { useLikes } from "@/hooks/useLikes";

const Profile = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Determine which profile to view
  const profileUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;
  
  // Fetch profile data
  const { profile, isLoading: profileLoading, completionPercentage } = useProfile(profileUserId);
  
  // Fetch user's posts - usePosts takes boolean (isAuthenticated), not userId
  // We'll filter posts by user_id after fetching
  const { posts: allPosts, loading: postsLoading } = usePosts(!!user);
  
  // Filter posts for this user
  const posts = allPosts?.filter(post => post.user_id === profileUserId);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  // Check if we should open edit modal from notification
  if (searchParams.get('edit') === 'true' && isOwnProfile && !isEditModalOpen) {
    setIsEditModalOpen(true);
  }

  const handleMessage = () => {
    navigate(`/messages?user=${profileUserId}`);
  };

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-6">
            <p className="text-center">Loading profile...</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!profile && !profileLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="p-6">
            <p className="text-center">User not found</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6 mb-6">
          {/* Profile Completion Progress */}
          {isOwnProfile && completionPercentage < 100 && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Profile Completion</p>
                <p className="text-sm font-semibold">{completionPercentage}%</p>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to help others connect with you!
              </p>
            </div>
          )}

          <div className="flex items-start gap-6 mb-6">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-medium">{profile?.username?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleMessage}>
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm mb-2">
                <span><strong>{posts?.length || 0}</strong> posts</span>
                <span><strong>0</strong> followers</span>
                <span><strong>0</strong> following</span>
              </div>
              <p className="text-sm font-medium mb-1">@{profile?.username}</p>
              {profile?.bio && (
                <p className="text-sm text-muted-foreground mb-2">{profile.bio}</p>
              )}
              {profile?.state && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {profile.state}
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
              <TabsTrigger value="disliked">Disliked</TabsTrigger>
              <TabsTrigger value="new">
                New <span className="ml-1">⚙️</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {isOwnProfile && (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  + Create Post
                </Button>
              )}

              {postsLoading ? (
                <Card className="p-6">
                  <p className="text-center text-muted-foreground">Loading posts...</p>
                </Card>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm font-medium">{profile?.username?.[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{profile?.username}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {post.content && <p className="text-sm mb-3">{post.content}</p>}
                    
                    {post.image_url && (
                      <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-3" />
                    )}
                    
                    {post.category && (
                      <div className="mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1" asChild>
                        <Link to={`/post/${post.id}`}>
                          <MessageSquare className="h-4 w-4" />
                          {post.comments_count || 0}
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6">
                  <p className="text-center text-muted-foreground">No posts yet</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      {isOwnProfile && (
        <>
          <EditProfileModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
          <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
        </>
      )}
    </MainLayout>
  );
};

export default Profile;
