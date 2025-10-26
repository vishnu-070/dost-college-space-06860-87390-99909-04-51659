import { useState, useEffect } from "react";
import { Edit2, Search, MessageCircle, Send, Paperclip, Loader2, HelpCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useMessages(user?.id);
  const { profile } = useProfile(user?.id);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat && user) {
      sendMessage(selectedChat, message);
      setMessage("");
    }
  };

  // Group messages by conversation
  const conversations = messages.reduce((acc: any[], msg) => {
    const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
    const existingConv = acc.find(c => c.userId === otherUserId);
    
    if (!existingConv) {
      acc.push({
        userId: otherUserId,
        username: msg.sender_id === user?.id ? msg.receiver?.username : msg.sender?.username,
        avatar_url: msg.sender_id === user?.id ? msg.receiver?.avatar_url : msg.sender?.avatar_url,
        lastMessage: msg.content,
        time: msg.created_at,
        unread: !msg.read && msg.receiver_id === user?.id
      });
    }
    return acc;
  }, []);

  // Filter conversations by tab
  const filteredConversations = conversations.filter(conv => {
    if (activeTab === "unread") return conv.unread;
    if (activeTab === "requests") return false; // Placeholder for future implementation
    return true;
  });

  // Get selected conversation messages
  const selectedMessages = messages.filter(msg => 
    (msg.sender_id === selectedChat && msg.receiver_id === user?.id) ||
    (msg.receiver_id === selectedChat && msg.sender_id === user?.id)
  );

  if (loading) {
    return (
      <MainLayout showTrending={false}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showTrending={false}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <div className="w-full md:w-96 flex flex-col border rounded-lg bg-card">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {profile?.username ? `${profile.username}'s Messages` : 'Messages'}
                </h1>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-5 w-5" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="all" className="text-xs">All Messages</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs flex items-center gap-1">
                    Un-Read
                    <HelpCircle className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="text-xs flex items-center gap-1">
                    Requests
                    <HelpCircle className="h-3 w-3" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9 bg-muted/30 border-border" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedChat(conv.userId)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b ${
                      selectedChat === conv.userId ? "bg-muted/50" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-muted text-foreground">
                        {conv.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">
                          {conv.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(conv.time), { addSuffix: false })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col border rounded-lg bg-card">
            {selectedChat ? (
              <>
                <ScrollArea className="flex-1 p-6">
                  {selectedMessages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedMessages.map((msg) => {
                        const isOwn = msg.sender_id === user?.id;
                        return (
                          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                              <p className="text-sm">{msg.content}</p>
                              <span className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} mt-1 block`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-muted/30 border-border"
                    />
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your messages</h2>
                <p className="text-sm text-muted-foreground mb-4">Send a message to start a chat.</p>
                <Button>Send message</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
