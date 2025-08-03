import { StreamChat } from "stream-chat";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

let chatClient: StreamChat | null = null;

export const getChatClient = () => {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey);
  }
  return chatClient;
};

export const createOrUpdateUser = async (
  client: StreamChat,
  userId: string,
  userName: string,
  userToken: string,
  userAvatar?: string
) => {
  try {
    await client.connectUser(
      {
        id: userId,
        name: userName,
        role: "admin",
        image: userAvatar,
      },
      userToken
    );
  } catch (error) {
    throw error;
  }
};

export const createWorkspaceChannel = async (
  client: StreamChat,
  workspaceId: string,
  userId: string,
  workspaceName?: string
) => {
  const channelId = `workspace-${workspaceId}`;

  const channel = client.channel("messaging", channelId, {
    members: [userId],
    created_by_id: userId,
    ...(workspaceName && { name: workspaceName }),
  });

  try {
    await channel.watch();
    return channel;
  } catch (watchError) {
    try {
      await channel.create();
      return channel;
    } catch (createError) {
      throw createError;
    }
  }
};

export const createDirectMessageChannel = async (
  client: StreamChat,
  userId: string
) => {
  try {
    const channelId = `dm-self-${userId}`;

    const channel = client.channel("messaging", channelId, {
      members: [userId],
      created_by_id: userId,
      ...{ name: "Personal Notes" },
    });

    try {
      await channel.watch();
      return channel;
    } catch (watchError) {
      try {
        await channel.create();
        return channel;
      } catch (createError) {
        throw createError;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const addMemberToWorkspaceChannel = async (
  client: StreamChat,
  workspaceId: string,
  userIdToAdd: string
) => {
  const channelId = `workspace-${workspaceId}`;
  const channel = client.channel("messaging", channelId);

  try {
    await channel.watch();
    const members = Object.keys(channel.state.members || {});
    if (members.includes(userIdToAdd)) {
      return {
        success: true,
        message: "User is already a member of this channel",
      };
    }
    await channel.addMembers([userIdToAdd]);
    return { success: true, message: "User successfully added to the channel" };
  } catch (error) {
    throw new Error(
      `Failed to add user to workspace channel: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const generateUserToken = (userId: string): string => {
  const client = getChatClient();
  return client.devToken(userId);
};
