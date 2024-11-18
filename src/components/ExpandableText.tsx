// src/components/ExpandableText.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ExpandableTextProps {
  title: string;
  body: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ title, body }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-300">
        {isExpanded ? (
          body
        ) : (
          <>
            {body.substring(0, 200)}
            <span
              className="inline-block cursor-pointer text-blue-500"
              onClick={toggleExpand}
            >
              &nbsp;Read more
            </span>
          </>
        )}
      </div>
      {isExpanded && (
        <span
          className="inline-block cursor-pointer text-blue-500"
          onClick={toggleExpand}
        >
          &nbsp;Read less
        </span>
      )}
    </motion.div>
  );
};

export default ExpandableText;
