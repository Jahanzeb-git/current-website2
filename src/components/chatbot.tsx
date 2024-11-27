import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false); // State for documentation
  const [isTyping, setIsTyping] = useState<boolean>(false); // Track typing status
  const [apiKey, setApiKey] = useState<string | null>(null); // Store the API key
  const [apiKeyExpiration, setApiKeyExpiration] = useState<number | null>(null); // Store expiration time for the API key

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

  // Function to handle API key generation
  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/generate_api', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      const { "One Time API key": generatedKey, "Generation Time": generationTime } = data;

      // Set the API key and set expiration time to 1 minute from now
      setApiKey(generatedKey);
      setApiKeyExpiration(Date.now() + 60000); // 1 minute = 60000 milliseconds

      // Store the API key for 1 minute
      setTimeout(() => {
        setApiKey(null); // Clear API key after 1 minute
      }, 60000);

      alert(`API Key Generated! \nKey: ${generatedKey}\nGenerated at: ${generationTime}`);
    } catch (error) {
      console.error('Error generating API key:', error);
      alert('Failed to generate API key');
    }
  };

  // Function to handle sending messages to the bot
  const handleSend = async () => {
    if (!input.trim()) return;

    const sanitizedInput = input.trim();

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, `You: ${sanitizedInput}`]);
    setInput('');
    setLoading(true); // Set loading to true while waiting for bot response

    try {
      if (!apiKey) {
        alert('Please generate an API key first!');
        setLoading(false);
        return;
      }

      // Call the /response API
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({ prompt: sanitizedInput, system_prompt: 'Answer as a chatbot' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the API');
      }

      const data = await response.json();
      console.log(data); // Log the data to check its structure

      // Start the typing effect for the bot's response
      startTypingEffect(data.output || 'Sorry, there was an error.');
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
            <li>Send a message to the API at <code>https://yourdomain.com/ask</code> with a key "user_message".</li>
            <li>Receive a response from the bot with a key "response".</li>
            <li>Example request body: <code>{"{ 'user_message': 'What is Data Science?' }"}</code></li>
          </ul>
          <button
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full"
            onClick={handleGenerateApiKey}
          >
            Generate API Key
          </button>
          {apiKey && (
            <div className="mt-4 text-gray-900 dark:text-white">
              <strong>Your API Key:</strong> {apiKey}
              <br />
              <small>Expires in 1 minute</small>
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
            <div className="absolute top-2 left-2 text-sm text-gray-900 dark:text-white">
              Chat history will appear here.
            </div>
          )}
          {messages.map((msg, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">
              {msg}
            </p>
          ))}
          {loading && <p className="text-gray-700 dark:text-gray-300">Bot is typing...</p>}
          {isTyping && <p className="text-gray-700 dark:text-gray-300">...</p>}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-emerald-600 text-white rounded-full"
          >
            <Send />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;
