import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Cpu, Settings, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot: React.FC<{ onIntersect: (isVisible: boolean) => void }> = ({ onIntersect }) => {
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<'Qwen 3.2' | 'GPT 4o'>('Qwen 3.2');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => onIntersect(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (chatbotRef.current) {
      observer.observe(chatbotRef.current);
    }

    return () => {
      if (chatbotRef.current) {
        observer.unobserve(chatbotRef.current);
      }
    };
  }, [onIntersect]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const sanitizedInput = message.trim();
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: sanitizedInput }]);
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
        { type: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);
    let i = 0;
    setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: '' }]);
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].text = message.slice(0, i + 1) + '|';
        return newMessages;
      });
      i += 1;
      if (i === message.length) {
        clearInterval(interval);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].text = message;
          return newMessages;
        });
        setIsTyping(false);
      }
    }, 50);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const selectModel = (model: 'Qwen 3.2' | 'GPT 4o') => {
    setSelectedModel(model);
    setIsModelMenuOpen(false);
    setIsSettingsOpen(false);
  };

  return (
    <motion.div
      ref={chatbotRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative"
    >
      {/* Settings Icon */}
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={toggleSettings}
      >
        <Settings />
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="absolute top-14 left-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-64 z-50">
          <button
            onClick={() => navigate('/documentation')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Documentation
          </button>
          <button
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Change Model
          </button>
          {isModelMenuOpen && (
            <div className="pl-4 mt-2">
              <button
                onClick={() => selectModel('Qwen 3.2')}
                className="block w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Qwen 3.2 {selectedModel === 'Qwen 3.2' && <Check />}
              </button>
              <button
                onClick={() => selectModel('GPT 4o')}
                className="block w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                GPT 4o {selectedModel === 'GPT 4o' && <Check />}
              </button>
            </div>
          )}
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            Terms
          </button>
        </div>
      )}

      {/* Chatbot UI */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        What can I help with?
      </h2>
      <div ref={chatContainerRef} className="h-64 overflow-y-auto bg-transparent p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.type === 'user' ? 'text-orange-600' : 'text-gray-800 dark:text-white'}`}
          >
            {msg.text}
            {msg.type === 'bot' && !loading && (
              <div className="text-sm flex items-center space-x-1 mt-2">
                <span className="text-gray-600 dark:text-gray-300">Powered by</span>
                <div className="relative group">
                  <Cpu className="text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer" />
                  <div className="absolute left-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md p-2 w-40 hidden group-hover:block">
                    <div className="flex items-center justify-between text-gray-800 dark:text-white px-2 py-1">
                      <span>Qwen 3.2</span>
                      {selectedModel === 'Qwen 3.2' && <Check />}
                    </div>
                    <div className="flex items-center justify-between text-gray-800 dark:text-white px-2 py-1">
                      <span>GPT-4o</span>
                      {selectedModel === 'GPT 4o' && <Check />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default Chatbot;
