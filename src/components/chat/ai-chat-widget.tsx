"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Bot,
  User,
  Mic,
  Paperclip,
  ChevronDown,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  persona?: string;
}

const personas = [
  { name: "Sarah Adeyemi", role: "General Support", avatar: "SA", color: "from-blue-400 to-blue-600" },
  { name: "Kemi Okafor", role: "Sales & Products", avatar: "KO", color: "from-purple-400 to-purple-600" },
  { name: "Tunde Nwachukwu", role: "Technical Support", avatar: "TN", color: "from-green-500 to-green-700" },
  { name: "Fatima Aliyu", role: "Orders & Returns", avatar: "FA", color: "from-orange-400 to-orange-600" },
];

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi there! I'm Sarah from Roshanal Global. How can I help you today? I can assist with product recommendations, order tracking, returns, and more!",
    timestamp: new Date(),
    persona: "Sarah Adeyemi",
  },
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersona] = useState(personas[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! Let me look into it for you.",
        "Great question! Based on your needs, I'd recommend checking our security systems category. Would you like me to show you some options?",
        "I can see your order status right away. Let me pull up the details.",
        "Of course! I can help you with that. Let me walk you through the process.",
        "That's a popular product! We currently have it in stock at our Port Harcourt and Lagos branches.",
      ];

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        persona: currentPersona.name,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-gradient-to-br from-blue to-blue-600 text-white shadow-strong flex items-center justify-center hover:shadow-xl transition-shadow group"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red rounded-full flex items-center justify-center text-[8px] font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed bottom-6 right-6 z-[9998] w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-strong border border-border overflow-hidden flex flex-col ${
              isMinimized ? "h-[60px]" : "h-[520px]"
            } transition-[height] duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-blue-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${currentPersona.color} flex items-center justify-center text-xs font-bold`}>
                  {currentPersona.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{currentPersona.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/60">{currentPersona.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <ChevronDown size={16} className="rotate-180" /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-off-white">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentPersona.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-1`}>
                          {currentPersona.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-blue text-white rounded-tr-sm"
                            : "bg-white border border-border text-text-1 rounded-tl-sm shadow-soft"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentPersona.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-1`}>
                        {currentPersona.avatar}
                      </div>
                      <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-text-4 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-text-4 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-text-4 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-border bg-white flex gap-1.5 overflow-x-auto">
                  {["Track Order", "Product Help", "Returns", "Speak to Agent"].map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setInput(action);
                        setTimeout(sendMessage, 100);
                      }}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-off-white border border-border text-[11px] text-text-3 font-medium hover:bg-blue-50 hover:border-blue hover:text-blue transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border bg-white shrink-0">
                  <div className="flex items-center gap-2 bg-off-white rounded-xl px-3 py-2 border border-border focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/10">
                    <button className="text-text-4 hover:text-text-2 transition-colors">
                      <Paperclip size={16} />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-4 outline-none"
                    />
                    <button className="text-text-4 hover:text-text-2 transition-colors">
                      <Mic size={16} />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
