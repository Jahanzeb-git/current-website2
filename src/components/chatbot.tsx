import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, Copy } from 'lucide-react'; // Icons
import axios from 'axios'; // For API requests

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // API Key State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyVisible, setApiKeyVisible] = useState<boolean>(false);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

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

      if (!response.ok) throw new Error('Failed to fetch response from the API');

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
    if (e.key === 'Enter') handleSend();
  };

  // Fetch API Key from server
  const generateApiKey = async () => {
    try {
      const response = await axios.get('/.netlify/functions/chatbot', {
        params: { action: 'generate_api' }, // Add action query parameter
      });

      if (response.data && response.data.apiKey) {
        setApiKey(response.data.apiKey);
        setApiKeyVisible(true);

        // Hide API key after 60 seconds
        setTimeout(() => setApiKeyVisible(false), 60000);
      } else {
        console.error('API key not returned from the server.');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  // Copy API Key to Clipboard
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
          <p className="text-gray-700 dark:text-gray-300">
            To interact with the chatbot, you need an API key. Generate your unique key using the "Generate API Key"
            button below. Use the key for authentication when calling our API.
          </p>
          <button
            onClick={generateApiKey}
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full"
          >
            Generate API Key
          </button>
          {apiKeyVisible && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white relative">
              <strong>API Key: </strong>{apiKey}
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white p-2 rounded-lg"
              >
                <Copy />
              </button>
            </div>
          )}
          <h4 className="font-bold mt-4">How to Use:</h4>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>
              Send a POST request to: <code>https://jahanzebahmed22.pythonanywhere.com/app_response</code>
            </li>
            <li>
              Add the API key in the <code>Authorization</code> header for authentication.
            </li>
            <li>
              Rate limits apply:
              <ul className="list-disc pl-6">
                <li>10 requests per minute</li>
                <li>100 requests per day</li>
              </ul>
            </li>
          </ul>
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full"
            onClick={() => setShowDocumentation(false)}
          >
            Close Documentation
          </button>
        </motion.div>
      )}

      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
          placeholder="Type your message..."
          rows={3}
        />
        <button
          onClick={handleSend}
          className={`mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>

      <div className="h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <p key={idx} className="my-2 text-gray-800 dark:text-white">
            {msg}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default Chatbot;
