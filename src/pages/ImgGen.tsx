import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageGeneration from '../components/ImageGeneration';
import Navbar from '../components/Navbar';

const NewPage = () => {
  const [isImageGenerationVisible, setIsImageGenerationVisible] = useState(false);
  const handleImageGenerationIntersect = (isVisible) => setIsImageGenerationVisible(isVisible);

  return (
    <>
      <Navbar hide={isImageGenerationVisible} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto px-4 pt-32 pb-16"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
            Try Next Gen Image Generation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unleash your creativity with advanced image generation capabilities.
          </p>
        </motion.div>

        {/* Display ImageGeneration.tsx component */}
        <ImageGeneration onIntersect={handleImageGenerationIntersect} />
      </motion.div>
    </>
  );
};

export default NewPage;
