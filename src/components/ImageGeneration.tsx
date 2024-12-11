import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/chat';
import { ImageCollage } from './ImageCollage';
import { ProcessingMessages } from './ProcessingMessages';

interface ImageGenerationProps {
  messages: Message[];
  loading: boolean;
}

export const ImageGeneration: React.FC<ImageGenerationProps> = ({ messages, loading }) => {
  const latestImage = messages.filter(msg => msg.image).pop();
  const showCollage = !loading && !latestImage;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Image Generation V2
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Describe the image you want to create
        </p>
      </div>

      <AnimatePresence mode="wait">
        {showCollage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <ImageCollage />
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingMessages />
          </motion.div>
        )}

        {latestImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="overflow-y-auto max-h-[400px]">
              {messages.map((msg, index) => (
                msg.image && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <img
                      src={msg.image}
                      alt="Generated"
                      className="w-full rounded-lg shadow-lg"
                    />
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
