import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Check, Cpu, Settings, Trash2, MessageSquare, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const Chatbot: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: new Date().toISOString(),
    title: 'New Chat',
    messages: [],
    timestamp: Date.now()
  });
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen 3.2');
  const [showTerms, setShowTerms] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const preOptions = ["What is Data Science?", "Explain Machine Learning", "Tell me about AI", "What is Python?"];

  useEffect(() => {
    const storedSessions = localStorage.getItem('chatSessions');
    if (storedSessions) {
      setChatSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentSession.messages, loading]);

  const getUserRequestedLanguage = (input: string): string | null => {
    const languages = ['python', 'c++', 'javascript', 'java', 'ruby', 'php', 'bash'];
    const inputLower = input.toLowerCase();
    return languages.find(lang => inputLower.includes(lang)) || null;
  };

  const startTypingEffect = (message: string) => {
    setIsTyping(true);
    let i = 0;

    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, { type: 'bot', text: '', timestamp: Date.now() }]
    }));

    const interval = setInterval(() => {
      setCurrentSession(prev => {
        const newMessages = [...prev.messages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].text = message.slice(0, i + 1) + '|';
        }
        return { ...prev, messages: newMessages };
      });

      i += 1;

      if (i === message.length) {
        clearInterval(interval);
        setCurrentSession(prev => {
          const newMessages = [...prev.messages];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].text = message;
          }
          return { ...prev, messages: newMessages };
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

    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, { type: 'user', text: sanitizedInput, timestamp: Date.now() }]
    }));

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

      // Update chat sessions
      if (currentSession.messages.length === 0) {
        const newSession = {
          ...currentSession,
          title: sanitizedInput.slice(0, 30) + (sanitizedInput.length > 30 ? '...' : '')
        };
        setCurrentSession(newSession);
        setChatSessions(prev => [newSession, ...prev]);
      } else {
        setChatSessions(prev => 
          prev.map(session => 
            session.id === currentSession.id ? currentSession : session
          )
        );
      }
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, { type: 'bot', text: 'Sorry, something went wrong.', timestamp: Date.now() }]
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: new Date().toISOString(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now()
    };
    setCurrentSession(newSession);
    setChatSessions(prev => [newSession, ...prev]);
  };

  const loadChatSession = (session: ChatSession) => {
    setCurrentSession(session);
    setSidebarOpen(false);
  };

  const deleteChatSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession.id === sessionId) {
      startNewChat();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-gray-800 text-white p-4 overflow-y-auto"
          >
            <button
              onClick={startNewChat}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              New Chat
            </button>

            <div className="space-y-2">
              {chatSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChatSession(session)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                  <span className="truncate flex-1">{session.title}</span>
                  <button
                    onClick={(e) => deleteChatSession(session.id, e)}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">{currentSession.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {currentSession.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
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
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <button
                className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => handleSend(input)}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {preOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(option)}
                  className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-[80px] right-[20px] bg-white dark:bg-gray-700 w-64 p-4 rounded-lg shadow-lg z-20"
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

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
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
    </div>
  );
};

export default Chatbot;
