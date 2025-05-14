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

// プロフィールの型定義
interface Profile {
  age: number;
  gender: string;
  interests: string[];
  favorite_foods: string | null;
  personality: string;
  self_introduction: string;
}

export default function DigitalTwinPage() {
  // クライアントサイドのレンダリングを確認する状態
  const [isMounted, setIsMounted] = useState(false);

  const { address } = useAppKitAccount();
  
  // プロフィールデータ
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

  // プロフィールデータを取得する関数を定義
  const fetchProfile = useCallback(async () => {
    try {
      // APIからデータを取得 (固定値)
      const response = await getUserProfile(address!);
      console.log("取得したプロフィールデータ:", response);
      // APIからprofileオブジェクトを取得
      if (response && response.profile) {
        setProfile(response.profile);
      } else {
        console.error("プロフィールデータが正しい形式ではありません");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("プロフィールの取得に失敗しました:", error);
      setIsLoading(false);
    }
  }, []);

  // コンポーネントがマウントされたことを確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // クライアントサイドでのみデータを取得
  useEffect(() => {
    if (isMounted) {
      fetchProfile();
    }
  }, [isMounted, fetchProfile]);

  // プロフィール編集ダイアログを開く
  const openEditDialog = () => {
    setEditedProfile({ ...profile });
    setIsEditDialogOpen(true);
  };

  // プロフィールを更新
  const updateProfile = async () => {
    if (!editedProfile) return;

    try {
      // APIにデータを送信（現在は実装されていないためコメントアウト）
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ profile: editedProfile }),
      // });

      // 成功したら状態を更新
      setProfile(editedProfile);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
    }
  };

  // 興味・関心の入力を処理
  const handleInterestsChange = (value: string) => {
    if (!editedProfile) return;

    const interestsArray = value
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);
    setEditedProfile({ ...editedProfile, interests: interestsArray });
  };

  // サーバーサイドレンダリングまたはハイドレーション中は何も表示しない
  if (!isMounted) {
    return null;
  }

  // クライアントサイドでのみローディング状態を表示
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
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

      {/* アバター画像（ハッカソン期間中は不要） */}
      <div className="flex justify-center mb-6">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          {/* アバター画像の代わりにプレースホルダー */}
          <span className="text-6xl">👤</span>
        </div>
      </div>

      {/* 趣味アイコン */}
      <div className="flex justify-end gap-2 mb-6">
        {profile.interests && profile.interests.map((interest: string, index: number) => (
          <div key={index} className="w-10 h-10 flex items-center justify-center">
            {interest.toLowerCase().includes("ai") && "🤖"}
            {interest.toLowerCase().includes("blockchain") && "⛓️"}
            {interest.toLowerCase().includes("crypto") && "💰"}
            {interest.toLowerCase().includes("project") && "📊"}
            {!["ai", "blockchain", "crypto", "project"].some(keyword => 
              interest.toLowerCase().includes(keyword)) && "🔍"}
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
      </div>

      {profile.favorite_foods && (
        <Badge variant="outline" className="px-4 py-2 text-sm mb-4 block">
          Favorite food: {profile.favorite_foods}
        </Badge>
      )}

      {/* 性格 */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-2">Personality</h2>
          <p className="text-sm">{profile.personality}</p>
        </CardContent>
      </Card>

      {/* 自己紹介 */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-2">Self Introduction</h2>
          <p className="text-sm">{profile.self_introduction}</p>
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
                <Label htmlFor="interests">興味・関心（カンマ区切り）</Label>
                <Input
                  id="interests"
                  value={editedProfile.interests.join(", ")}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="favorite_foods">好きな食べ物</Label>
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
                <Label htmlFor="personality">性格</Label>
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
                <Label htmlFor="self_introduction">自己紹介</Label>
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
              キャンセル
            </Button>
            <Button onClick={updateProfile}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
