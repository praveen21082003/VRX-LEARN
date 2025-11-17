import React, { useState } from "react";
import { Search, Send, Paperclip, Smile, MoveLeft } from "lucide-react";

function Inbox() {
  const Chats = [
    {
      name: "React Group",
      img: "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
      lastMsg: "Let's discuss custom hooks tomorrow.",
    },
    {
      name: "Python Devs",
      img: "https://i.pinimg.com/1200x/ef/97/25/ef972507d073f998e8091814528e86d1.jpg",
      lastMsg: "Check out the new Flask API video!",
    },
    {
      name: "Mainframe Team",
      img: "https://i.pinimg.com/736x/88/ae/fb/88aefb54ee3f3e7191b3df89b5230ad0.jpg",
      lastMsg: "zOS job completed successfully ✅",
    },
  ];

  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [showChat, setShowChat] = useState(false); // 📱 controls which view is visible in mobile

  const handleSend = () => {
    if (message.trim() !== "") {
      setConversation((prev) => [...prev, { text: message, sender: "You" }]);
      setMessage("");
    }
  };

  return (
    <div className="w-full h-full p-5 sm:p-0 flex flex-col">
      <h1 className="pagetitle-heading">Inbox</h1>

      <div className="flex flex-1 rounded-lg dark:border-gray-700 overflow-hidden">
        {/* ---------------- CHAT LIST ---------------- */}
        <div
          className={`w-full sm:w-[40%] md:w-[35%] lg:w-[30%] dark:border-gray-700 p-4 overflow-y-auto transition-all duration-300
          ${showChat ? "hidden sm:block" : "block"}`}
        >
          <div className="relative mb-5">
            <Search className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search chats..."
              className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <h1 className="font-semibold text-2xl mb-3 text-gray-700 dark:text-gray-200">
            Chats
          </h1>

          {Chats.map((chat, i) => (
            <div
              key={i}
              className={`flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer mb-2 transition-all ${
                activeChat?.name === chat.name
                  ? "bg-red-100 dark:bg-indigo-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveChat(chat);
                setShowChat(true); // 📱 go to chat view
              }}
            >
              <img
                src={chat.img}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div className="ml-3">
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {chat.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-[150px]">
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- ACTIVE CHAT WINDOW ---------------- */}
        <div
          className={`flex flex-col flex-1 w-[100%] bg-white dark:bg-gray-800 transition-all duration-300 ${
            showChat ? "block" : "hidden sm:flex"
          }`}
        >
          {activeChat ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-700">
                
                
                <button
                  onClick={() => setShowChat(false)}
                  className="sm:hidden text-gray-600 dark:text-gray-300"
                >
                  <MoveLeft size={22} />
                </button>

                <img
                  src={activeChat.img}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {activeChat.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-2  sm:p-6 overflow-y-auto space-y-4 dark:bg-gray-900">
                {conversation.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
                    No messages yet. Start chatting 👋
                  </p>
                ) : (
                  conversation.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-2 py-2 rounded-2xl ${
                          msg.sender === "You"
                            ? "bg-indigo-500 ml-9 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="flex justify-center items-center gap-2 p-1 border-t border-gray-300 dark:border-gray-700">
                <Smile size={25} className="text-gray-600 dark:text-gray-300" />
                <input
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button>
                  <Paperclip
                    size={22}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
                <button
                  onClick={handleSend}
                  className="p-2 text-center bg-indigo-600 hover:bg-indigo-700 rounded-full text-white"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Select a chat to start messaging 💬
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;
