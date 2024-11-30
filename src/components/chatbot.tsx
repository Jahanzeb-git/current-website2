import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, Copy } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0); // Timer for API key expiration

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
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && apiKey) {
      setApiKey(null); // Clear API key after timer expires
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, apiKey]);

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
      startTypingEffect(data.response || 'Sorry, there was an error.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, something went wrong.']);
    } finally {
      setLoading(false);
    }
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessage = [...prevMessages];
        newMessage[newMessage.length - 1] = `Bot: ${message.slice(0, i + 1)}`;
        return newMessage;
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
      handleSend();
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api', {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(`You already generated an API key at ${data.message}`);
        setApiKey(null);
        return;
      }

      const data = await response.json();
      setApiKey(data.apiKey); // Store the generated API key
      setTimer(60); // Start a 60-second timer
      setError(null); // Clear previous errors
    } catch (error) {
      console.error('Error generating API key:', error);
      setApiKey(null);
      setError('Failed to generate API key.');
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      alert('API Key copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative"
    >
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={() => setShowDocumentation(!showDocumentation)}
      >
        <BookOpen />
      </div>

      {showDocumentation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm p-6 z-10 rounded-xl"
        >
          {/* Documentation Content */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
          <div className="mt-4">
            <button
              onClick={generateApiKey}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 active:bg-emerald-700 transition-all"
            >
              Generate API Key
            </button>

            {apiKey && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 flex items-center text-green-600 dark:text-green-400 space-x-2"
              >
                <span>API Key: {apiKey}</span>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <Copy className="w-4 h-4 text-gray-900 dark:text-white" />
                </button>
              </motion.div>
            )}

            {timer > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Expires in {timer} seconds
              </motion.p>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-red-600 dark:text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-500 transition"
            onClick={() => setShowDocumentation(false)}
          >
            Close Documentation
          </button>
        </motion.div>
      )}

      {/* Chatbot Content */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Chat with my BOT
      </h2>
      {/* Rest of the Chatbot */}
    </motion.div>
  );
};

export default Chatbot;
