"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { getConversations } from "@/lib/api";
import { useAppKitAccount } from "@reown/appkit/react";
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
  const [error, setError] = useState<string | null>(null);

  const { address } = useAppKitAccount();

  // 会話履歴データの取得
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // APIからデータを取得
        const responseData = await getConversations(address!);
        console.log("API response data:", responseData);
        
        // データの構造を確認して適切に処理
        let conversationsArray: Conversation[] = [];
        
        if (Array.isArray(responseData)) {
          // レスポンスが直接配列の場合
          conversationsArray = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // レスポンスがオブジェクトの場合、データが含まれる可能性のあるキーを確認
          if (Array.isArray(responseData.data)) {
            conversationsArray = responseData.data;
          } else if (Array.isArray(responseData.conversations)) {
            conversationsArray = responseData.conversations;
          } else if (Array.isArray(responseData.results)) {
            conversationsArray = responseData.results;
          } else if (Array.isArray(responseData.items)) {
            conversationsArray = responseData.items;
          } else {
            // オブジェクトの場合、値が配列のプロパティを探す
            const arrayProperty = Object.values(responseData).find(value => Array.isArray(value));
            if (arrayProperty) {
              conversationsArray = arrayProperty as Conversation[];
            }
          }
        } else if (typeof responseData === 'string') {
          // 文字列の場合、会話として処理
          conversationsArray = [{
            id: '1',
            title: '会話記録',
            text: responseData,
            tags: [], // 空の配列を設定
            date: new Date().toLocaleDateString()
          }];
        }
        
        setConversations(conversationsArray);
        setIsLoading(false);
      } catch (error) {
        console.error("会話履歴の取得に失敗しました:", error);
        setError("会話履歴の取得に失敗しました");
        setConversations([]);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // 検索フィルター
  const filteredConversations = conversations && Array.isArray(conversations) 
    ? conversations.filter(
        (conv) =>
          (conv.title && conv.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (conv.text && conv.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (Array.isArray(conv.tags) && conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    : [];

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
        {/* タグフィルターは会話履歴がある場合のみ表示 */}
        {conversations.length > 0 && (
          <>
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
          </>
        )}
      </div>

      {/* 会話履歴リスト */}
      <div className="space-y-4 relative">
        {isLoading ? (
          <div className="py-20">
            <LoadingOverlay isLoading={isLoading} text="会話履歴を読み込んでいます" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                const fetchConversations = async () => {
                  try {
                    setIsLoading(true);
                    const data = await getConversations("sampleUserId");
                    setConversations(data || []);
                    setError(null);
                    setIsLoading(false);
                  } catch (error) {
                    console.error("会話履歴の取得に失敗しました:", error);
                    setError("会話履歴の取得に失敗しました");
                    setIsLoading(false);
                  }
                };
                fetchConversations();
              }}
            >
              再試行
            </Button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-2">会話履歴がありません</p>
            <p className="text-sm text-muted-foreground">録音ボタンを押して、会話を記録しましょう</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">検索結果が見つかりませんでした</p>
            <p className="text-sm text-muted-foreground mt-1">検索キーワードを変更してお試しください</p>
          </div>
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
                    {conversation.tags && Array.isArray(conversation.tags) && conversation.tags.map((tag, index) => (
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
              {selectedConversation?.tags && Array.isArray(selectedConversation.tags) && selectedConversation.tags.map((tag, index) => (
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
