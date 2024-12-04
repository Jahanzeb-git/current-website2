import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const openEmailPopup = () => setShowEmailPopup(true);
  const closeEmailPopup = () => {
    setShowEmailPopup(false);
    setEmail('');
    setError(null);
  };

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch('/.netlify/functions/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email.');
      }

      const data = await response.json();
      setVerificationMessage(data.message); // Expected: "Verification email sent, please check your inbox"
      setIsPolling(true); // Start polling after verification email is sent
    } catch (err) {
      setError('Failed to send verification email.');
    } finally {
      closeEmailPopup();
    }
  };

  const pollForApiKey = async () => {
    try {
      const response = await fetch(`/.netlify/functions/api?email=${email}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.status === 200) {
        setApiKey(data.apiKey);
        setIsPolling(false); // Stop polling on success
        setVerificationMessage(null);
      } else if (response.status === 403) {
        setError(data.message); // "API key already generated."
        setIsPolling(false);
        setVerificationMessage(null);
      }
    } catch (err) {
      setError('Error polling for API key.');
      setIsPolling(false);
    }
  };

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    if (isPolling) {
      pollingInterval = setInterval(pollForApiKey, 3000); // Poll every 3 seconds
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [isPolling]);

  const copyToClipboard = () => {
    if (apiKey) navigator.clipboard.writeText(apiKey);
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
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
          {/* Documentation details */}
        </ul>

        <div className="mt-4">
          <motion.button
            onClick={openEmailPopup}
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
          {verificationMessage && (
            <p className="text-green-600 mt-2">{verificationMessage}</p>
          )}
        </div>
      </div>

      {/* Email Input Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Enter Your Email
            </h4>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeEmailPopup}
                className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Documentation;
