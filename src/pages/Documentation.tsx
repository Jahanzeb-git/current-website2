import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('apiKey') || null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [apiKeyTimer, setApiKeyTimer] = useState<number>(0);

  useEffect(() => {
    // Check if API key already exists in localStorage
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    // Timer for the API key expiry
    if (apiKey) {
      const timer = setInterval(() => {
        setApiKeyTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Clear the timer when the API key expires
      return () => clearInterval(timer);
    }
  }, [apiKey]);

  const generateApiKey = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api?action=generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email. Please try again.');
      }

      alert('Verification email sent. Please check your inbox.');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('stepStatus', 'verification-sent');
      startPolling();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startPolling = async () => {
    setPolling(true);
    try {
      for (let i = 0; i < 10; i++) {
        const response = await fetch(
          `/.netlify/functions/api?action=return_api&email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (response.ok) {
          setApiKey(data.api_key);
          localStorage.setItem('apiKey', data.api_key);
          localStorage.removeItem('userEmail');
          localStorage.removeItem('stepStatus');
          setPolling(false);
          return;
        } else if (response.status === 403) {
          setApiKey(data.message || 'API key already generated.');
          localStorage.setItem('apiKey', data.message || 'API key already generated.');
          setPolling(false);
          return;
        } else if (response.status === 400) {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
        }
      }
      setError('Verification timed out. Please try again later.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during polling.');
    } finally {
      setPolling(false);
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
          You can ask it any question regarding Data Science, and it will respond with detailed answers.
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>

        <div className="mt-4">
          {!apiKey && (
            <motion.button
              onClick={() => setShowEmailModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            >
              Generate API Key
            </motion.button>
          )}

          {showEmailModal && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4"
            >
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Enter your email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={generateApiKey}
                className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
              >
                Continue
              </button>
            </motion.div>
          )}

          {polling && (
            <p className="text-sm text-gray-500 mt-2">Waiting for verification...</p>
          )}
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
              <p className="text-sm text-gray-500 mt-2">
                Your API key will expire in {apiKeyTimer} seconds.
              </p>
            </div>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;




