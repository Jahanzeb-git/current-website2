import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
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
      className="max-w-4xl mx-auto px-4 pt-32 pb-16"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This chatbot is powered by an advanced AI model tailored for Data Science-related queries.
          You can ask it any question regarding Data Science and it will respond with detailed answers.
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            Generate API Key
          </motion.button>
          {apiKey && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">API Key:</span>
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-white w-64"
                />
                <button onClick={copyToClipboard} className="text-blue-500">
                  <ClipboardCopy />
                </button>
              </div>
            </div>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {apiKeyTimer !== null && apiKeyTimer > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Your API key will expire in {apiKeyTimer} seconds.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;
