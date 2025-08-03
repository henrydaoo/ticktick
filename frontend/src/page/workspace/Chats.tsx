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
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useChatClient } from "@/hooks/use-chat-client";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { useIsMobile } from "@/hooks/use-mobile";
import { addMemberToWorkspaceChannel } from "@/lib/stream-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, UserPlus, ArrowLeft } from "lucide-react";
import CustomChannelPreview from "@/components/chat/custom-channel-preview";

const Chats = () => {
  const { user, workspace } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const { client, loading, error } = useChatClient();
  const { data: membersData } = useGetWorkspaceMembers(workspaceId);
  const isMobile = useIsMobile();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  const isOwner = workspace?.owner === user?._id;
  const members = membersData?.members || [];

  const filteredMembers =
    searchQuery.length > 0
      ? members
          .filter(
            (member) =>
              member.userId._id !== user?._id &&
              member.userId.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSelectUser = (member: any) => {
    setSelectedUser({ id: member.userId._id, name: member.userId.name });
    setSearchQuery(member.userId.name);
    setShowUserList(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === "") {
      setSelectedUser(null);
    }
  };

  const handleInviteMember = async () => {
    if (!client || !user || !workspaceId || !selectedUser) return;

    try {
      setIsInviting(true);
      setInviteMessage("");

      const userIdToAdd = selectedUser.id;

      const result = await addMemberToWorkspaceChannel(
        client,
        workspaceId,
        userIdToAdd
      );

      setInviteMessage(result.message);
      setSearchQuery("");
      setSelectedUser(null);
      setShowUserList(false);
      setRefreshKey((prev) => prev + 1);

      setTimeout(() => setInviteMessage(""), 3000);
    } catch (error) {
      setInviteMessage(
        `Failed to invite member: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsInviting(false);
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
      <div className="flex-1 relative">
        <Chat client={client}>
          <div className="flex h-full">
            <div
              className={`${
                isMobile && selectedChannel ? "hidden" : "block"
              } w-full md:w-80 border-r bg-background flex flex-col relative`}
            >
              <div className="p-2 border-b border-r space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Chats
                  </h2>
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUserList(!showUserList)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {isMobile ? "" : "Invite"}
                    </Button>
                  )}
                </div>

                {isOwner && showUserList && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        placeholder="Search users to invite..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full"
                        disabled={isInviting}
                      />

                      {filteredMembers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-10 mt-1 max-h-40 overflow-y-auto">
                          {filteredMembers.map((member: any) => (
                            <div
                              key={member.userId._id}
                              onClick={() => handleSelectUser(member)}
                              className="p-2 hover:bg-accent cursor-pointer text-sm"
                            >
                              {member.userId.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {searchQuery.length > 0 &&
                        filteredMembers.length === 0 && (
                          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-10 mt-1 p-2">
                            <div className="text-sm text-muted-foreground">
                              No users found
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleInviteMember}
                        disabled={isInviting || !selectedUser}
                        size="sm"
                        className="flex-1"
                      >
                        {isInviting ? "Inviting..." : "Invite Member"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowUserList(false);
                          setSearchQuery("");
                          setSelectedUser(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>

                    {inviteMessage && (
                      <p
                        className={`text-xs ${
                          inviteMessage.includes("Failed")
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {inviteMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <ChannelList
                  key={refreshKey}
                  filters={filters}
                  options={options}
                  sort={sort}
                  showChannelSearch
                  Preview={(props) => (
                    <div onClick={() => setSelectedChannel(props.channel)}>
                      <CustomChannelPreview {...props} />
                    </div>
                  )}
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
            </div>

            <div
              className={`${
                isMobile && !selectedChannel ? "hidden" : "flex-1"
              } relative`}
            >
              {!selectedChannel && !isMobile ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Welcome to Chat
                    </h3>
                    <p className="text-muted-foreground">
                      Select a channel to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <Channel>
                  <Window>
                    {isMobile && selectedChannel && (
                      <div className="flex items-center p-3 border-b bg-background">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedChannel(null)}
                          className="mr-3"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <ChannelHeader />
                        </div>
                      </div>
                    )}
                    {!isMobile && <ChannelHeader />}
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              )}
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default Chats;
