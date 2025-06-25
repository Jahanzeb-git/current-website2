import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

interface DetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: {
    description: string;
    details: string[];
    benefits: string[];
  };
}

const DetailPopup: React.FC<DetailPopupProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {content.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  Key Components
                </h3>
                <ul className="space-y-2">
                  {content.details.map((detail, index) => (
                    <li
                      key={index}
                      className="text-gray-600 dark:text-gray-300 flex items-start"
                    >
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {content.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="text-gray-600 dark:text-gray-300 flex items-start"
                    >
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailPopup;
