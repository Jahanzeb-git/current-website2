import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  isOpen, 
  onClick, 
  unreadCount = 0 
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={onClick}
        className={`
          relative w-14 h-14 rounded-full shadow-lg
          bg-gradient-to-r from-teal-500 to-green-600
          hover:from-teal-600 hover:to-green-700
          text-white transition-all duration-150
          flex items-center justify-center
          ${isOpen ? 'scale-95' : 'hover:scale-105'}
          active:scale-90
        `}
        whileHover={{ scale: isOpen ? 0.95 : 1.05 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.3
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.div>
        
        {unreadCount > 0 && !isOpen && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatButton;