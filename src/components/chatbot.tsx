import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyExpiration, setApiKeyExpiration] = useState<number | null>(null); // Timer for API key expiration

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
    setLoading(true);

    try {
      // Call the chatbot API (app_response endpoint)
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: sanitizedInput,
          system_prompt: "You are Engineer.",
          tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the API');
      }

      const data = await response.json();
      console.log(data);

      // Start the typing effect for the bot's response
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
    }, 50); // Delay between each character
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/generate_api', {
        method: 'GET', // Assuming it's a GET request based on the description
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      setApiKey(data["One Time API key"]);
      setApiKeyExpiration(Date.now() + 60000); // API key expires in 60 seconds
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  // Timer to remove API key after 60 seconds
  useEffect(() => {
    if (apiKeyExpiration && Date.now() > apiKeyExpiration) {
      setApiKey(null); // Remove the API key after the expiration time
    }
  }, [apiKeyExpiration]);

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
            You can ask it any question regarding Data Science and it will respond with detailed answers.
            <br />
            <br />
            The chatbot is hosted via a secure API service designed specifically for this purpose.
            You interact with the chatbot by sending your questions to our custom API endpoint, which processes
            the request and provides you with an answer.
          </p>
          <h4 className="font-bold mt-4">How to Use:</h4>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Send a message to the API at <code>https://jahanzebahmed22.pythonanywhere.com/app_response</code> with a key "prompt" and "system_prompt".</li>
            <li>For the /response endpoint, you need to pass an API key in the header. Use the button below to generate your API key.</li>
          </ul>

          {/* API Key Generation Button */}
          <button
            onClick={generateApiKey}
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full"
          >
            Generate API Key
          </button>

          {apiKey && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="font-bold">Your API Key:</p>
              <p className="text-sm">{apiKey}</p>
              <p className="text-xs text-red-500">This API key is valid for 60 seconds.</p>
            </div>
          )}

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
          {messages.length > 0 && !isTyping && (
            <div className="text-sm text-gray-900 dark:text-gray-100 italic opacity-70 mt-2">
              Powered by Qwen3.2-32B.
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message"
            className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-emerald-600 text-white p-2 rounded-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
