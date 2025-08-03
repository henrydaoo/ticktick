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
  userAvatar?: string,
  workspaceName?: string
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

    // Try different channel types in order of preference
    const channelTypes = ["messaging", "try", "livestream"];
    
    for (const channelType of channelTypes) {
      try {
        const channel = client.channel(channelType, channelId, {
          members: [userId],
          created_by_id: userId,
          ...(workspaceName && { name: workspaceName }),
        });

        try {
          await channel.watch();
          console.log(`Workspace channel already exists (type: ${channelType})`);
          return channel;
        } catch (watchError) {
          console.log(`Creating new workspace channel (type: ${channelType})`);
          try {
            await channel.create();
            console.log(`Workspace channel created successfully (type: ${channelType})`);
            return channel;
          } catch (createError) {
            console.log(`Failed to create ${channelType} channel, trying next type...`);
            // Continue to next channel type
          }
        }
      } catch (error) {
        console.log(`Error with ${channelType} channel type:`, error);
        // Continue to next channel type
      }
    }

    // If all channel types fail, return a basic channel for read access
    const fallbackChannel = client.channel("messaging", channelId);
    console.log("All channel types failed, returning fallback channel for read access");
    return fallbackChannel;
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

    // Try different channel types in order of preference
    const channelTypes = ["messaging", "try", "livestream"];
    
    for (const channelType of channelTypes) {
      try {
        const channel = client.channel(channelType, channelId, {
          members: [userId],
          created_by_id: userId,
        });

        try {
          await channel.watch();
          console.log(`Self DM channel already exists (type: ${channelType})`);
          return channel;
        } catch (watchError) {
          console.log(`Creating new self DM channel (type: ${channelType})`);
          try {
            await channel.create();
            console.log(`Self DM channel created successfully (type: ${channelType})`);
            return channel;
          } catch (createError) {
            console.log(`Failed to create ${channelType} self DM channel, trying next type...`);
            // Continue to next channel type
          }
        }
      } catch (error) {
        console.log(`Error with ${channelType} channel type:`, error);
        // Continue to next channel type
      }
    }

    // If all channel types fail, return a basic channel for read access
    const fallbackChannel = client.channel("messaging", channelId);
    console.log("All self DM channel types failed, returning fallback channel for read access");
    return fallbackChannel;
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
  userAvatar?: string,
  workspaceName?: string
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

    // Try different channel types to find existing workspace channel
    const channelTypes = ["messaging", "try", "livestream"];
    
    for (const channelType of channelTypes) {
      try {
        const channel = client.channel(channelType, channelId);

        try {
          await channel.watch();
          // Channel exists, try to join it
          try {
            await channel.addMembers([userId]);
            console.log(`Successfully joined workspace channel (type: ${channelType})`);
            return channel;
          } catch (addError) {
            console.log(`Already a member of ${channelType} channel or can't add member`);
            return channel;
          }
        } catch (watchError) {
          // Channel doesn't exist with this type, try next
          continue;
        }
      } catch (error) {
        console.log(`Error with ${channelType} channel type:`, error);
        continue;
      }
    }

    // If no existing channel found, create a new one
    console.log("Workspace channel not found with any type, creating it first...");
    const newChannel = await createWorkspaceChannel(
      client,
      workspaceId,
      userId,
      userToken,
      userName,
      userAvatar,
      workspaceName
    );

    return newChannel;
  } catch (error) {
    console.error("Error joining workspace channel:", error);
    throw error;
  }
};

export const generateUserToken = (userId: string): string => {
  const client = getChatClient();
  return client.devToken(userId);
};
