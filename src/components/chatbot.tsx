import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, ClipboardCopy } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null); // Track the API key state
  const [error, setError] = useState<string | null>(null); // Track error state for API key generation
  const [apiKeyTimer, setApiKeyTimer] = useState<number | null>(null); // Timer for API key expiration

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
    let timer: NodeJS.Timeout | null = null;
    if (apiKeyTimer && apiKeyTimer > 0) {
      timer = setTimeout(() => {
        setApiKeyTimer(apiKeyTimer - 1);
      }, 1000);
    } else if (apiKeyTimer === 0) {
      setApiKey(null); // Clear API key when timer reaches 0
      setApiKeyTimer(null);
    }
    return () => timer && clearTimeout(timer);
  }, [apiKeyTimer]);

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

  // Function to generate API key
  const generateApiKey = async () => {
    try {
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      setApiKey(data.apiKey); // Store the generated API key
      setApiKeyTimer(60); // Start a 60-second timer
      setError(null); // Clear any previous error
    } catch (error) {
      setApiKey(null); // Clear the API key if generation failed
      setError('API Key already generated or failed to generate.'); // Set the error message
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
          <p className="text-gray-700 dark:text-gray-300">
              This chatbot is powered by an advanced AI model tailored for Data Science-related queries.
              You can ask it any question regarding Data Science and it will respond with detailed answers.
          </p>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
            <li>
              API Endpoint: <code>jahanzebahmed22.pythonanywhere.com/response</code>
            </li>
            <li>
              Expected Request Type: <code>POST</code>
            </li>
            <li>
              API Key in Header: <code>'x-api-key': '879479379749734597'</code>
            </li>
            <li>
              <strong>Expected Request Body:</strong>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
                    {`{
                "prompt": "who are you?",
                "system_prompt": "You are Intelligent",
                "tokens": 500
                }`}
              </pre>
            </li>
            <li>
              <strong>Example Headers:</strong>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
                {`{
                "Content-Type": "application/json",
                "x-api-key": "879479379749734597"
                }`}
              </pre>
            </li>
          </ul>


          <div className="mt-4">
            <motion.button
              onClick={generateApiKey}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-full"
              whileHover={{ scale: 1.0 }}
              whileTap={{ scale: 0.9 }}
            >
              Generate API Key
            </motion.button>

            {apiKey && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400"
              >
                <span>API Key: {apiKey}</span>
                <ClipboardCopy
                  className="w-5 h-5 cursor-pointer"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                />
                <span className="text-sm text-gray-600">({apiKeyTimer}s)</span>
              </motion.div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-red-600 dark:text-red-400"
              >
                Error: {error}
              </motion.p>
            )}
          </div>

          <button
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full"
            onClick={() => setShowDocumentation(false)}
          >
            Close Documentation
          </button>
        </motion.div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Chat with my BOT
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Ask me anything about Data Science.
      </p>
      <div className="space-y-4 relative">
        <div className="h-64 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          {messages.length === 0 && (
            <div className="absolute top-2 left-2 text-sm text-gray-900 dark:text-gray-100 italic opacity-70">
              Powered by Qwen3.2-32B.
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.startsWith('You:')
                  ? 'text-orange-600 opacity-80'
                  : 'text-gray-800 dark:text-white'
              }`}
            >
              {msg}
            </div>
          ))}
          {loading && (
            <div className="mb-2 text-gray-800 dark:text-white">Bot: Typing...</div>
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
            onClick={handleSend}
          >
            <Send />
          </button>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
          Bot can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
};

export default Chatbot;


