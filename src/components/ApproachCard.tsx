import React from 'react';
import { motion } from 'framer-motion';

interface ApproachCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ApproachCard: React.FC<ApproachCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="text-emerald-600 dark:text-emerald-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );
};

export default ApproachCard;
