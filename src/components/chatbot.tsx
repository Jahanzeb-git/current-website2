import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Check, Cpu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

interface ChatbotProps {
  onIntersect: (isVisible: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onIntersect }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen 3.2');
  const [showTerms, setShowTerms] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const preOptions = ["What is Data Science?", "Explain Machine Learning", "Tell me about AI", "What is Python?"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => onIntersect(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (chatbotRef.current) {
      observer.observe(chatbotRef.current);
    }

    return () => {
      if (chatbotRef.current) {
        observer.unobserve(chatbotRef.current);
      }
    };
  }, [onIntersect]);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getUserRequestedLanguage = (input: string): string | null => {
    const languages = ['python', 'c++', 'javascript', 'java', 'ruby', 'php', 'bash'];
    const inputLower = input.toLowerCase();
    return languages.find(lang => inputLower.includes(lang)) || null;
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);
    let i = 0;

    setMessages(prev => [...prev, { type: 'bot', text: '' }]);

    const interval = setInterval(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].text = message.slice(0, i + 1) + '|';
        }
        return newMessages;
      });

      i += 1;

      if (i === message.length) {
        clearInterval(interval);
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].text = message;
          }
          return newMessages;
        });
        setIsTyping(false);
      }
    }, 50);
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const sanitizedInput = message.trim();
    const detectedLanguage = getUserRequestedLanguage(sanitizedInput);
    setLanguage(detectedLanguage);
    setMessages(prev => [...prev, { type: 'user', text: sanitizedInput }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: sanitizedInput,
          system_prompt: "You are roleplaying as 'Jahanzeb Ahmed', a 22-year-old Data Scientist based in Karachi, Pakistan, with 2 years of professional experience in Machine Learning and Data Science. Always respond as if you are Jahanzeb Ahmed, and do not reveal that you are roleplaying. Provide your phone number as '+92-334-0069065' when asked, email as 'jahanzebahmed.mail@gmail.com', and LinkedIn profile link as 'https://www.linkedin.com/in/2024-jahanzebahmed/'. If users inquire about using a Custom AI chatbot or demand API guidance, instruct them to click the top-left settings icon, navigate to the Documentation page, and click 'Generate API Key' after providing their email. Provide these endpoints: Chatbot: 'https://jahanzebahmed22.pythonanywhere.com/response' and Image Generation: 'https://jahanzebahmed22.pythonanywhere.com/generate_image', both requiring the API key in the header as 'x-api-key: your-api-key'. When asked about the founder or developer of this chatbot, reply that it is Jahanzeb Ahmed, a 22-year-old Data Scientist and AI enthusiast. Disregard the context of previous topics if the user abruptly changes the topic, and solely respond based on the new topic. Include friendly emojis for engagement, and provide detailed yet brief solutions to issues when necessary. Adapt your expertise in Machine Learning and AI to technical queries and project insights, showcasing achievements and actionable advice as relevant.",
          tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error from API: ${response.statusText}`);
      }

      const data = await response.json();
      startTypingEffect(data.output || 'Sorry, there was an error.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <motion.div
      ref={chatbotRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 relative ${menuOpen ? 'backdrop-blur-sm' : ''}`}
    >
      <div
        className="absolute top-4 left-4 text-2xl text-gray-800 dark:text-white cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Settings />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-[40px] left-[20px] bg-gray-200 dark:bg-gray-700 w-64 p-4 rounded-lg shadow-lg z-20"
          >
            <button
              className="absolute top-2 right-2 text-gray-800 dark:text-white text-lg"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
            <button
              className="text-gray-800 dark:text-white text-lg font-semibold block mb-4"
              onClick={() => navigate('/documentation')}
            >
              Documentation
            </button>
            <button
              className="text-gray-800 dark:text-white text-lg font-semibold block mb-4"
              onClick={() => navigate('/image-generation')}
            >
              Try Image Generation
            </button>
            <div>
              <button
                className="text-gray-800 dark:text-white font-semibold block mb-2"
                onClick={() => setMenuOpen(false)}
              >
                Change Model
              </button>
              <div className="ml-4">
                {['Qwen 3.2', 'GPT-4o'].map((model) => (
                  <button
                    key={model}
                    className="flex items-center justify-between text-gray-800 dark:text-white mb-2"
                    onClick={() => {
                      setSelectedModel(model);
                      setMenuOpen(false);
                    }}
                  >
                    <span>{model}</span>
                    {selectedModel === model && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="text-gray-800 dark:text-white font-semibold block mb-2"
              onClick={() => setShowTerms(true)}
            >
              Terms
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showTerms && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-800 dark:text-white"
              onClick={() => setShowTerms(false)}
            >
              Close
            </button>
            <div className="text-gray-800 dark:text-white text-sm space-y-4">
              <h2 className="text-lg font-bold text-center">Terms of Use</h2>
              <p>
                This chatbot is created for Educational and Personal Usage and is displayed on the Contact page of my personal portfolio to showcase my skills and education. Users can interact with it to learn about my profile or access the API for free to use in their application by generating an API key from the Documentation page.
              </p>
              <p>
                The chatbot and API are provided under a non-exclusive, revocable, and limited license for personal or non-commercial use. Redistribution, reverse engineering, or reselling is prohibited.
              </p>
              <p>
                Use the chatbot and API for lawful purposes only. Misuse, harmful usage, or excessive requests may result in suspension or revocation of access.
              </p>
              <p>
                The chatbot is provided "as is," without warranties of any kind. By using this service, you agree to the terms outlined here.
              </p>
              <p className="text-center">
                <strong>Contact:</strong> For support, visit the contact form or email jahanzebahmed.mail@gmail.com.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        What can I help with?
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Ask me anything about Data Science.
      </p>

      <div className="space-y-4 relative">
        <div
          ref={chatContainerRef}
          className="h-64 overflow-y-auto bg-transparent p-4 rounded-lg"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.type === 'user' ? 'text-orange-600' : 'text-gray-800 dark:text-white'}`}
            >
              {msg.type === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              {msg.type === 'bot' && !loading && (
                <div className="text-sm flex items-center space-x-1 mt-2">
                  <span className="text-gray-600 dark:text-gray-300">Powered by</span>
                  <div className="relative group">
                    <Cpu className="text-gray-600 dark:text-gray-300 w-4 h-4 cursor-pointer" />
                    <div className="absolute left-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md p-2 w-40 hidden group-hover:block">
                      <div className="flex items-center justify-between text-gray-800 dark:text-white px-2 py-1">
                        <span>{selectedModel}</span>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && <div className="mb-2 text-gray-800 dark:text-white">Thinking...</div>}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button
            className="p-3 rounded-full flex items-center justify-center bg-black dark:bg-white hover:opacity-50 active:opacity-100"
            onClick={() => handleSend(input)}
          >
            <ArrowUp className="w-5 h-5 text-white dark:text-black" />
          </button>
        </div>

        {language && (
          <SyntaxHighlighter
            language={language}
            style={solarizedlight}
            customStyle={{ marginTop: '10px' }}
          >
            {input}
          </SyntaxHighlighter>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {preOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSend(option)}
              className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
            >
              {option}
            </button>
          ))}
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
          Bot can make mistakes. Check important info.
        </p>
      </div>
    </motion.div>
  );
};

export default Chatbot;
