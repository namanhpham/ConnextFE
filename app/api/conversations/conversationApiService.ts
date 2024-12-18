import { axiosInstance } from "../axiosInstance";

type SendMessageRequest = {
  senderId: number | null;
  recipientId: number | null;
  conversationId: number | null;
  content: string;
  mediaUrl?: string;
  mediaType: string;
};


const sendMessage = async (messageData: SendMessageRequest) => {
  try {
    const response = await axiosInstance.post(`/messages/send`, messageData);
    return response.data; // Return the response data for further handling
  } catch (error: any) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};

const getConversations = async (limit: number, page: number) => {
  const response = await axiosInstance.get(
    `/conversations?limit=${limit}&offset=${page}`
  );
  return response.data;
};

const getMessages = async (req: {
  conversationId: number;
  limit: number;
  offset: number;
}) => {
  const response = await axiosInstance.post(`/messages/`, {
    conversationId: req.conversationId,
    limit: req.limit,
    offset: req.offset,
  });
  return response.data;
};

export { getConversations, getMessages, sendMessage };
