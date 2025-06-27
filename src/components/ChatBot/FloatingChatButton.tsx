import React, { useCallback, useMemo } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();
  
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  // Memoize animation variants for better performance
  const buttonVariants = useMemo(() => ({
    initial: { scale: 0, rotate: -90 },
    animate: { scale: 1, rotate: 0 },
    hover: { scale: isOpen ? 0.95 : 1.05 },
    tap: { scale: 0.9 }
  }), [isOpen]);

  const iconVariants = useMemo(() => ({
    animate: { rotate: isOpen ? 180 : 0 }
  }), [isOpen]);

  const badgeVariants = useMemo(() => ({
    initial: { scale: 0 },
    animate: { scale: 1 }
  }), []);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <motion.button
        onClick={handleClick}
        className={`
          relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg
          bg-gradient-to-r from-teal-500 to-green-600
          hover:from-teal-600 hover:to-green-700
          dark:from-teal-400 dark:to-green-500
          dark:hover:from-teal-500 dark:hover:to-green-600
          text-white transition-all duration-150
          flex items-center justify-center
          active:scale-90 focus:outline-none focus:ring-2 focus:ring-teal-500/50
          hover:shadow-xl dark:shadow-teal-500/25
        `}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.3
        }}
      >
        <motion.div
          variants={iconVariants}
          animate="animate"
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          {isOpen ? (
            <X size={24} className="sm:w-7 sm:h-7" />
          ) : (
            <MessageCircle size={24} className="sm:w-7 sm:h-7" />
          )}
        </motion.div>
        
        {unreadCount > 0 && !isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-semibold shadow-lg"
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default React.memo(FloatingChatButton);