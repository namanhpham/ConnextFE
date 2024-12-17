import { axiosInstance } from "../axiosInstance";

const getAllFriends = async () => {
  const response = await axiosInstance.get("/friends/friends");
  return response.data;
};

const getReceivedFriendRequests = async () => {
  const response = await axiosInstance.get("/friends/received-friend-requests");
  return response.data;
};

const getSentFriendRequests = async () => {
  const response = await axiosInstance.get("/friends/sent-friend-requests");
  return response.data;
};

const createFriendRequest = async (recipientId: string) => {
  const response = await axiosInstance.post("/friends/new-friend-request", {
    recipientId,
  });
  return response.data;
};

const acceptFriendRequest = async (friendRequestId: number) => {
  const response = await axiosInstance.post("/friends/accept-friend-request", {
    friendRequestId,
  });
  return response.data;
};

const rejectFriendRequest = async (friendRequestId: number) => {
  const response = await axiosInstance.post("/friends/reject-friend-request", {
    friendRequestId,
  });
  return response.data;
};

export {
  getAllFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  createFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
