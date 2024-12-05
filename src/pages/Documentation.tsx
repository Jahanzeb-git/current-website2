import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Updated import

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const navigate = useNavigate(); // Use navigate instead of history

  let documentationWindow: Window | null = null; // Declare a variable to track the opened documentation window

  useEffect(() => {
    const stepStatus = localStorage.getItem('stepStatus');
    if (stepStatus === 'verification-sent' && email) {
      startPolling(); // Resume polling if verification was in progress
    }
  }, [email]);

  // Function to check if Documentation page is already open
  const openDocumentationPage = () => {
    const url = 'https://jahanzebahmed.netlify.app/Documentation';

    // Check if Documentation page is already open
    if (documentationWindow && !documentationWindow.closed) {
      documentationWindow.focus(); // Bring the existing tab into focus
    } else {
      documentationWindow = window.open(url, '_blank'); // Open in a new tab if not open
    }
  };

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
      for (let i = 0; i < 10; i++) { // Polling up to 10 times
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

  useEffect(() => {
    // Check the URL for verification parameters and navigate accordingly
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const userEmail = urlParams.get('email');
    if (verified === 'true' && userEmail) {
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('stepStatus', 'verified');
      // Open or focus the Documentation page
      openDocumentationPage();
      // Navigate back to the previous page
      navigate(-1); // This takes the user back to the previous page (same tab)
    }
  }, [navigate]);

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

