import { axiosInstance } from "../axiosInstance";

type SendGroupMessageRequest = {
  groupId: number;
  content: string;
  mediaUrl?: string;
  mediaType: string;
};

// Group Management -----------------------------------------------

const getUserGroupChats = async () => {
  const response = await axiosInstance.get("/group-chats");
  return response.data;
};

const getGroupChatDetails = async (groupId: string) => {
    const response = await axiosInstance.get(`/group-chats/${groupId}`);
    return response.data;
}

const createNewGroupChat = async (data: any) => {
  const response = await axiosInstance.post("/group-chats/new", data);
  return response.data;
};

const renameGroupChat = async (req: { groupId: number; groupName: string }) => {
  const response = await axiosInstance.put(`group-chats/rename-group-chat`, {
    groupId: req.groupId,
    groupName: req.groupName,
  });
  return response.data;
};

// Group Message -----------------------------------------------

const sendGroupMessage = async (messageData: SendGroupMessageRequest) => {
  const response = await axiosInstance.post(
    `/group-messages/send-message`,
    messageData
  );
  return response.data;
};

const getGroupMessages = async (req: {
  groupChatId: number;
  limit: number;
  offset: number;
}) => {
  const response = await axiosInstance.post(`/group-messages/get-messages`, req);
  return response.data;
};

// Group Member -----------------------------------------------
const getGroupMembers = async (groupId: number) => {
  const response = await axiosInstance.get(`/group-members/group/${groupId}`);
  return response.data;
};

const addGroupMember = async (req: {
  groupChat: number;
  members: number[];
}) => {
  const response = await axiosInstance.post(`/group-members/add`, req);
  return response.data;
};

const removeGroupMember = async (req: {
  groupChatId: number;
  groupMemberId: number;
}) => {
  const response = await axiosInstance.post(`/group-members/remove`, req);
  return response.data;
};

const leaveGroupChat = async (req: { groupChatId: number }) => {
  const response = await axiosInstance.post(`/group-members/leave`, {
    groupChatId: req.groupChatId 
  });
  return response.data;
};

export {
  getUserGroupChats,
  createNewGroupChat,
  getGroupChatDetails,
  renameGroupChat,
  sendGroupMessage,
  getGroupMessages,
  getGroupMembers,
  addGroupMember,
  leaveGroupChat,
  removeGroupMember,
}
