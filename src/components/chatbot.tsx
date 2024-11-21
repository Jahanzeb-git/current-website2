import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for styling

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
      console.log(data); // Log to check response structure

      setMessages((prevMessages) => [
        ...prevMessages,
        `Bot: ${data.response || 'Sorry, there was an error.'}`,
      ]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        'Bot: Sorry, something went wrong.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const renderMessage = (msg: string) => {
    if (msg.startsWith('You:')) {
      return <span className="text-orange-600 opacity-80">{msg}</span>;
    }

    if (msg.startsWith('Bot:')) {
      const content = msg.replace('Bot: ', '');

      // Regular expressions to identify LaTeX parts
      const blockMathRegex = /\$\$(.+?)\$\$/g;
      const inlineMathRegex = /\$(.+?)\$/g;

      const handledContent = content
        .split(blockMathRegex)
        .flatMap((blockPart, index) =>
          index % 2 === 1
            ? [<BlockMath key={index}>{blockPart.trim()}</BlockMath>]
            : blockPart.split(inlineMathRegex).map((inlinePart, inlineIndex) =>
                inlineIndex % 2 === 1 ? (
                  <InlineMath key={`${index}.${inlineIndex}`}>{inlinePart.trim()}</InlineMath>
                ) : (
                  <span key={`${index}.${inlineIndex}`}>{inlinePart}</span>
                )
              )
        );

      return <>{handledContent}</>;
    }

    return <span>{msg}</span>;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
    >
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
            <div key={index} className="mb-2 text-gray-800 dark:text-white">
              {renderMessage(msg)}
            </div>
          ))}
          {loading && (
            <div className="mb-2 text-gray-800 dark:text-white">Bot: Typing...</div>
          )}
          {messages.length > 0 && (
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
        <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-4">
          Bot can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
};

export default Chatbot;
