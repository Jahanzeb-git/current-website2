// Documentation.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

interface DocumentationProps {
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyTimer, setApiKeyTimer] = useState<number | null>(null);

  const generateApiKey = async () => {
    try {
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate API key');
      }

      const data = await response.json();
      setApiKey(data.apiKey);
      setApiKeyTimer(60);
      setError(null);
    } catch (error) {
      setApiKey(null);
      setError('API Key already generated or failed to generate.');
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 left-0 right-0 bottom-0 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm p-6 z-10 rounded-xl"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
      <p className="text-gray-700 dark:text-gray-300">
        This chatbot is powered by an advanced AI model tailored for Data Science-related queries.
        You can ask it any question regarding Data Science and it will respond with detailed answers.
      </p>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
        <li>
          API Endpoint: <code>jahanzebahmed22.pythonanywhere.com/response</code>
        </li>
        <li>
          Expected Request Type: <code>POST</code>
        </li>
        <li>
          API Key in Header: <code>'x-api-key': '879479379749734597'</code>
        </li>
        <li>
          <strong>Expected Request Body:</strong>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
            {`{
              "prompt": "who are you?",
              "system_prompt": "You are Intelligent",
              "tokens": 500
            }`}
          </pre>
        </li>
        <li>
          <strong>Example Headers:</strong>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2 text-sm">
            {`{
              "Content-Type": "application/json",
              "x-api-key": "879479379749734597"
            }`}
          </pre>
        </li>
      </ul>

      <div className="mt-4">
        <motion.button
          onClick={generateApiKey}
          className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-full"
          whileHover={{ scale: 1.0 }}
          whileTap={{ scale: 0.9 }}
        >
          Generate API Key
        </motion.button>

        {apiKey && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400"
          >
            <span>API Key: {apiKey}</span>
            <ClipboardCopy
              className="w-5 h-5 cursor-pointer"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            />
            <span className="text-sm text-gray-600">({apiKeyTimer}s)</span>
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-red-600 dark:text-red-400"
          >
            Error: {error}
          </motion.p>
        )}
      </div>

      <button
        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-full"
        onClick={onClose}
      >
        Close Documentation
      </button>
    </motion.div>
  );
};

export default Documentation;
