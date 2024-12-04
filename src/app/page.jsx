"use client";

import { useEffect, useState } from "react";

export default function ChatBot() {
  const [input, setInput] = useState(""); // Input is a string
  const [messages, setMessages] = useState([]); // Messages is an empty array initially

  useEffect(() => {
    // Add a greeting message
    const initialMessage = {
      role: "assistant",
      content: "How can I assist you today?",
    };
    setMessages((prev) => [...prev, initialMessage]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Call the OpenAI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      // Add the assistant's response to the chat
      const botMessage = { role: "assistant", content: data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error.message);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="gradient-background flex justify-center flex-col h-[690px] p-5 sm:p-0 sm:h-[780px] md:h-[860px]" >
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-pink-100 to-purple-300 text-white rounded-xl shadow-lg border border-blue-700">
      <h1 className="text-xl text-lg font-bold text-center text-sky-700">
        ChatBot v1.0
      </h1>
      <p className="text-center font-semibold text-gray-800 tracking-wide">
        Hello! I'm a ChatBot. I'm powered by OpenAI API. You can ask me
        anything. Start typing below and see what I can do!
      </p>

      <div className="border border-gray-200 bg-gray-100 rounded-md p-3 h-72 overflow-y-scroll mb-3">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`text-sm ${
              msg.role === "user"
                ? "text-blue-500 font-semibold"
                : "text-gray-600"
            } mb-2`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300 text-cyan-800"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg border border-black shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        >
          Send
        </button>
      </div>
    </div>
    </div>
    
  );
}
