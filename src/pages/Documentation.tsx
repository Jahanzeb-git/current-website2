import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [apiKeyTimer, setApiKeyTimer] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const generateApiKey = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/chatbot?action=generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email.');
      }

      const data = await response.json();
      setIsPolling(true);
      alert(data.message); // Show success message for verification email.
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      closePopup();
    }
  };

  const pollForApiKey = async () => {
    let retries = 0;
    const maxRetries = 10;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    while (retries < maxRetries) {
      try {
        const response = await fetch(
          `/.netlify/functions/chatbot?action=return_api&email=${encodeURIComponent(email)}`,
          { method: 'GET' }
        );

        const data = await response.json();

        if (response.ok) {
          setApiKey(data.api_key);
          setApiKeyTimer(60); // Set the timer to 60 seconds.
          setIsPolling(false);
          return;
        }

        if (response.status === 403) {
          setError('Verification failed. Please try again.');
          setIsPolling(false);
          return;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      retries++;
      await delay(3000); // Poll every 3 seconds.
    }

    setError('Request timed out. Please try again later.');
    setIsPolling(false);
  };

  useEffect(() => {
    if (isPolling) {
      pollForApiKey();
    }
  }, [isPolling]);

  useEffect(() => {
    if (apiKeyTimer && apiKeyTimer > 0) {
      const timer = setInterval(() => {
        setApiKeyTimer((prev) => (prev ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }

    if (apiKeyTimer === 0) {
      setApiKey(null); // Clear the API key after the timer ends.
    }
  }, [apiKeyTimer]);

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
      {/* Popup for email input */}
      {isPopupOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-xl font-bold mb-4">Enter Your Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mb-4"
            />
            <button
              onClick={generateApiKey}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              Continue
            </button>
            <button
              onClick={closePopup}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Documentation Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This chatbot is powered by an advanced AI model tailored for Data Science-related queries.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <motion.button
          onClick={openPopup}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
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
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm w-64"
              />
              <button onClick={copyToClipboard} className="text-blue-500">
                <ClipboardCopy />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Your API key will expire in {apiKeyTimer} seconds.
            </p>
          </div>
        )}

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </motion.div>
  );
};

export default Documentation;

