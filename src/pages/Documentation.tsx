import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';
import { useHistory } from 'react-router-dom'; // Added to handle redirection back to the same tab

const Documentation: React.FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('userEmail') || '');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const history = useHistory(); // Used for programmatically redirecting

  useEffect(() => {
    const stepStatus = localStorage.getItem('stepStatus');
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get('email');
    const verified = queryParams.get('verified');

    // If verified=true is in the query params and we have an email, handle it
    if (emailFromUrl && verified === 'true') {
      // Ensure email is the same as the query parameter
      if (emailFromUrl !== email) {
        setEmail(emailFromUrl); // Update email if different from localStorage
        localStorage.setItem('userEmail', emailFromUrl); // Store email in localStorage
      }
      // Proceed to start polling or handle other actions
      setPolling(true);
      checkVerificationStatus(emailFromUrl);
    } else if (stepStatus === 'verification-sent' && email) {
      startPolling(); // Resume polling if verification was in progress
    }
  }, [email]);

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

  const checkVerificationStatus = async (email: string) => {
    try {
      const response = await fetch(`/.netlify/functions/api?action=return_api&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        setApiKey(data.api_key);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('stepStatus');
        setPolling(false);
      } else if (response.status === 403) {
        setApiKey(data.message || 'API key already generated.');
        setPolling(false);
      }
    } catch (err) {
      setError('Error checking verification status.');
    }
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  // Redirect to the same tab when verification is done
  const handleRedirect = () => {
    if (email && apiKey) {
      history.push(`/Documentation?email=${email}&verified=true`);
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
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={generateApiKey}
            className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
          >
            Continue
          </button>

          {polling && <p className="text-sm text-gray-500 mt-2">Waiting for verification...</p>}
          {apiKey && (
            <div className="mt-4">
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
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;
