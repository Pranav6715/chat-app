import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS("/chat");
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to room");
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-10 bg-gray-900 border-b border-gray-700 py-4 px-8 flex justify-between items-center shadow">
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span className="text-blue-400">{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            User: <span className="text-green-400">{currentUser}</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition duration-200"
        >
          Leave Room
        </button>
      </header>

      {/* Chat Messages */}
      <main
        ref={chatBoxRef}
        className="pt-24 pb-32 px-4 sm:px-10 max-w-3xl mx-auto h-screen overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-3 p-3 max-w-xs sm:max-w-sm rounded-2xl shadow-md ${
                message.sender === currentUser
                  ? "bg-green-700 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <img
                className="h-10 w-10 rounded-full border border-gray-300"
                src="https://avatar.iran.liara.run/public/43"
                alt="avatar"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{message.sender}</p>
                <p className="text-base">{message.content}</p>
                <span className="text-xs text-gray-300 mt-1">
                  {timeAgo(message.timeStamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Message Input */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-2/3 lg:w-1/2">
        <div className="bg-gray-900 border border-gray-700 rounded-full flex items-center px-4 py-2 shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none px-2 text-white placeholder-gray-400"
          />
          <div className="flex gap-2 ml-3">
            <button
              className="h-10 w-10 flex justify-center items-center bg-purple-600 hover:bg-purple-700 rounded-full transition"
              title="Attach"
            >
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="h-10 w-10 flex justify-center items-center bg-green-600 hover:bg-green-700 rounded-full transition"
              title="Send"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
