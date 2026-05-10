import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2, Minus } from 'lucide-react';
import { chatService } from '../../services/chatService';

const SUGGESTIONS = [
  "Suggest a trip",
  "Find hotels",
  "Plan 3-day itinerary",
  "Best places near me",
  "Budget travel ideas"
];

export default function AIChatbot({ userName = 'Traveler' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('traveloop_chat_history');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      // First time opening the bot logic is handled when they actually open it.
      // But we can pre-populate the greeting in state so it's ready.
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: `Hi ${userName}! I'm your AI travel assistant. Where would you like to go today? ✨`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [userName]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('traveloop_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call simulated backend API
    const botResponseText = await chatService.sendMessage(textToSend, userName);

    const botMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: botResponseText,
      timestamp: new Date().toISOString()
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const clearChat = () => {
    const initialMsg = [
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Chat cleared! How can I assist you today, ${userName}?`,
        timestamp: new Date().toISOString()
      }
    ];
    setMessages(initialMsg);
    localStorage.setItem('traveloop_chat_history', JSON.stringify(initialMsg));
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.5 }}
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#00B4D8] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all z-[100] ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : ''}`}
      >
        <Sparkles size={24} className="animate-pulse" />
      </motion.button>

      {/* Chat Window Modal / Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95, pointerEvents: 'none' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] z-[100] flex flex-col bg-white sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center relative shadow-sm">
                  <Bot size={20} className="text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#6841EA]"></div>
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-white text-sm leading-tight">Traveloop AI</h3>
                  <p className="text-white/70 text-[10px] uppercase font-semibold tracking-wider">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={clearChat} title="Clear Chat" className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors">
                  <Trash2 size={16} />
                </button>
                <button onClick={toggleChat} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 transition-colors sm:hidden">
                  <Minus size={18} />
                </button>
                <button onClick={toggleChat} className="w-8 h-8 rounded-full hover:bg-white/10 hidden sm:flex items-center justify-center text-white/80 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-gray-200 text-gray-500' : 'bg-[#4F46E5]/10 text-[#4F46E5]'}`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#4F46E5] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                      {/* Using whitespace-pre-wrap to respect newlines in bot responses */}
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-7 h-7 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-gray-100 text-gray-500 rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[44px]">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (only show if not typing and last message is from bot) */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !isTyping && (
              <div className="px-4 pb-2 bg-gray-50/50">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide hide-scroll-bar">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="shrink-0 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 transition-colors shadow-sm whitespace-nowrap"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about travel..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-shadow placeholder-gray-400"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#4F46E5] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 hover:bg-[#4338CA] transition-colors"
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5 mt-0.5" />}
                </button>
              </form>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
