import { usePrivy } from "@privy-io/react-auth";
import { Clock, Play, Trash2 } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { Button } from "../components/ui/button";
import {
  deleteConversation,
  getConversationDetail,
  getConversations,
} from "../lib/oto-api";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived';
  last_transcript_preview?: string;
  transcript?: string;
  duration?: number;
}

/**
 * Daily Conversation History Screen
 */
export default function HistoryPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Get wallet address as user ID
  const getUserId = () => {
    const walletAddress = user?.wallet?.address;
    const userId = user?.id;
    console.log("User ID (wallet address):", walletAddress || userId);
    return walletAddress || userId || "";
    // return "test-user-123";
  };

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Fetch conversation history (without useCallback)
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
      const userId = getUserId();
      
      if (!apiEndpoint) {
        console.error("API endpoint not configured");
        alert("API endpoint not configured. Please check environment variables.");
        setLoading(false);
        return;
      }
      
      if (!apiKey) {
        console.error("API key not configured");
        alert("API key not configured. Please check environment variables.");
        setLoading(false);
        return;
      }
      
      if (!userId) {
        console.error("User wallet address not available");
        alert("User wallet address not available. Please ensure you're logged in with Privy.");
        setLoading(false);
        return;
      }
      
      const conversations = await getConversations(userId, apiKey, apiEndpoint);
      setConversations(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      alert("Failed to fetch conversations. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversation details (without useCallback)
  const fetchConversationDetail = async (conversationId: string) => {
    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
      const userId = getUserId();
      
      if (!userId) {
        console.error("User wallet address not available");
        return;
      }
      
      const conversation = await getConversationDetail(conversationId, userId, apiKey, apiEndpoint);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    } catch (error) {
      console.error("Error fetching conversation detail:", error);
    }
  };

  // Delete conversation (without useCallback)
  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
      const userId = getUserId();
      
      if (!userId) {
        console.error("User wallet address not available");
        return;
      }
      
      const success = await deleteConversation(conversationId, userId, apiKey, apiEndpoint);
      
      if (success) {
        // Remove from conversation list
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
        }
      } else {
        alert("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    }
  };

  // Date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Duration formatting
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (authenticated && getUserId()) {
      fetchConversations();
    }
  }, [authenticated]); // fetchConversationsを依存配列から削除

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Conversation History · VAPI</title>
        <meta name="description" content="View past daily conversation history" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Conversation History
            </h1>



            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversation List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Conversations ({conversations.length} items)
                  </h2>
                  
                  {conversations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No conversations yet</p>
                      <Button
                        onClick={() => router.push("/record")}
                        className="px-6 py-2"
                      >
                        Start Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedConversation?.id === conversation.id
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => fetchConversationDetail(conversation.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {conversation.title}
                              </h3>
                              {conversation.last_transcript_preview && (
                                <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                                  {conversation.last_transcript_preview}
                                </p>
                              )}
                              <div className="flex items-center text-sm text-gray-500 space-x-3">
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  {formatDate(conversation.created_at)}
                                </div>
                                {conversation.duration && (
                                  <div className="flex items-center">
                                    <Play size={14} className="mr-1" />
                                    {formatDuration(conversation.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conversation.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conversation Details */}
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Conversation Details
                  </h2>
                  
                  {!selectedConversation ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Select a conversation to view details
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {selectedConversation.title}
                        </h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Created: {formatDate(selectedConversation.created_at)}</p>
                          <p>Updated: {formatDate(selectedConversation.updated_at)}</p>
                          {selectedConversation.duration && (
                            <p>Duration: {formatDuration(selectedConversation.duration)}</p>
                          )}
                        </div>
                      </div>

                      {selectedConversation.transcript && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {selectedConversation.transcript}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => router.push("/record")}
                          className="w-full"
                        >
                          Start New Recording
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <FooterNavigation />
      </div>
    </>
  );
}
