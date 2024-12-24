import React from 'react';
import { motion } from 'framer-motion';
import starIcon from '../Assets/images/star.svg';

interface StarDecorationProps {
  children: React.ReactNode;
}

const StarDecoration: React.FC<StarDecorationProps> = ({ children }) => {
  return (
    <div className="relative inline-block">
      {/* Top right star */}
      <motion.img
        src={starIcon}
        alt=""
        className="absolute -top-8 -right-12 w-12 h-12"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      
      {/* Bottom left star */}
      <motion.img
        src={starIcon}
        alt=""
        className="absolute -bottom-4 -left-12 w-10 h-10"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: -360, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {children}
    </div>
  );
};

export default StarDecoration;
