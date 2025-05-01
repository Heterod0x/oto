"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { getConversations } from "@/lib/api";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

// 会話履歴の型定義
interface Conversation {
  id: string;
  title: string;
  text: string;
  tags: string[];
  date: string;
}

export default function HistoryPage() {
  // 会話履歴データ
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 会話履歴データの取得
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // APIからデータを取得
        const data = await getConversations("sampleUserId")
        setConversations(data);

        setIsLoading(false);
      } catch (error) {
        console.error("会話履歴の取得に失敗しました:", error);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // 検索フィルター
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // 会話詳細を表示
  const openConversationDetail = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="container p-4">
      {/* 検索バー */}
      <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background z-10 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {/* タグフィルター */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Badge variant="outline" className="cursor-pointer">
          Soccer
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Golf
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Work
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Food
        </Badge>
      </div>

      {/* 会話履歴リスト */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-8">読み込み中...</p>
        ) : filteredConversations.length === 0 ? (
          <p className="text-center py-8">会話履歴がありません</p>
        ) : (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openConversationDetail(conversation)}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{conversation.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {conversation.text}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 flex-wrap">
                    {conversation.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {conversation.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 会話詳細モーダル */}
      <Dialog
        open={selectedConversation !== null}
        onOpenChange={(open) => !open && setSelectedConversation(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedConversation?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{selectedConversation?.text}</p>
            <div className="flex flex-wrap gap-1">
              {selectedConversation?.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{selectedConversation?.date}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
