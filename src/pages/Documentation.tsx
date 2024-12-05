import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('apiKey') || null);
  const [apiKeyTimer, setApiKeyTimer] = useState<number>(parseInt(localStorage.getItem('apiKeyTimer') || '0', 10));
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Load initial state from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedTimer = parseInt(localStorage.getItem('apiKeyTimer') || '0', 10);
    if (savedApiKey && savedTimer > 0) {
      setApiKey(savedApiKey);
      setApiKeyTimer(savedTimer);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (apiKeyTimer > 0) {
      const timer = setInterval(() => {
        setApiKeyTimer((prev) => {
          const updatedTimer = prev > 0 ? prev - 1 : 0;
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
      setShowEmailModal(false); // Close the modal
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
          setApiKeyTimer(60); // Start the 60-second timer
          localStorage.setItem('apiKey', data.api_key);
          localStorage.setItem('apiKeyTimer', '60');
          setPolling(false);
          return;
        } else if (response.status === 403) {
          setApiKey(data.message || 'API key already generated.');
          setApiKeyTimer(60); // Start the 60-second timer
          localStorage.setItem('apiKey', data.message || 'API key already generated.');
          localStorage.setItem('apiKeyTimer', '60');
          setPolling(false);
          return;
        } else if (response.status === 400) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
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
          <p className="text-gray-700 dark:text-gray-300">
            This chatbot uses the Qwen 3.2 model, which has 4k parameters and is custom fine-tuned for conversation adaptability. 
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <b>Endpoint:</b> `jahanzebahmed22.pythonanywhere.com/response`
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Headers:</b> <code>x-api-key: your-key</code>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Request:</b> A POST request with the following input format:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm mt-2">
            {`{
  "question": "Your question here"
}`}
          </pre>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Response:</b> JSON containing the chatbot's reply:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm mt-2">
            {`{
  "answer": "The chatbot's response"
}`}
          </pre>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <b>Model Architecture:</b> Transformers with RoPE, SwiGLU, RMSNorm, and Attention QKV bias.
          </p>

          {!apiKey && !polling && (
            <motion.button
              onClick={() => setShowEmailModal(true)}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-lg mt-4"
            >
              Generate API Key
            </motion.button>
          )}

          {showEmailModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
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
                <div className="flex justify-end space-x-2 mt-4">
                  <motion.button
                    onClick={() => setShowEmailModal(false)}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={generateApiKey}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
                  >
                    Send Verification Email
                  </motion.button>
                </div>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </motion.div>
            </motion.div>
          )}

          {apiKey && (
            <motion.div
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mt-6 flex items-center space-x-2"
            >
              <code className="text-gray-700 dark:text-gray-300">{apiKey}</code>
              <button
                onClick={copyToClipboard}
                className="text-emerald-600 hover:text-emerald-500"
              >
                <ClipboardCopy />
              </button>
            </motion.div>
          )}

          {polling && (
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Verifying your email. Please wait...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;

