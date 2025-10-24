import { Search, MessageSquare, Bell, Plus, User, Moon, Sun, Settings, FileText, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { CreatePostDialog } from "@/components/posts/CreatePostDialog";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="flex h-16 items-center px-4 md:px-6 justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="College Dost" className="h-10 w-10 md:h-12 md:w-12" />
          </Link>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-4 md:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, topics, users..."
                className="pl-10 bg-secondary border-0 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-[#008de4] transition-colors" 
                  asChild
                >
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-[#008de4] transition-colors relative" 
                  asChild
                >
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-accent rounded-full"></span>
                  </Link>
                </Button>

                <Button 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground hidden md:flex"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-secondary rounded-full" 
                    >
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                          {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      Drafts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleDarkMode}>
                      {isDarkMode ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </div>
      </header>

      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </>
  );
};
