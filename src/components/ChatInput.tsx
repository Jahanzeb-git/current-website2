import React, { useState } from 'react';
import { ArrowUp, Paperclip, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  isInitial?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isInitial = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={isInitial ? { y: -100 } : { y: 0 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`w-full max-w-2xl mx-auto ${isInitial ? 'mt-32' : 'mt-4'}`}
    >
      <div className="relative flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="w-full p-4 pr-20 bg-gray-100 dark:bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          rows={1}
        />
        <div className="absolute right-2 flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <Globe className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-black dark:bg-white rounded-lg"
          >
            <ArrowUp className="w-5 h-5 text-white dark:text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
