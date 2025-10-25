import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const ProfileUpdateNotification = () => {
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || dismissed) return;

    const checkProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url, bio, state')
        .eq('id', user.id)
        .maybeSingle();

      // Show notification if profile is incomplete (< 100%)
      const fields = [
        profile?.username,
        profile?.avatar_url,
        profile?.bio,
        profile?.state,
      ];
      const filledFields = fields.filter(f => f && f.trim() !== '').length;
      const completionPercentage = (filledFields / fields.length) * 100;
      
      setShowNotification(completionPercentage < 100);
    };

    checkProfile();
  }, [user, dismissed]);

  if (!showNotification || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-card border-primary/20 shadow-lg">
        <UserCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold mb-1">Complete Your Profile</p>
            <p className="text-sm text-muted-foreground mb-2">
              Complete your profile to help others connect with you!
            </p>
            <Button asChild size="sm" className="mr-2">
              <Link to="/profile?edit=true">Update Profile</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDismissed(true)}
            >
              Dismiss
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
