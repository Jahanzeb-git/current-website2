import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false); // State for documentation
  const [isTyping, setIsTyping] = useState<boolean>(false); // Track typing status

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
        const newMessage = prevMessages.slice(); // Create a copy of the messages array
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
            This is the documentation section. Here you can find details about the chatbot's capabilities, commands, and general usage.
            <br />
            <br />
            You can ask the bot anything related to Data Science, and it will try to respond based on the information it has.
          </p>
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
                  ? 'text-orange-600 opacity-80' // Style for user messages
                  : 'text-gray-800 dark:text-white' // Style for bot messages
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
            onKeyDown={handleKeyDown} // Add the keydown event handler
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 transition-colors"
          >
            <Send className="w-5 h-5" />
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
