import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the verification process was successful
    const verificationSuccess = localStorage.getItem('verificationSuccess');
    if (verificationSuccess === 'true') {
      // Focus on the current tab if the verification is successful
      localStorage.removeItem('verificationSuccess'); // Remove after focusing

      // Optional: If you want to refresh or re-fetch data, you can do so here.
      // For example, re-fetch API keys if needed.

      // Since the page is already open, we can just show a success message or take further action.
      alert("Your email has been successfully verified!");
    }
  }, []);

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
          `/.netlify/functions/api?action=return_api&email=${encodeURIComponent(email)}`,
        );
        const data = await response.json();

        if (response.ok) {
          setApiKey(data.api_key);
          localStorage.removeItem('userEmail');
          localStorage.removeItem('stepStatus');
          setPolling(false);
          return;
        } else if (response.status === 403) {
          setApiKey(data.message || 'API key already generated.');
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
    <motion.div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="mt-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
            Enter your email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter your email"
          />
        </div>
        {error && <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>}
        {apiKey && (
          <div className="mt-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Your API Key:</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-500 dark:text-blue-400"
              >
                <ClipboardCopy size={16} />
              </button>
            </div>
          </div>
        )}
        {!apiKey && !polling && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={generateApiKey}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Generate API Key
            </button>
          </div>
        )}
        {polling && <div className="mt-4 text-blue-500">Polling for API Key...</div>}
      </div>
    </motion.div>
  );
};

export default Documentation;



