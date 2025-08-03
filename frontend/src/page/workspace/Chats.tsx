import { useState } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "@/components/chat/chat-styles.css";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useChatClient } from "@/hooks/use-chat-client";
import { joinWorkspaceChannel, generateUserToken } from "@/lib/stream-chat";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import CustomChannelPreview from "@/components/chat/custom-channel-preview";
import { ChatInfo } from "@/components/chat/chat-info";

const Chats = () => {
  const { user, workspace } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const { client, loading, error } = useChatClient();
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoinWorkspaceChannel = async () => {
    if (!client || !user || !workspaceId) return;

    try {
      setJoinError(null);
      const userToken = generateUserToken(user._id);
      await joinWorkspaceChannel(
        client,
        workspaceId,
        user._id,
        userToken,
        user.name,
        user.profilePicture || undefined,
        workspace?.name
      );
      console.log("Successfully joined workspace channel");
    } catch (error) {
      console.error("Failed to join workspace channel:", error);
      setJoinError("Failed to join workspace channel. Please try again.");
    }
  };

  const filters = {
    members: { $in: [user?._id || ""] },
  };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 as const };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Unable to connect to chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header với các action buttons */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Chat</h1>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleJoinWorkspaceChannel}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Join Workspace Channel
              </Button>
            </div>
            {joinError && <p className="text-sm text-red-500">{joinError}</p>}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 relative">
        <Chat client={client}>
          <div className="flex h-full">
            {/* Channel List */}
            <div className="w-80 border-r bg-background flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Channels
                </h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChannelList
                  filters={filters}
                  options={options}
                  sort={sort}
                  showChannelSearch
                  Preview={CustomChannelPreview}
                  additionalChannelSearchProps={{
                    searchForChannels: true,
                    searchQueryParams: {
                      channelFilters: {
                        filters: { members: { $in: [user?._id || ""] } },
                      },
                    },
                  }}
                />
              </div>
              <div className="border-t">
                <ChatInfo />
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1">
              <Channel>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default Chats;
