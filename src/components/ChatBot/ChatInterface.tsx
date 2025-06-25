import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../../context/ThemeContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, sessionId }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create initial bot message with "Braining..." indicator
    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      type: 'bot',
      content: 'Braining...',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);
    setStreamingMessageId(botMessageId);

    try {
      console.log("Requesting /chat endpoint. Getting Response...")
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          query: userMessage.content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';
      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setIsLoading(false);
              setStreamingMessageId(null);
              setMessages(prev => prev.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              ));
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                if (!firstChunkReceived) {
                  accumulatedContent = '';
                  firstChunkReceived = true;
                }
                
                accumulatedContent += parsed.token;
                
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId 
                    ? { ...msg, content: accumulatedContent, isStreaming: false }
                    : msg
                ));
              }
            } catch (e) {
              // Ignore parsing errors for non-JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isStreaming: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          
          {/* Chat Container */}
          <motion.div
            className={`
              fixed z-50 backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden flex flex-col
              ${theme === 'dark' 
                ? 'bg-gray-900/95 border-gray-700/50' 
                : 'bg-white/95 border-white/30'
              }
              ${isMobile 
                ? 'inset-4 top-16' 
                : 'right-6 bottom-24 w-96 h-[500px]'
              }
            `}
            initial={{
              opacity: 0,
              scale: 0.95,
              x: isMobile ? 0 : 50,
              y: isMobile ? 50 : 0
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              x: isMobile ? 0 : 50,
              y: isMobile ? 50 : 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.3
            }}
          >
            {/* Header */}
            <div className={`
              flex items-center justify-between p-4 border-b flex-shrink-0
              ${theme === 'dark'
                ? 'border-gray-700/50 bg-gradient-to-r from-teal-500/10 to-green-500/10'
                : 'border-white/20 bg-gradient-to-r from-teal-500/10 to-green-500/10'
              }
            `}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    AI Assistant
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-colors
                  ${theme === 'dark' 
                    ? 'hover:bg-gray-700/50 text-gray-300' 
                    : 'hover:bg-white/20 text-gray-600'
                  }
                `}
              >
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex items-start space-x-3 w-full ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.type === 'bot' && (
                      <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`
                        px-4 py-3 rounded-2xl max-w-[85%]
                        ${message.type === 'user'
                          ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white ml-auto'
                          : theme === 'dark'
                            ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700/30 text-gray-100 w-full'
                            : 'bg-white/70 backdrop-blur-sm border border-white/30 text-gray-800 w-full'
                        }
                        ${message.isStreaming && message.content === 'Braining...' ? 'animate-pulse' : ''}
                      `}
                    >
                      {message.type === 'bot' ? (
                        <ReactMarkdown 
                          className={`prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0 ${
                            theme === 'dark' ? 'prose-invert' : ''
                          }`}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            code: ({ children }) => (
                              <code className={`px-1 py-0.5 rounded text-sm ${
                                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className={`p-2 rounded-lg overflow-x-auto text-sm ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                {children}
                              </pre>
                            )
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="break-words">{message.content}</p>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                      }`}>
                        <User size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`
              p-4 border-t backdrop-blur-sm flex-shrink-0
              ${theme === 'dark'
                ? 'border-gray-700/50 bg-gray-800/40'
                : 'border-white/20 bg-white/40'
              }
            `}>
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`
                    flex-1 px-4 py-3 backdrop-blur-sm border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all
                    ${theme === 'dark'
                      ? 'bg-gray-800/80 border-gray-600/30 text-white placeholder-gray-400'
                      : 'bg-white/80 border-white/30 text-gray-900 placeholder-gray-500'
                    }
                  `}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !sessionId || isLoading}
                  className="p-3 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-xl hover:from-teal-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;