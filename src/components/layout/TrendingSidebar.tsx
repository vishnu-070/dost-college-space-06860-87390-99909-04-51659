import { MessageSquare, Heart } from "lucide-react";

const trendingPosts = [
  {
    id: 1,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 2,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 3,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 4,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 5,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 6,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 7,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
  {
    id: 8,
    user: "Person Name",
    time: "16 Hrs Ago",
    title: "MBBS is very over-rated in India",
    likes: "100,259 Likes",
    comments: "50 Comments",
  },
];

export const TrendingSidebar = () => {
  return (
    <aside className="hidden xl:block w-80 border-l bg-card h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="text-accent">🔥</span> Trending Posts
        </h2>
        <div className="space-y-3">
          {trendingPosts.map((post) => (
            <div key={post.id} className="p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer hover-lift border border-transparent hover:border-primary/20">
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 border border-primary/10">
                  <span className="text-xs font-bold text-primary">PN</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{post.user}</span>
                    <span className="text-muted-foreground">• {post.time}</span>
                  </div>
                  <h3 className="text-sm font-semibold mt-1 line-clamp-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="h-3 w-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
