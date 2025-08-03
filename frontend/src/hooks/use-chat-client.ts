import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import {
  getChatClient,
  createWorkspaceChannel,
  createDirectMessageChannel,
  generateUserToken,
  createOrUpdateUser,
} from "@/lib/stream-chat";

export const useChatClient = () => {
  const { user, workspace } = useAuthContext();
  const workspaceId = useWorkspaceId();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !workspace || !workspaceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const chatClient = getChatClient();
        const userToken = generateUserToken(user._id);

        await createOrUpdateUser(
          chatClient, 
          user._id, 
          user.name, 
          userToken, 
          user.profilePicture || undefined
        );
        console.log("Connected to Stream Chat successfully");

        setClient(chatClient);

        const isOwner = workspace.owner === user._id;
        if (isOwner) {
          try {
            await createWorkspaceChannel(
              chatClient,
              workspaceId,
              user._id,
              userToken,
              user.name,
              user.profilePicture || undefined,
              workspace.name
            );
            console.log("Workspace channel created/ensured");
          } catch (error) {
            console.log("Workspace channel operation failed:", error);
          }
        }

        try {
          await createDirectMessageChannel(
            chatClient,
            user._id,
            userToken,
            user.name,
            user.profilePicture || undefined
          );
          console.log("Self DM channel created/ensured");
        } catch (error) {
          console.log("Self DM channel operation failed:", error);
        }
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [user?._id, workspace?.owner, workspaceId]);

  return { client, loading, error };
};
