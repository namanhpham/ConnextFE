"use client";

import React, { useEffect, useState } from "react";
import { Drawer, List, Avatar, Spin, Button, Modal, Select, message } from "antd";
import Link from "next/link";
import { useDrawer } from "@/app/context/DrawerContext";
import { groupChatApiService, friendsApiService } from "@/app/api/apiService"; // Import API services
import { useRouter, usePathname } from "next/navigation"; // Import necessary hooks
import { SocketContext } from "@/app/context/SocketContext";

const { Option } = Select;

const GroupsLayout = ({ children }: { children: React.ReactNode }) => {
  const { socket } = React.useContext(SocketContext); // Get socket and onMessage from SocketContext
  
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await groupChatApiService.getUserGroupChats();
        setGroups(data);

        if (!socket) return;
        const groupIds = data.map((group: { group_id: number }) => {
          console.log("Joining group chat", group.group_id);
          socket.emit("onHandleJoinGroupChat", { groupId: group.group_id }); // Ensure groupId is correctly passed
          return group.group_id;
        });
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
    fetchFriends();
  }, [socket]);

  useEffect(() => {
    // socket listener for group chat
    if (!socket) return;
    socket.on("onGroupLeave", (data: any) => {
      console.log("onGroupLeave", data);
      const currentUserId = Number(localStorage.getItem("userId"));
      if (data.leaveMember.user_id.userId === currentUserId) {
        console.log("leaving group", data.groupChat.group_id);
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.group_id !== data.groupChat.group_id)
        );
      } else {
        console.log("removing member", data.leaveMember.user_id.userId);
        fetchFriends();
      }
    });

    socket.on("onGroupChatUpdateName", (data: any) => {
      console.log("Group chat name updated:", data);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.group_id === data.group_id ? { ...group, group_name: data.group_name } : group
        )
      );
    });

    socket.on("onNewMemberJoinGroup", (data: any) => {
      console.log("New member joined group:", data);
      const avatarUrl = data.created_by.avatarUrl;
      const group_name = data.group_name;
      const group_id = data.group_id;
      setGroups((prevGroups) => [...prevGroups, { group_id, group_name, created_by: { avatarUrl } }]);
      message.success(`${data.created_by.username} has added you to a group chat.`);
      socket.emit("onHandleJoinGroupChat", { groupId: data.group_id });
    });

    return () => {
      socket.off("onGroupLeave");
      socket.off("onGroupChatUpdateName");
    };
  }, [socket]);

  useEffect(() => {
    // Extract selected group ID from the URL
    const pathSegments = pathname.split("/");
    const groupId = pathSegments[pathSegments.length - 1];
    if (groupId) {
      setSelectedGroupId(Number(groupId));
    }
  }, [pathname]);

  const handleCreateGroup = async () => {
    if (selectedFriends.length === 0) {
      message.warning("Please select at least one friend to create a group.");
      return;
    }

    try {
      const data = await groupChatApiService.createNewGroupChat({ members: selectedFriends });
      setGroups((prevGroups) => [...prevGroups, data.groupChat]);
      message.success("Group created successfully!");
      setIsModalVisible(false);
      setSelectedFriends([]);
    } catch (error) {
      console.error("Failed to create group:", error);
      message.error("Failed to create group.");
    }
  };

  const handleGroupClick = (groupId: number) => {
    setSelectedGroupId(groupId);
    router.push(`/users/groups/${groupId}`);
  };

  const renderGroupList = () => (
    <div className="overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
      {groups.map((group) => (
        <div
          key={group.group_id}
          onClick={() => handleGroupClick(group.group_id)}
          className={`flex items-center space-x-2 p-2 cursor-pointer ${
            group.group_id === selectedGroupId ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
        >
          <Avatar src={group.created_by.avatarUrl || undefined}>
            {!group.created_by.avatarUrl && group.created_by.username.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 truncate font-semibold">
                {group.group_name || "Unnamed Group"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 hidden md:block">
        <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
          Create New Group
        </Button>
        {loading ? <Spin /> : renderGroupList()}
      </div>
      {/* Drawer for mobile */}
      <Drawer
        title="Groups"
        placement="left"
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="md:hidden"
      >
        <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
          Create New Group
        </Button>
        {loading ? <Spin /> : renderGroupList()}
      </Drawer>
      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Create Group Modal */}
      <Modal
        title="Create New Group"
        visible={isModalVisible}
        onOk={handleCreateGroup}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select friends to add to the group"
          value={selectedFriends}
          onChange={setSelectedFriends}
        >
          {friends.map((friend) => (
            <Option key={friend.userId} value={friend.userId}>
              {friend.username}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default GroupsLayout;
