import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false); // State for documentation
  const [isTyping, setIsTyping] = useState<boolean>(false); // Track typing status
  const [apiKey, setApiKey] = useState<string | null>(null); // Store API key
  const [apiKeyTimeout, setApiKeyTimeout] = useState<NodeJS.Timeout | null>(null); // Store timeout reference

  // Retrieve stored messages from sessionStorage when the component mounts
  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Store messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const sanitizedInput = input.trim();

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, `You: ${sanitizedInput}`]);
    setInput('');
    setLoading(true); // Set loading to true while waiting for bot response

    try {
      // Call the chatbot API
      const response = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitizedInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the API');
      }

      const data = await response.json();
      console.log(data); // Log the data to check its structure

      // Start the typing effect for the bot's response
      startTypingEffect(data.response || 'Sorry, there was an error.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [...prevMessages, 'Bot: Sorry, something went wrong.']);
    } finally {
      setLoading(false); // Set loading to false after getting the response
    }
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);

    // Typing effect: Add one character at a time with a delay
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessage = [...prevMessages]; // Create a copy of the messages array
        newMessage[newMessage.length - 1] = `Bot: ${message.slice(0, i + 1)}`; // Update the last message (bot's response)
        return newMessage;
      });
      i += 1;
      if (i === message.length) {
        clearInterval(interval); // Stop once all characters are typed
        setIsTyping(false);
      }
    }, 50); // Delay between each character
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate API key');
      }
      const data = await response.json();
      setApiKey(data.apiKey);

      const timeout = setTimeout(() => {
        setApiKey(null);
        setApiKeyTimeout(null);
      }, 60000);
      setApiKeyTimeout(timeout);
    } catch (error) {
      console.error('Error generating API key:', error);
      setMessages((prevMessages) => [...prevMessages, `Error: ${error.message}`]);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative"
    >
      {/* Documentation Icon */}
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={() => setShowDocumentation(!showDocumentation)}
      >
        <BookOpen />
      </div>

      {/* Documentation Section */}
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
            You can interact with the API using the following steps:
          </p>
          <h4 className="font-bold mt-4">Endpoint:</h4>
          <p className="text-gray-700 dark:text-gray-300">
            <code>https://jahanzebahmed22.pythonanywhere.com/response</code>
          </p>
          <h4 className="font-bold mt-4">Input Structure:</h4>
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-sm">
            {`{
  "user_message": "Your question here"
}`}
          </pre>
          <h4 className="font-bold mt-4">Headers:</h4>
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-sm">
            {`{
  "Authorization": "Bearer YOUR_API_KEY"
}`}
          </pre>
          <button
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full w-full"
            onClick={handleGenerateApiKey}
          >
            Generate API Key
          </button>
          {apiKey && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm"
            >
              <p className="text-green-600 dark:text-green-400">Here is your API key:</p>
              <code className="break-words">{apiKey}</code>
              <p className="text-gray-500 dark:text-gray-400 mt-2">This key will disappear after 60 seconds.</p>
            </motion.div>
          )}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full w-full"
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
          {messages.length > 0 && !isTyping && (
            <div className="text-sm text-gray-900 dark:text-gray-100 italic opacity-70 mt-2">
              Powered by Qwen3.2-32B.
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py
                    )}
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
            placeholder="Type your message here..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Send />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
