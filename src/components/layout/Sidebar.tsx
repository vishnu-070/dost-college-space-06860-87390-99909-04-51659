import { Home, TrendingUp, Compass, Grid, GraduationCap, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home Page", path: "/" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: Grid, label: "All", path: "/all" },
];

const boardExams = [
  { label: "AP Intermediate - 12th", path: "/exam/ap-intermediate" },
];

const undergraduateExams = [
  { label: "AP EAMCET", path: "/exam/ap-eamcet" },
  { label: "TS EAMCET", path: "/exam/ts-eamcet", badge: "N" },
];

const tags = [
  "#Engineering - 12 Lakhs",
  "MBA - 5 Lakhs",
  "CA - 4 Lakhs",
  "MBA - 5 Lakhs",
  "MBA - 5 Lakhs",
  "MBA - 5 Lakhs",
  "MBA - 5 Lakhs",
  "MBA - 5 Lakhs",
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-72 border-r bg-card h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Interested Exams</h3>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Board Exams</p>
            {boardExams.map((exam) => (
              <Link
                key={exam.path}
                to={exam.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary/50 transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {exam.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Undergraduate - Engineering</p>
            {undergraduateExams.map((exam) => (
              <Link
                key={exam.path}
                to={exam.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary/50 transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                {exam.label}
                {exam.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {exam.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          <Button variant="link" className="px-0 text-sm text-primary">
            Add More Entrance Exams
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Tags</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 h-9 text-sm" />
          </div>
          <div className="space-y-1">
            {tags.map((tag, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary/50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">Need 1-1 Dedicated Counseling Expert</h3>
          <p className="text-xs text-muted-foreground">Book Your Call Now</p>
          <Button className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
            Book Now
          </Button>
        </div>
      </div>
    </aside>
  );
};
