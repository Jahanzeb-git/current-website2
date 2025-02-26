import React from 'react';
import { motion } from 'framer-motion';
import starIcon from '../Assets/images/star.svg';

interface StarDecorationProps {
  children: React.ReactNode;
}

const StarDecoration: React.FC<StarDecorationProps> = ({ children }) => {
  return (
    <div className="mt-10 relative inline-block">
      {/* Top right star */}
      <motion.img
        src={starIcon}
        alt=""
        className="absolute w-12 h-12 -top-8 right-[-20px] sm:right-[-30px] md:right-[-48px]"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Bottom left star */}
      <motion.img
        src={starIcon}
        alt=""
        className="absolute w-10 h-10 -bottom-4 left-[-20px] sm:left-[-30px] md:left-[-48px]"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: -360, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {children}
    </div>
  );
};

export default StarDecoration;



