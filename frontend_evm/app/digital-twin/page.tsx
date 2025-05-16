"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile } from "@/lib/api";
import { useAppKitAccount } from "@reown/appkit/react";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
// Import useCallback for memoized functions
import { useCallback } from "react";

// Profile type definition
interface Profile {
  age: number;
  gender: string;
  interests: string[];
  favorite_foods: string | null;
  personality: string;
  self_introduction: string;
}

export default function DigitalTwinPage() {
  // State to verify client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  // Profile data
  const [profile, setProfile] = useState<Profile>({
    age: 0,
    gender: "",
    interests: [],
    favorite_foods: null,
    personality: "",
    self_introduction: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  const { address } = useAppKitAccount();

  // Define function to fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      // Fetch data from API (fixed values)
      const response = await getUserProfile(address!);
      console.log("Retrieved profile data:", response);
      // Get profile object from API
      if (response && response.profile) {
        setProfile(response.profile);
      } else {
        console.error("Profile data is not in the correct format");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to retrieve profile:", error);
      setIsLoading(false);
    }
  }, []);

  // Confirm component has been mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data only on the client side
  useEffect(() => {
    if (isMounted) {
      fetchProfile();
    }
  }, [isMounted, fetchProfile]);

  // Open profile edit dialog
  const openEditDialog = () => {
    setEditedProfile({ ...profile });
    setIsEditDialogOpen(true);
  };

  // Update profile
  const updateProfile = async () => {
    if (!editedProfile) return;

    try {
      // Send data to API (currently commented out as not implemented)
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ profile: editedProfile }),
      // });

      // Update state after success
      setProfile(editedProfile);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Process interests input
  const handleInterestsChange = (value: string) => {
    if (!editedProfile) return;

    const interestsArray = value
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);
    setEditedProfile({ ...editedProfile, interests: interestsArray });
  };

  // Don't display anything during server-side rendering or hydration
  if (!isMounted) {
    return null;
  }

  // Show loading state only on the client side
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">Digital Twin</h1>
        <Button variant="ghost" size="sm" onClick={openEditDialog}>
          <span className="mr-2">Preference</span>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Avatar image (not needed during hackathon period) */}
      <div className="flex justify-center mb-6">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          {/* Placeholder instead of avatar image */}
          <span className="text-6xl">👤</span>
        </div>
      </div>

      {/* Hobby icons */}
      <div className="flex justify-end gap-2 mb-6">
        {profile.interests &&
          profile.interests.map((interest: string, index: number) => (
            <div key={index} className="w-10 h-10 flex items-center justify-center">
              {interest.toLowerCase().includes("ai") && "🤖"}
              {interest.toLowerCase().includes("blockchain") && "⛓️"}
              {interest.toLowerCase().includes("crypto") && "💰"}
              {interest.toLowerCase().includes("project") && "📊"}
              {!["ai", "blockchain", "crypto", "project"].some((keyword) =>
                interest.toLowerCase().includes(keyword),
              ) && "🔍"}
            </div>
          ))}
      </div>

      {/* Profile information */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="px-4 py-2 text-sm">
          {profile.age} yo
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          {profile.gender}
        </Badge>
      </div>

      {profile.favorite_foods && (
        <Badge variant="outline" className="px-4 py-2 text-sm mb-4 block">
          Favorite food: {profile.favorite_foods}
        </Badge>
      )}

      {/* Personality */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-2">Personality</h2>
          <p className="text-sm">{profile.personality}</p>
        </CardContent>
      </Card>

      {/* Self introduction */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-2">Self Introduction</h2>
          <p className="text-sm">{profile.self_introduction}</p>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          {editedProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={editedProfile.age}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        age: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={editedProfile.gender}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        gender: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input
                  id="interests"
                  value={editedProfile.interests.join(", ")}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="favorite_foods">Favorite Foods</Label>
                <Input
                  id="favorite_foods"
                  value={editedProfile.favorite_foods || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      favorite_foods: e.target.value || null,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personality">Personality</Label>
                <Textarea
                  id="personality"
                  rows={3}
                  value={editedProfile.personality}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      personality: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="self_introduction">Self Introduction</Label>
                <Textarea
                  id="self_introduction"
                  rows={5}
                  value={editedProfile.self_introduction}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      self_introduction: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
