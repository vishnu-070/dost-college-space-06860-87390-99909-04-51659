import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Onboarding() {
  const [state, setState] = useState("");
  const [entranceExam, setEntranceExam] = useState<"Competitive Exam" | "Board Exam">("Competitive Exam");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.trim()) {
      toast({
        title: "Error",
        description: "Please enter your state",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          state,
          entrance_exam: entranceExam,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome!",
        description: "Your profile has been set up successfully.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Tell us a bit more about yourself to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter your state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Entrance Exam Type</Label>
              <RadioGroup
                value={entranceExam}
                onValueChange={(value) => setEntranceExam(value as "Competitive Exam" | "Board Exam")}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Competitive Exam" id="competitive" />
                  <Label htmlFor="competitive" className="cursor-pointer">
                    Competitive Exam
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Board Exam" id="board" />
                  <Label htmlFor="board" className="cursor-pointer">
                    Board Exam
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Completing..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
