import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, RefreshCcw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; type: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const sanitizedInput = message.trim();
    setMessages((prevMessages) => [...prevMessages, { text: sanitizedInput, type: 'user' }]);
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
      startTypingEffect(data.response || 'Sorry, there was an error.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, something went wrong.', type: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages[newMessages.length - 1]?.type !== 'bot') {
          newMessages.push({ text: '', type: 'bot' });
        }
        newMessages[newMessages.length - 1].text = message.slice(0, i + 1);
        return newMessages;
      });
      i += 1;
      if (i === message.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  const preOptions = ['Tell me about you.', 'What is your education?', 'Your projects?', 'Who was Adolf Hitler?'];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative"
    >
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={() => navigate('/documentation')}
      >
        <BookOpen />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        What can I help with?
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Ask me anything about Data Science.</p>
      <div className="space-y-4 relative">
        <div className="h-64 overflow-y-auto bg-transparent p-4 rounded-lg">
          {messages.length === 0 && (
            <div className="absolute top-2 left-2 text-sm text-gray-900 dark:text-gray-100 italic opacity-70">
              Powered by Qwen3.2-32B.
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.type === 'user'
                  ? 'text-orange-600 opacity-80'
                  : 'text-gray-800 dark:text-white'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="mb-2 text-gray-800 dark:text-white">
              Bot: <span className="typing-dots">Typing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            onClick={() => handleSend(input)}
          >
            <Send />
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {preOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSend(option)}
              className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
          Bot can make mistakes. Check important info.
        </p>
      </div>
      {messages.length > 0 && messages[messages.length - 1].type === 'bot' && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
          Powered by{' '}
          <RefreshCcw
            className="ml-1 mr-1 cursor-pointer hover:text-gray-800 dark:hover:text-white transition"
            onMouseEnter={() => console.log('Hovering over icon')}
          />
          <div className="relative group">
            <span className="underline cursor-pointer">Qwen 3.2</span>
            <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2 hidden group-hover:block">
              <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                <Check className="w-4 h-4" /> Qwen 3.2
              </div>
              <div className="flex items-center space-x-2 text-gray-800 dark:text-white">
                GPT-4o
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Chatbot;
