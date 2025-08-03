import API from "../axios-client";

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/members/workspace/${iniviteCode}/join`);
  return response.data;
};
