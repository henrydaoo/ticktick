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

    console.log(`User ${userName} connected successfully with admin role`);
  } catch (error) {
    console.error("Failed to create/connect user:", error);
    throw error;
  }
};

export const createWorkspaceChannel = async (
  client: StreamChat,
  workspaceId: string,
  userId: string,
  userToken: string,
  userName?: string,
  userAvatar?: string
) => {
  try {
    if (!client.user || client.user.id !== userId) {
      await createOrUpdateUser(
        client,
        userId,
        userName || userId,
        userToken,
        userAvatar
      );
    }

    const channelId = `workspace-${workspaceId}`;

    const channel = client.channel("try", channelId, {
      members: [userId],
      created_by_id: userId,
    });

    try {
      await channel.watch();
      console.log("Workspace channel already exists");
      return channel;
    } catch (error) {
      console.log("Creating new workspace channel");
      try {
        await channel.create();
        console.log("Workspace channel created successfully");
        return channel;
      } catch (createError) {
        console.log(
          "Failed to create channel, but still returning it for read access"
        );
        return channel;
      }
    }
  } catch (error) {
    console.error("Error creating workspace channel:", error);
    throw error;
  }
};

export const createDirectMessageChannel = async (
  client: StreamChat,
  userId: string,
  userToken: string,
  userName?: string,
  userAvatar?: string
) => {
  try {
    if (!client.user || client.user.id !== userId) {
      await createOrUpdateUser(
        client,
        userId,
        userName || userId,
        userToken,
        userAvatar
      );
    }

    const channelId = `dm-self-${userId}`;

    const channel = client.channel("try", channelId, {
      members: [userId],
      created_by_id: userId,
    });

    try {
      await channel.watch();
      console.log("Self DM channel already exists");
      return channel;
    } catch (error) {
      console.log("Creating new self DM channel");
      try {
        await channel.create();
        console.log("Self DM channel created successfully");
        return channel;
      } catch (createError) {
        console.log(
          "Failed to create self DM channel, but still returning it for read access"
        );
        return channel;
      }
    }
  } catch (error) {
    console.error("Error creating direct message channel:", error);
    throw error;
  }
};

export const joinWorkspaceChannel = async (
  client: StreamChat,
  workspaceId: string,
  userId: string,
  userToken: string,
  userName?: string,
  userAvatar?: string
) => {
  try {
    if (!client.user || client.user.id !== userId) {
      await createOrUpdateUser(
        client,
        userId,
        userName || userId,
        userToken,
        userAvatar
      );
    }

    const channelId = `workspace-${workspaceId}`;

    const channel = client.channel("try", channelId);

    try {
      await channel.watch();

      await channel.addMembers([userId]);
      console.log("Successfully joined workspace channel");

      return channel;
    } catch (error) {
      console.log("Workspace channel not found, creating it first...");

      const newChannel = await createWorkspaceChannel(
        client,
        workspaceId,
        userId,
        userToken,
        userName,
        userAvatar
      );

      return newChannel;
    }
  } catch (error) {
    console.error("Error joining workspace channel:", error);
    throw error;
  }
};

export const generateUserToken = (userId: string): string => {
  const client = getChatClient();
  return client.devToken(userId);
};
