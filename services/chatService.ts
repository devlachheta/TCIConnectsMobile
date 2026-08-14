import api from "./api";

export const getMessages = async (
  senderId: number,
  receiverId: number
) => {
  const response = await api.get(
    `/messages/${senderId}/${receiverId}`
  );

  return response.data;
};

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  message: string
) => {
  const response = await api.post("/send-message", {
    sender_id: senderId,
    receiver_id: receiverId,
    message: message,
  });

  return response.data;
};

export const markMessagesRead = async (
  senderId: number,
  receiverId: number
) => {
  const response = await api.put(
    `/messages/read/${senderId}/${receiverId}`
  );

  return response.data;
};

export const getChatUser = async (userId: number) => {
  const response = await api.get(`/user/${userId}`);

  return response.data;
};

export const markChatNotificationsRead = async (
  userId: number
) => {
  const response = await api.put(
    `/notifications/chat/read/${userId}`
  );

  return response.data;
};