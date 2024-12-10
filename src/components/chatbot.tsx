import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, BookOpen, Check, Cpu, Cog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot: React.FC<{ onIntersect: (isVisible: boolean) => void }> = ({ onIntersect }) => {
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen 3.2');
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

  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
    setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: '' }]); // Prepare space for bot message
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
          newMessages[newMessages.length - 1].text = message; // Remove cursor at the end
          return newMessages;
        });
        setIsTyping(false);
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setIsSettingsOpen(false);
  };

  const preOptions = [
    'Tell me about you.',
    'What is your education?',
    'Your projects?',
    'Who was Adolf Hitler?',
  ];

  return (
    <motion.div
      ref={chatbotRef}
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
      <div
        className="absolute top-4 right-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={toggleSettings}
      >
        <Cog />
      </div>
      {isSettingsOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md p-4 w-64 z-50">
          <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Settings</h4>
          <div>
            <h5 className="font-medium text-gray-600 dark:text-gray-300 mb-2">Select Model:</h5>
            {['Qwen 3.2', 'GPT-4o'].map((model) => (
              <div
                key={model}
                onClick={() => selectModel(model)}
                className="cursor-pointer flex items-center justify-between text-gray-800 dark:text-white px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
              >
                <span>{model}</span>
                {selectedModel === model && <Check className="w-4 h-4 text-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        What can I help with?
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Ask me anything about Data Science.
      </p>
      <div className="space-y-4 relative">
        <div
          ref={chatContainerRef}
          className="h-64 overflow-y-auto bg-transparent p-4 rounded-lg"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.type === 'user' ? 'text-orange-600' : 'text-gray-800 dark:text-white'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="mb-2 text-gray-800 dark:text-white">Bot: Typing... |</div>}
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
            className="p-3 rounded-full flex items-center justify-center 
            bg-black dark:bg-white hover:opacity-50 active:opacity-100"
            onClick={() => handleSend(input)}
          >
            <ArrowUp className="w-5 h-5 text-white dark:text-black" />
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
    </motion.div>
  );
};

export default Chatbot;

