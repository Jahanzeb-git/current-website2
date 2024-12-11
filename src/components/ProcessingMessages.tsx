import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const processingSteps = [
  "Processing image...",
  "Analyzing prompt...",
  "Generating initial composition...",
  "Adding details...",
  "Refining edges...",
  "Finalizing image..."
];

export const ProcessingMessages: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % processingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center text-gray-800 dark:text-white font-medium"
        >
          {processingSteps[currentStep]}
        </motion.div>
      </AnimatePresence>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </div>
    </div>
  );
};
