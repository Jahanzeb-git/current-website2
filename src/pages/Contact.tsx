import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Navbar from '../components/Navbar';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
  show: boolean;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [toast, setToast] = useState<Toast>({ type: 'success', message: '', show: false });
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Formspree integration
  const [state, handleFormspreeSubmit] = useForm("xeokkvyv");

  const MAX_MESSAGE_LENGTH = 2000;

  // Auto-save functionality
  const saveToSessionStorage = useCallback((data: FormData) => {
    try {
      sessionStorage.setItem('contact_form_draft', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date());
    } catch (error) {
      console.warn('Could not save draft to session storage');
    }
  }, []);

  // Load saved draft on component mount
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem('contact_form_draft');
      if (savedDraft) {
        const { name, email, message, timestamp } = JSON.parse(savedDraft);
        const savedTime = new Date(timestamp);
        const now = new Date();
        
        // Only restore if saved within the last 24 hours
        if (now.getTime() - savedTime.getTime() < 24 * 60 * 60 * 1000) {
          setFormData({ name: name || '', email: email || '', message: message || '' });
          setCharCount((message || '').length);
          setLastSaved(savedTime);
        }
      }
    } catch (error) {
      console.warn('Could not load draft from session storage');
    }
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    if (formData.name || formData.email || formData.message) {
      const timeoutId = setTimeout(() => {
        saveToSessionStorage(formData);
      }, 1000); // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveToSessionStorage]);

  // Update character count
  useEffect(() => {
    setCharCount(formData.message.length);
  }, [formData.message]);

  // Handle Formspree success/error states
  useEffect(() => {
    if (state.succeeded) {
      showToast('success', 'Message sent successfully! Thanks for reaching out.');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      setCharCount(0);
      setErrors({});
      
      // Clear saved draft
      try {
        sessionStorage.removeItem('contact_form_draft');
        setLastSaved(null);
      } catch (error) {
        console.warn('Could not clear saved draft');
      }
    }
  }, [state.succeeded]);

  // Handle Formspree errors
  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      const errorMessages = state.errors
        .map(error => error.message)
        .filter(Boolean)
        .join(', ');
      
      if (errorMessages) {
        showToast('error', errorMessages);
      } else {
        showToast('error', 'Failed to send message. Please try again.');
      }
    }
  }, [state.errors]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Prevent message from exceeding max length
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      showToast('error', 'Please fix the errors below');
      return;
    }

    // Submit to Formspree
    await handleFormspreeSubmit(e);
  };

  const getCharCountColor = () => {
    const percentage = (charCount / MAX_MESSAGE_LENGTH) * 100;
    if (percentage < 70) return 'text-gray-500';
    if (percentage < 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <Navbar />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg max-w-md"
            style={{
              background: toast.type === 'success' 
                ? 'linear-gradient(135deg, #10B981, #059669)' 
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
          <h1 className="text-6xl md:text-9xl font-extrabold mb-8 bg-gradient-to-r from-[#025A4E] to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-transparent bg-clip-text">
            Get in Touch.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Let's discuss how we can work together on your next data science project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Send a Message
              </h2>
              {lastSaved && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Draft saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-colors`}
                  disabled={state.submitting}
                />
                <ValidationError 
                  prefix="Name" 
                  field="name"
                  errors={state.errors}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-colors`}
                  disabled={state.submitting}
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <span className={`text-xs ${getCharCountColor()}`}>
                    {charCount}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-emerald-500 dark:focus:ring-emerald-400'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 transition-colors resize-vertical`}
                  disabled={state.submitting}
                  placeholder="Tell me about your project or ask any questions..."
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={state.submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {state.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Connect
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:jahanzebahmed.mail@gmail.com"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>jahanzebahmed.mail@gmail.com</span>
                </a>
                <a
                  href="https://github.com/Jahanzeb-git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/jahanzeb-ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/jahanzebahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Quick Response
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                I typically respond to messages within 24 hours. For urgent inquiries, 
                feel free to reach out directly via email.
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-lg font-semibold mb-2 text-emerald-800 dark:text-emerald-300">
                Let's Build Something Amazing
              </h3>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                Whether you need data analysis, machine learning solutions, or data visualization, 
                I'm here to help bring your ideas to life.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Contact;