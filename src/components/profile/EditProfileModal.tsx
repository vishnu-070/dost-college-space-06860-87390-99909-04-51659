import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [education, setEducation] = useState(user?.education || []);
  const [experience, setExperience] = useState(user?.experience || []);
  const [editingEdu, setEditingEdu] = useState<any>(null);
  const [editingExp, setEditingExp] = useState<any>(null);

  const handleSave = () => {
    updateProfile({
      username,
      profilePicture,
      education,
      experience,
    });
    toast({ title: 'Profile updated successfully!' });
    onOpenChange(false);
  };

  const addEducation = () => {
    setEditingEdu({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      skills: '',
    });
  };

  const saveEducation = () => {
    if (editingEdu) {
      const existingIndex = education.findIndex((e) => e.id === editingEdu.id);
      if (existingIndex >= 0) {
        const updated = [...education];
        updated[existingIndex] = editingEdu;
        setEducation(updated);
      } else {
        setEducation([...education, editingEdu]);
      }
      setEditingEdu(null);
    }
  };

  const addExperience = () => {
    setEditingExp({
      id: Date.now().toString(),
      company: '',
      title: '',
      type: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: '',
    });
  };

  const saveExperience = () => {
    if (editingExp) {
      const existingIndex = experience.findIndex((e) => e.id === editingExp.id);
      if (existingIndex >= 0) {
        const updated = [...experience];
        updated[existingIndex] = editingExp;
        setExperience(updated);
      } else {
        setExperience([...experience, editingExp]);
      }
      setEditingExp(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="profilePicture">Profile Picture URL</Label>
              <Input
                id="profilePicture"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Experience</h3>
              <Button onClick={addExperience} size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {experience.map((exp) => (
              <div key={exp.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{exp.title}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <Button
                    onClick={() => setEditingExp(exp)}
                    size="sm"
                    variant="ghost"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {editingExp && (
              <div className="p-4 border rounded-lg bg-secondary space-y-3">
                <Input
                  placeholder="Company"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                />
                <Input
                  placeholder="Job Title"
                  value={editingExp.title}
                  onChange={(e) => setEditingExp({ ...editingExp, title: e.target.value })}
                />
                <Input
                  placeholder="Employment Type"
                  value={editingExp.type}
                  onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={editingExp.location}
                  onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Date"
                    value={editingExp.startDate}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                  />
                  <Input
                    placeholder="End Date"
                    value={editingExp.endDate}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                />
                <Input
                  placeholder="Skills (comma separated)"
                  value={editingExp.skills}
                  onChange={(e) => setEditingExp({ ...editingExp, skills: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={saveExperience} size="sm">Save</Button>
                  <Button onClick={() => setEditingExp(null)} size="sm" variant="outline">Cancel</Button>
                </div>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education</h3>
              <Button onClick={addEducation} size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {education.map((edu) => (
              <div key={edu.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.degree} - {edu.field}</p>
                  </div>
                  <Button
                    onClick={() => setEditingEdu(edu)}
                    size="sm"
                    variant="ghost"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {editingEdu && (
              <div className="p-4 border rounded-lg bg-secondary space-y-3">
                <Input
                  placeholder="Institution"
                  value={editingEdu.institution}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                />
                <Input
                  placeholder="Degree"
                  value={editingEdu.degree}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                />
                <Input
                  placeholder="Field of Study"
                  value={editingEdu.field}
                  onChange={(e) => setEditingEdu({ ...editingEdu, field: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Start Year"
                    value={editingEdu.startYear}
                    onChange={(e) => setEditingEdu({ ...editingEdu, startYear: e.target.value })}
                  />
                  <Input
                    placeholder="End Year"
                    value={editingEdu.endYear}
                    onChange={(e) => setEditingEdu({ ...editingEdu, endYear: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Skills (comma separated)"
                  value={editingEdu.skills}
                  onChange={(e) => setEditingEdu({ ...editingEdu, skills: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={saveEducation} size="sm">Save</Button>
                  <Button onClick={() => setEditingEdu(null)} size="sm" variant="outline">Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
