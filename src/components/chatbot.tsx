import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const sanitizedInput = input.trim();
    
    setMessages((prevMessages) => [...prevMessages, `You: ${sanitizedInput}`]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitizedInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the API');
      }

      const data = await response.json();
      console.log(data);

      setMessages((prevMessages) => [...prevMessages, `Bot: ${data.response || 'Sorry, there was an error.'}`]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, something went wrong.']);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    if (chatEndRef?.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Chat with my BOT
      </h2>
      <div className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Ask me anything about Data Science.
      </div>
      <div className="relative h-80 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 text-gray-800 dark:text-white">
            {msg}
          </div>
        ))}
        {loading && (
          <div className="mb-2 text-gray-800 dark:text-white">Bot: Typing...</div>
        )}
        <div
          className={`text-sm text-2xl text-gray-900 dark:text-gray-100 italic opacity-70 ${
            messages.length === 0 ? 'absolute top-0' : 'relative mt-2'
          }`}
        >
          Powered by Qwen3.2-32B.
        </div>
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center space-x-3 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center mt-2 opacity-70 text-sm text-gray-600 dark:text-gray-300">
        Bot can make mistakes. Check important info.
      </p>
    </motion.div>
  );
};

export default Chatbot;
