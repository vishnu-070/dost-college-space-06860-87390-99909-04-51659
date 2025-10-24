import { Edit, ThumbsUp, ThumbsDown, MessageSquare, Share2, Eye, Plus, Pencil, UserPlus, UserMinus, Mail, MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type Post } from "@/contexts/AuthContext";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const userPosts = [
  {
    id: 1,
    subreddit: "r/tsbie",
    title: "Opinions on Nxtwave institute-Niat Pretend-Chain-8043",
    timeAgo: "1 mo. ago",
    content: "I just gave nxt recently after checking more about them. Saw some clips from the Mumbai Tech Week event, a lot of famous founders attended, Wasn't expecting for something so new to have that kind of reach tbh. I was kind of thinking of it as a backup. But it looks like it has some potential after all. Honestly I don't expect it to be perfect but I feel since it's new, it will provide way more benefits in early years to establish itself, So honestly it's a good call to check them out",
    likes: 1,
    comments: 0,
    views: 91,
  },
  {
    id: 2,
    subreddit: "r/andhra_pradesh",
    title: "Daily per capita protein intake in rural areas, by state Pretend-Chain-8043",
    timeAgo: "1 mo. ago",
    content: "More than what I expected",
    likes: 1,
    comments: 0,
    views: 0,
  },
];

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, getUserById, toggleFollow, togglePostLike, togglePostDislike } = useAuth();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(user);
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (userId && userId !== user?.id) {
      const otherUser = getUserById(userId);
      setProfileUser(otherUser);
    } else {
      setProfileUser(user);
    }
  }, [userId, user, getUserById]);

  const toggleLike = (postId: string) => {
    if (!user || !profileUser) return;
    togglePostLike(postId, profileUser.id);
    const updated = getUserById(profileUser.id);
    if (updated) setProfileUser(updated);
  };

  const toggleDislike = (postId: string) => {
    if (!user || !profileUser) return;
    togglePostDislike(postId, profileUser.id);
    const updated = getUserById(profileUser.id);
    if (updated) setProfileUser(updated);
  };

  const handleFollowToggle = () => {
    if (profileUser && !isOwnProfile) {
      toggleFollow(profileUser.id);
      toast({
        title: user?.following.includes(profileUser.id) ? "Unfollowed" : "Followed",
        description: user?.following.includes(profileUser.id) 
          ? `You unfollowed ${profileUser.username}` 
          : `You are now following ${profileUser.username}`,
      });
    }
  };

  const handleMessage = () => {
    toast({
      title: "Message",
      description: "Messaging feature coming soon!",
    });
  };

  if (!profileUser) {
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
          <div className="flex items-start gap-6 mb-6">
            {profileUser?.profilePicture ? (
              <img src={profileUser.profilePicture} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-medium">{profileUser?.username?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{profileUser?.username || 'User Full Name'}</h1>
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
                    <Button
                      variant={user?.following.includes(profileUser.id) ? "outline" : "default"}
                      size="sm"
                      onClick={handleFollowToggle}
                    >
                      {user?.following.includes(profileUser.id) ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleMessage}>
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm mb-2">
                <span><strong>{profileUser?.posts?.length || 0}</strong> posts</span>
                <span 
                  className="cursor-pointer hover:underline"
                  onClick={() => toast({ title: "Followers", description: `${profileUser?.followers?.length || 0} followers` })}
                >
                  <strong>{profileUser?.followers?.length || 0}</strong> followers
                </span>
                <span 
                  className="cursor-pointer hover:underline"
                  onClick={() => toast({ title: "Following", description: `${profileUser?.following?.length || 0} following` })}
                >
                  <strong>{profileUser?.following?.length || 0}</strong> following
                </span>
              </div>
              <p className="text-sm font-medium mb-1">@{profileUser?.username}</p>
              <p className="text-sm text-muted-foreground mb-1">{profileUser?.email}</p>
            </div>
          </div>

          {/* Experience Section */}
          {isOwnProfile && (
            <div className="bg-card rounded-lg p-4 mb-4 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Experience</h2>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {profileUser?.experience && profileUser.experience.length > 0 ? (
                <div className="space-y-4">
                  {profileUser.experience.map((exp) => (
                    <div key={exp.id} className="flex gap-3">
                      <div className="h-12 w-12 bg-secondary rounded flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm">{exp.company} · {exp.type}</p>
                        <p className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-sm text-muted-foreground">{exp.location}</p>
                        {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                        {exp.skills && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            ❤️ {exp.skills}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No experience added yet</p>
              )}
            </div>
          )}

          {/* Education Section */}
          {isOwnProfile && (
            <div className="bg-card rounded-lg p-4 mb-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Education</h2>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {profileUser?.education && profileUser.education.length > 0 ? (
                <div className="space-y-4">
                  {profileUser.education.map((edu) => (
                    <div key={edu.id} className="flex gap-3">
                      <div className="h-12 w-12 bg-secondary rounded flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{edu.institution}</h3>
                        <p className="text-sm">{edu.degree} - {edu.field}</p>
                        <p className="text-sm text-muted-foreground">{edu.startYear} - {edu.endYear}</p>
                        {edu.skills && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            ❤️ {edu.skills}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No education added yet</p>
              )}
            </div>
          )}

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

              {profileUser?.posts && profileUser.posts.length > 0 ? (
                profileUser.posts.map((post: Post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {post.authorAvatar ? (
                        <img 
                          src={post.authorAvatar} 
                          alt={post.authorName} 
                          className="h-10 w-10 rounded-full object-cover cursor-pointer"
                          onClick={() => navigate(`/profile/${post.authorId}`)}
                        />
                      ) : (
                        <div 
                          className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center cursor-pointer"
                          onClick={() => navigate(`/profile/${post.authorId}`)}
                        >
                          <span className="text-sm font-medium">{post.authorName[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <p 
                          className="font-semibold text-sm cursor-pointer hover:underline"
                          onClick={() => navigate(`/profile/${post.authorId}`)}
                        >
                          {post.authorName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {post.content && <p className="text-sm mb-3">{post.content}</p>}
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {post.images.map((img, i) => (
                          <img key={i} src={img} alt={`Post image ${i + 1}`} className="w-full rounded-lg" />
                        ))}
                      </div>
                    )}
                    
                    {post.videos && post.videos.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {post.videos.map((vid, i) => (
                          <video key={i} src={vid} controls className="w-full rounded-lg" />
                        ))}
                      </div>
                    )}
                    
                    {post.poll && (
                      <div className="border rounded-lg p-3 mb-3">
                        <p className="font-semibold mb-3">{post.poll.question}</p>
                        {post.poll.options.map((option) => (
                          <div key={option.id} className="mb-2">
                            <Button 
                              variant="outline" 
                              className="w-full justify-between"
                              onClick={() => toast({ title: "Poll", description: "Poll voting coming soon!" })}
                            >
                              <span>{option.text}</span>
                              <span className="text-muted-foreground">{option.votes} votes</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {post.location && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {post.location}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => toggleLike(post.id)}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 ${user && post.likes.includes(user.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {post.likes.length}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => toggleDislike(post.id)}
                      >
                        <ThumbsDown className={`h-4 w-4 ${user && post.dislikes.includes(user.id) ? 'fill-foreground' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1" asChild>
                        <Link to={`/post/${post.id}`}>
                          <MessageSquare className="h-4 w-4" />
                          {post.comments.length}
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <span className="ml-auto text-muted-foreground flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views} views
                      </span>
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
