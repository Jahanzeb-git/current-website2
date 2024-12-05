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

  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    const savedTimer = parseInt(localStorage.getItem('apiKeyTimer') || '0', 10);
    if (savedApiKey && savedTimer > 0) {
      setApiKey(savedApiKey);
      setApiKeyTimer(savedTimer);
    }
  }, []);

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
          setApiKeyTimer(60);
          localStorage.setItem('apiKey', data.api_key);
          localStorage.setItem('apiKeyTimer', '60');
          setPolling(false);
          return;
        } else if (response.status === 403) {
          setApiKey(data.message || 'API key already generated.');
          setApiKeyTimer(60);
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
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is Fine tuned for handling System Prompt accurately for handling Personalised Responses and Can handle 4000 Tokens Max.</p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">How to Use</h4>

        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">
            This chatbot uses the Qwen 3.2 model, which has 4k parameters and is custom fine-tuned for conversation adaptability. 
            It is able to understand system prompts and respond contextually.
          </p>
          <p>  </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Architecture:</b> transformers with RoPE, SwiGLU, RMSNorm, and Attention QKV bias
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Endpoint:</b> https://jahanzebahmed22.pythonanywhere.com/response
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Method :</b> POST
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <b>Header :</b> x-api-key: your-api-key
          </p>
          <p> </p>
          <p className="text-green-700 dark:text-gray-300">
            Click the button below to generate one time API key.
          </p>
          

          {!apiKey && !polling && (
            <motion.button
              onClick={() => setShowEmailModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white px-4 py-2 rounded-lg mt-4"
            >
              Generate API Key
            </motion.button>
          )}

          {showEmailModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex justify-center items-center"
            >
              {/* Blurred Background */}
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
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
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateApiKey}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
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
