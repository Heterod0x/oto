"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { getUserProfile } from "@/lib/api";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

// プロフィールの型定義
interface Profile {
  name: string;
  age: number;
  gender: string;
  location: string;
  favoriteFood: string;
  hobbies: string[];
  description: string;
}

export default function DigitalTwinPage() {
  // プロフィールデータ
  const [profile, setProfile] = useState<Profile>({
    name: "",
    age: 0,
    gender: "",
    location: "",
    favoriteFood: "",
    hobbies: [],
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  // プロフィールデータの取得
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // APIからデータを取得
        const data = await getUserProfile("sampleUserId");
        setProfile(data);

        setIsLoading(false);
      } catch (error) {
        console.error("プロフィールの取得に失敗しました:", error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // プロフィール編集ダイアログを開く
  const openEditDialog = () => {
    setEditedProfile({ ...profile });
    setIsEditDialogOpen(true);
  };

  // プロフィールを更新
  const updateProfile = async () => {
    if (!editedProfile) return;

    try {
      // APIにデータを送信
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editedProfile),
      // });

      // 成功したら状態を更新
      setProfile(editedProfile);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
    }
  };

  // 趣味の入力を処理
  const handleHobbiesChange = (value: string) => {
    if (!editedProfile) return;

    const hobbiesArray = value
      .split(",")
      .map((hobby) => hobby.trim())
      .filter(Boolean);
    setEditedProfile({ ...editedProfile, hobbies: hobbiesArray });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <Button variant="ghost" size="sm" onClick={openEditDialog}>
          <span className="mr-2">Preference</span>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* アバター画像（ハッカソン期間中は不要） */}
      <div className="flex justify-center mb-6">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          {/* アバター画像の代わりにプレースホルダー */}
          <span className="text-6xl">👤</span>
        </div>
      </div>

      {/* 趣味アイコン */}
      <div className="flex justify-end gap-2 mb-6">
        {profile.hobbies.map((hobby, index) => (
          <div key={index} className="w-10 h-10 flex items-center justify-center">
            {hobby === "Music" && "🎵"}
            {hobby === "Gaming" && "🎮"}
            {hobby === "Guitar" && "🎸"}
            {!["Music", "Gaming", "Guitar"].includes(hobby) && "🔍"}
          </div>
        ))}
      </div>

      {/* プロフィール情報 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="px-4 py-2 text-sm">
          {profile.age} yo
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          {profile.gender}
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          {profile.location}
        </Badge>
      </div>

      <Badge variant="outline" className="px-4 py-2 text-sm mb-4 block">
        Favorite food: {profile.favoriteFood}
      </Badge>

      {/* 自己紹介 */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-2">Description</h2>
          <p className="text-sm">{profile.description}</p>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>プロフィールを編集</DialogTitle>
          </DialogHeader>

          {editedProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="age">年齢</Label>
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
                  <Label htmlFor="gender">性別</Label>
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
                <Label htmlFor="location">出身地</Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="favoriteFood">好きな食べ物</Label>
                <Input
                  id="favoriteFood"
                  value={editedProfile.favoriteFood}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      favoriteFood: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hobbies">趣味（カンマ区切り）</Label>
                <Input
                  id="hobbies"
                  value={editedProfile.hobbies.join(", ")}
                  onChange={(e) => handleHobbiesChange(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">自己紹介</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={editedProfile.description}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={updateProfile}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
