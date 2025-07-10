import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined room successfully!");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room Created Successfully!");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error("Room already exists!");
        } else {
          toast("Error in creating room");
        }
        console.log(error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 to-gray-800 flex items-center justify-center px-4">
      <div className="p-8 md:p-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 w-full max-w-md rounded-2xl shadow-xl space-y-6">
        <div className="text-center">
          <img src={chatIcon} alt="Chat Icon" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Join or Create a Chat Room</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your name and room ID to get started</p>
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="userName"
            name="userName"
            placeholder="Enter your name"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Room ID
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="roomId"
            placeholder="Enter Room ID or create new"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between gap-4 pt-2">
          <button
            onClick={joinChat}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition duration-200"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
