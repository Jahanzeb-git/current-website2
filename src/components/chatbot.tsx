import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen, ClipboardCopy } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null); // Store API Key
  const [email, setEmail] = useState<string>(''); // Store Email
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false); // Show email input
  const [error, setError] = useState<string | null>(null); // Error state
  const [apiKeyTimer, setApiKeyTimer] = useState<number | null>(null); // Timer for API key expiration

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

  const handleGenerateApiKey = async () => {
    // Validate email input
    if (!email) {
      setError('Please enter a valid email.');
      return;
    }
    setShowEmailInput(false); // Hide email input after submit
    setLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, `Bot: A verification email has been sent to ${email}. Please check your inbox.`]);
      pollForApiKeyVerification(); // Start polling for the API key
    } catch (error) {
      setError('Error generating API key. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Poll the /return_api endpoint to check API key verification status
  const pollForApiKeyVerification = async () => {
    const interval = setInterval(async () => {
      const response = await fetch('/.netlify/functions/chatbot?action=return_api', {
        method: 'GET',
      });

      if (response.status === 200 || response.status === 403) {
        clearInterval(interval); // Stop polling
        const data = await response.json();
        if (data.apiKey) {
          setApiKey(data.apiKey); // Show the API key to the user
          setApiKeyTimer(60); // Start the 60s timer
        } else {
          setError('API Key generation failed. Please try again.');
        }
      }
    }, 5000); // Poll every 5 seconds
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
          </p>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
            <li>API Endpoint: <code>jahanzebahmed22.pythonanywhere.com/response</code></li>
            <li>Expected Request Type: <code>POST</code></li>
            <li>API Key in Header: <code>'x-api-key': '879479379749734597'</code></li>
            <li><strong>Expected Request Body:</strong></li>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
              {{
                "prompt": "who are you?",
                "system_prompt": "You are Intelligent",
                "tokens": 500
              }}
            </pre>
          </ul>

          <div className="mt-4">
            <motion.button
              onClick={() => setShowEmailInput(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-full"
              whileHover={{ scale: 1.0 }}
              whileTap={{ scale: 0.9 }}
            >
              Generate API Key
            </motion.button>

            {showEmailInput && (
              <div className="mt-4 flex flex-col">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
                />
                <motion.button
                  onClick={handleGenerateApiKey}
                  className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.0 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Continue
                </motion.button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
        {messages.map((message, index) => (
          <div key={index} className="text-lg text-gray-700 dark:text-white">
            {message}
          </div>
        ))}
        {loading && <div className="text-lg text-gray-700 dark:text-white">Bot is typing...</div>}
      </div>

      {apiKey && (
        <div className="bg-gray-200 dark:bg-gray-600 p-4 rounded-lg mb-6 text-center">
          <h3 className="text-xl text-gray-800 dark:text-white">Your API Key</h3>
          <p className="mt-2">{apiKey}</p>
          <p className="mt-2">Expires in: {apiKeyTimer}s</p>
          <motion.button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-full mt-2"
          >
            <ClipboardCopy /> Copy API Key
          </motion.button>
        </div>
      )}

      {!apiKey && !showEmailInput && (
        <div className="mt-4">
          <motion.button
            onClick={() => setShowDocumentation(true)}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            <BookOpen /> Documentation
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default Chatbot;
