/* eslint-disable react/jsx-key */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Row, Col, Avatar, Upload, message, Drawer, Modal, Spin, Select, List, Popconfirm } from "antd";
import { MenuOutlined, SettingOutlined, PictureOutlined, CloseOutlined, EditOutlined, PlusOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useDrawer } from "@/app/context/DrawerContext";
import { initializeSocket, getSocket } from "@/app/utils/socket";
import { friendsApiService, groupChatApiService } from "@/app/api/apiService";
import { uploadToS3 } from "@/app/api/utils/uploadImg";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/app/context/SocketContext";
import TextArea from "antd/es/input/TextArea";

const GroupPage = ({ params }: { params: { id: string }; }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { id } = params;
  const { socket } = React.useContext(SocketContext); // Get socket and onMessage from SocketContext

  const [renamedGroupName, setRenamedGroupName] = useState("");
  const [group, setGroup] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showRenameGroup, setShowRenameGroup] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  // This to add friends to the group
  const [friends, setFriends] = useState<any[]>([]);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<any[]>([]);

  const router = useRouter();
  useEffect(() => {
    const handleGroupChatUpdateName = (data: any) => {
      console.log("Group chat updated:", data);
      setGroup((prevGroup: any) => ({
        ...prevGroup,
        group_name: data.group_name,
      }));
    };

    if(socket) {
      console.log("Socket is available");
      socket.on("onGroupChatUpdateName", handleGroupChatUpdateName);
      socket.on("onSendGroupMessage", (data: any) => {
        console.log("Received group message:", data);
        const senderId = data.groupMessage.sender_id.userId;
        const content = data.groupMessage.content;
        const avatarUrl = data.groupMessage.sender_id.avatarUrl;
        const senderName = data.groupMessage.sender_id.username;
        setChatMessages((prev) => [
          ...prev,
          {
            sender_id: { 
              userId: senderId,
              avatarUrl: avatarUrl,
              userName: senderName,
            },
            content: content,
            media_url: data.groupMessage.media_url,
            media_type: data.groupMessage.media_type,
            message_id: data.groupMessage.message_id,
          },
        ]);
      });
      // socket.on("onGroupChatLeave", handleGroupChatLeave);
    }
    
    return () => {
      socket?.off("onGroupChatUpdateName", handleGroupChatUpdateName);
    };
  }, [socket, id]); 

  const isGroupLeader = () => {
    // find the member with the current user id first
    const member = groupMembers.find((member) => member.user_id.userId === currentUserId);
    // check if the member is the group leader
    return member?.role === "leader";
  }

  const fetchFriends = async () => {
    try {
      const currentUserId = localStorage.getItem("userId");
      const result = await friendsApiService.getAllFriends();
      const friendList = result.map((friend: any) => {
        if (friend.user_id.userId === Number(currentUserId)) {
          return friend.friend_user_id;
        } else {
          return friend.user_id;
        }
      });
      setFriends(friendList);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const data = await groupChatApiService.getGroupMembers(Number(id));
      setGroupMembers(data);
      console.log("Group members: ", data);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    fetchGroupMembers();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId ? Number(userId) : null);
  }, []);

  useEffect(() => {
    setFilteredFriends(friends.filter(
      (friend) => !groupMembers.some((member) => member.user_id.userId === friend.userId)
    ));
  }, [friends, groupMembers]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !loading) {
      previousScrollHeightRef.current = messagesContainerRef.current?.scrollHeight || 0;
      await fetchGroupMessages(page);
      messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight - previousScrollHeightRef.current;
    }
  };

  const fetchGroupMessages = async (pageNumber: number) => {
    setLoading(true);
    try {
      const reqBody = {
        groupChatId: Number(id),
        limit: 30,
        offset: pageNumber, // offset is current page number
      };
      const data = await groupChatApiService.getGroupMessages(reqBody);
      setChatMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setPage(pageNumber + 1);
      console.log("Fetched group messages:", data);
      console.log("hasMore:", hasMore);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const data = await groupChatApiService.getGroupChatDetails(id);
        setGroup(data);
        console.log("group data: ", data);
        console.log("currentUserId: ", currentUserId);
        setRenamedGroupName(data.group_name);
      } catch (error) {
        console.error("Failed to fetch group details:", error);
        message.error("Failed to fetch group details.");
      }
    };

    fetchGroupDetails();
  }, [id]);

  useEffect(() => {
    fetchGroupMessages(1);
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (!group) {
    return <div className="p-8 text-center text-gray-500">Loading group details...</div>;
  }

  const getUser = (sender: string) => {
    return sender === "current" ? { name: "You", avatar: "Y" } : group;
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) {
      message.warning("Please select at least one friend to add.");
      return;
    }
    try {
      await groupChatApiService.addGroupMember({
        groupChat: Number(id),
        members: selectedFriends,
      });
      message.success("Members added successfully!");
      setShowAddMembersModal(false);
      setSelectedFriends([]);
      // Refetch friends and group members
      await fetchFriends();
      await fetchGroupMembers();
    } catch (error) {
      console.error("Failed to add members:", error);
      message.error("Failed to add members.");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && imagePreviews.length === 0 && videoPreviews.length === 0) return;

    setSending(true);

    let mediaUrl = "";
    let mediaType = "text";

    if (mediaFile) {
      try {
        const s3Response = await uploadToS3(mediaFile);
        mediaUrl = s3Response.fileUrl;
        mediaType = s3Response.fileType.startsWith("image") ? "image" : "video";
      } catch (error) {
        console.error("Failed to upload media:", error);
        message.error("Failed to upload media");
        setSending(false);
        return;
      }
    }

    try {
      await groupChatApiService.sendGroupMessage({
        groupId: Number(id),
        content: newMessage,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
      });
      setNewMessage("");
      setImagePreviews([]);
      setVideoPreviews([]);
      setMediaFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      message.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleUpload = (file: any) => {
    if (file.size > 25 * 1024 * 1024) {
      alert("File size should be less than 25MB");
      return false;
    }

    setMediaFile(file);

    if (file.type.startsWith("image/")) {
      setImagePreviews([...imagePreviews, URL.createObjectURL(file)]);
    } else if (file.type.startsWith("video/")) {
      setVideoPreviews([...videoPreviews, URL.createObjectURL(file)]);
    }

    return false;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
  };

  const handleRenameGroup = () => {
    setShowRenameGroup(true);
  };

  const handleRenameGroupOk = async () => {
    console.log("Rename group data: ", renamedGroupName);
    if(renamedGroupName.trim() === "") {
      message.warning("Group name cannot be empty.");
      return;
    } else if (renamedGroupName === group.group_name) {
      message.warning("Group name is the same as the current name.");
      return;
    }
    try {
      const response = await groupChatApiService.renameGroupChat({ groupId: group.group_id, groupName: renamedGroupName });
      console.log("Rename group response: ", response);
      setGroup({ ...group, group_name: renamedGroupName });
      message.success("Group renamed successfully!");
    } catch (error) {
      console.error("Failed to rename group:", error);
      message.error("Failed to rename group.");
    } finally {
      setShowRenameGroup(false);
    }

  };

  const handleRemoveMember = async (groupMemberId: number) => {
    try {
      await groupChatApiService.removeGroupMember({
        groupChatId: Number(id),
        groupMemberId: groupMemberId,
      });
      message.success("Member removed successfully!");
      // Refetch group members
      await fetchGroupMembers();
    } catch (error) {
      console.error("Failed to remove member:", error);
      message.error("Failed to remove member.");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await groupChatApiService.leaveGroupChat({
        groupChatId: Number(id),
      });
      message.success("You have left the group.");
      // Redirect or update UI as needed
      router.push("/users/groups");
    } catch (error) {
      console.error("Failed to leave group:", error);
      message.error("Failed to leave group.");
    }
  };

  const getUserInfo = (message: any) => {
    const isCurrentUser = message.sender_id.userId === currentUserId;
    return {
      isCurrentUser,
      name: isCurrentUser ? "You" : message.sender_id.username,
      avatar: isCurrentUser ? "Y" : message.sender_id.avatarUrl,
    };
  };

  const handleOpenAddMembersModal = async () => {
    await fetchFriends();
    await fetchGroupMembers();
    setShowAddMembersModal(true);
  };

  const handleShowDetailsModal = async () => {
    await fetchFriends();
    await fetchGroupMembers();
    setShowGroupDetails(true);
  }

  return (
    <div className="h-full flex">
      {/* Main Chat Content */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="bg-primary border-b p-4 shadow-md flex justify-between items-center">
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "#19b3a8" }} />}
            className="text-white md:hidden"
            onClick={() => {
              setIsDrawerOpen(true);
              console.log('Open drawer');
              console.log("current drawer state: ", isDrawerOpen);
            }}
          />
          <div className="flex space-x-2">
            <h2 className="text-lg font-bold text-textGray">{group.group_name || "Unnamed Group"}</h2>
            {isGroupLeader() && (
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleRenameGroup()}
              />
            )}
          </div>
          <div className="flex space-x-4 items-center">
            {isGroupLeader() && (
              <Button
                type="text"
                icon={<PlusOutlined />}
                className="text-textGray hover:text-highlight"
                onClick={() => handleOpenAddMembersModal()}
              />
            )}
            <Button
              type="text"
              icon={<SettingOutlined />}
              className="text-textGray hover:text-highlight"
              onClick={() => handleShowDetailsModal()}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-primary space-y-4"
          onScroll={handleScroll}
          ref={messagesContainerRef}
        >
          {chatMessages.map((message) => {
            const { isCurrentUser, name, avatar } = getUserInfo(message);
            return (
              <Row
                key={message.message_id}
                justify={isCurrentUser ? "end" : "start"}
              >
                <Col>
                  <div className={`flex items-start space-x-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                    {!isCurrentUser && <Avatar src={avatar}></Avatar>}
                    <div>
                      {!isCurrentUser && <div className="text-xs text-gray-500 pb-1">{name}</div>}
                      <div
                        className={`font-semibold ${
                          isCurrentUser
                            ? "bg-secondary text-light"
                            : "bg-accent text-textGray"
                        } p-3 rounded-lg max-w-xs break-words`} // Ensure long messages break into new lines
                      >
                        {message.content && <p>{message.content}</p>}
                        {message.media_url && message.media_type == "image" && (
                          <Image src={message.media_url as string} alt="Sent image" width={150} height={150} className="rounded-lg" />
                        )}
                        {message.media_url && message.media_type == "video" && (
                          <video controls className="rounded-lg">
                            <source src={message.media_url as string} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            );
          })}
          <div ref={messagesEndRef} />
          {loading && (
            <div className="flex justify-center p-2">
              <Spin />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-primary p-4 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <TextArea
              placeholder="Type a message..."
              className="flex-1"
              size="large"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              autoSize={{ minRows: 1, maxRows: 6 }} // Expandable textarea
            />
            <Upload
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              <Button type="text" icon={<PictureOutlined />} size="large" />
            </Upload>
            <Button
              type="primary"
              size="large"
              onClick={handleSendMessage}
              disabled={sending}
              loading={sending}
            >
              Send
            </Button>
          </div>
          {imagePreviews.length > 0 && (
            <div className="relative flex space-x-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image src={preview} alt="Preview" width={150} height={150} className="rounded-lg" />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    className="absolute top-0 right-0"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
            </div>
          )}
          {videoPreviews.length > 0 && (
            <div className="relative flex space-x-2">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <video controls width="150" className="rounded-lg">
                    <source src={preview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    className="absolute top-0 right-0"
                    onClick={() => handleRemoveVideo(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Group Rename Modal */}
      <Modal 
        title="Rename Group"
        visible={showRenameGroup}
        onOk={handleRenameGroupOk}
        onCancel={() => setShowRenameGroup(false)}
      >
        <Input 
          placeholder="Enter new group name" 
          value={renamedGroupName}
          onChange={(e) => setRenamedGroupName(e.target.value)}
        />
      </Modal>

      {/* Group Details Drawer */}
      <Drawer
        title={<span className="font-bold text-lg text-primary">Group Details</span>}
        placement="right"
        onClose={() => setShowGroupDetails(false)}
        open={showGroupDetails}
        className="p-0"
      >
        {/* Drawer Content */}
        <div className="flex flex-col h-full">
          {/* Group Name */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{group.group_name}</h2>
          </div>

          {/* Members Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-2 font-semibold text-base border-b border-gray-200 pb-2">
              Members
            </h3>
            <List
              itemLayout="horizontal"
              dataSource={groupMembers}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={member.user_id.avatarUrl}>
                        {!member.user_id.avatarUrl &&
                          member.user_id.username.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <span className="font-medium text-gray-800">
                        {member.user_id.username}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          {/* Leave Group Button */}
          <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLeaveGroup}
              className="!bg-red-500 hover:!bg-red-600 !text-white w-full"
            >
              Leave Group
            </Button>
          </div>
        </div>
      </Drawer>


      {/* Add Members Modal */}
      <Modal
        title="Add Members"
        visible={showAddMembersModal}
        onOk={handleAddMembers}
        onCancel={() => setShowAddMembersModal(false)}
      >
        <List
          itemLayout="horizontal"
          dataSource={filteredFriends}
          renderItem={(friend) => (
            <List.Item
              key={friend.userId}
              actions={[
                <Button
                  type="text"
                  icon={selectedFriends.includes(friend.userId) ? <CloseOutlined /> : <PlusOutlined />}
                  onClick={() => {
                    if (selectedFriends.includes(friend.userId)) {
                      setSelectedFriends(selectedFriends.filter((id) => id !== friend.userId));
                    } else {
                      setSelectedFriends([...selectedFriends, friend.userId]);
                    }
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={friend.avatarUrl}>{!friend.avatarUrl && friend.username.charAt(0)}</Avatar>}
                title={friend.username}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default GroupPage;
