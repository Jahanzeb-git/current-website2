import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('apiKey') || null);
  const [apiKeyTimer, setApiKeyTimer] = useState<number>(
    parseInt(localStorage.getItem('apiKeyTimer') || '0', 10)
  );
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Load saved API key and timer on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedTimer = parseInt(localStorage.getItem('apiKeyTimer') || '0', 10);

    if (savedApiKey && savedTimer > 0) {
      setApiKey(savedApiKey);
      setApiKeyTimer(savedTimer);
    }
  }, []);

  // Countdown timer for API key expiration
  useEffect(() => {
    if (apiKeyTimer > 0) {
      const timer = setInterval(() => {
        setApiKeyTimer((prev) => {
          const updatedTimer = Math.max(prev - 1, 0);
          localStorage.setItem('apiKeyTimer', updatedTimer.toString());
          return updatedTimer;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (apiKeyTimer === 0) {
      setApiKey(null);
      localStorage.removeItem('apiKey');
      localStorage.removeItem('apiKeyTimer');
    }
  }, [apiKeyTimer]);

  // API key generation
  const generateApiKey = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api?action=generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send verification email.');

      alert('Verification email sent. Please check your inbox.');
      localStorage.setItem('userEmail', email);
      startPolling();
      setShowEmailModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Polling for API key
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
          setApiKeyTimer(60);
          localStorage.setItem('apiKey', data.api_key);
          localStorage.setItem('apiKeyTimer', '60');
          break;
        } else if (response.status === 400) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          setError(data.error || 'API key retrieval failed.');
          break;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPolling(false);
    }
  };

  // Copy API key to clipboard
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
      <header className="text-center mb-16">
        <motion.h1
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Documentation
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This chatbot leverages Qwen 3.2, a fine-tuned AI model for data science-related queries.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">How to Use</h4>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Generate an API key to begin using this chatbot. The key is valid for a limited time.
        </p>

        {/* API Key Actions */}
        {!apiKey && !polling && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Generate API Key
          </button>
        )}

        {polling && <p className="text-sm text-gray-500 mt-2">Waiting for verification...</p>}

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
            <p className="text-sm text-gray-500 mt-2">Expires in {apiKeyTimer} seconds.</p>
          </div>
        )}

        {/* Error Display */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Enter your email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Documentation;

