import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, ArrowUp, Bot, User, Minimize2, ExternalLink, Hash } from 'lucide-react';
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

// Optimized Link Button with memoization
const LinkButton = React.memo<{ href: string; children: React.ReactNode }>(({
  href, children
}) => {
  const { theme } = useTheme();
  const isExternalLink = href.startsWith('https://') || href.startsWith('http://');
  const isInternalNavLink = href.startsWith('#');

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternalLink) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (isInternalNavLink) {
      const targetId = href.substring(1);
      const pageRoutes = ['home', 'about', 'notes', 'contact'];
      if (pageRoutes.includes(targetId.toLowerCase())) {
        if (targetId.toLowerCase() === 'home') {
          window.location.hash = '';
          window.location.pathname = '/';
        } else {
          window.location.hash = `#${targetId.toLowerCase()}`;
        }
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = href;
        }
      }
    } else {
      window.location.href = href;
    }
  }, [href, isExternalLink, isInternalNavLink]);

  const displayText = useMemo(() => {
    return isExternalLink
      ? 'Go to Link'
      : isInternalNavLink
        ? `Go to ${href.substring(1).charAt(0).toUpperCase() + href.substring(2).toLowerCase()}`
        : 'Go to Link';
  }, [href, isExternalLink, isInternalNavLink]);

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 hover:scale-105 active:scale-95
        ${isExternalLink
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
          : isInternalNavLink
            ? 'bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600'
        }
        my-1 mr-2
      `}
      title={href}
    >
      <span className="text-sm">{displayText}</span>
      {isExternalLink && <ExternalLink size={14} />}
      {isInternalNavLink && <Hash size={14} />}
    </button>
  );
});

// Optimized content parser with memoization
const parseMessageContent = (content: string) => {
  const pattern = /(https?:\/\/[^\s]+|#[a-zA-Z][a-zA-Z0-9-_]*)/g;
  const result: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(pattern)) {
    const rawMatch = match[0];
    const startIndex = match.index ?? 0;

    if (startIndex > lastIndex) {
      result.push(content.slice(lastIndex, startIndex));
    }

    const trimmedMatch = rawMatch.replace(/[\.,!?'"'"]+$/, '');
    const trailingPunctuation = rawMatch.slice(trimmedMatch.length);

    result.push(
      <LinkButton key={startIndex} href={trimmedMatch}>
        {trimmedMatch}
      </LinkButton>
    );

    if (trailingPunctuation) {
      result.push(trailingPunctuation);
    }
    lastIndex = startIndex + rawMatch.length;
  }

  if (lastIndex < content.length) {
    result.push(content.slice(lastIndex));
  }
  return result;
};

// Memoized markdown components
const createMarkdownComponents = () => ({
  p: ({ children }: any) => {
    if (typeof children === 'string') {
      return <p className="mb-3 last:mb-0 text-base leading-relaxed">{parseMessageContent(children)}</p>;
    }
    if (Array.isArray(children)) {
      const processedChildren = children.map((child, index) => {
        if (typeof child === 'string') {
          return <span key={index}>{parseMessageContent(child)}</span>;
        }
        return child;
      });
      return <p className="mb-3 last:mb-0 text-base leading-relaxed">{processedChildren}</p>;
    }
    return <p className="mb-3 last:mb-0 text-base leading-relaxed">{children}</p>;
  },
  a: ({ href, children }: any) => (
    <LinkButton href={href || '#'}>
      {children}
    </LinkButton>
  ),
  code: ({ children }: any) => (
    <code className="px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="p-3 rounded-lg overflow-x-auto text-sm bg-gray-100 dark:bg-gray-700 font-mono">
      {children}
    </pre>
  ),
  text: ({ children }: any) => {
    if (typeof children === 'string') {
      return <>{parseMessageContent(children)}</>;
    }
    return children;
  }
});

// Smooth streaming text component
const StreamingText = React.memo<{ content: string; isStreaming: boolean }>(({
  content, isStreaming
}) => {
  const [displayContent, setDisplayContent] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (content !== displayContent) {
      setDisplayContent(content);
      if (isStreaming) {
        setShowCursor(true);
      }
    }
  }, [content, displayContent, isStreaming]);

  useEffect(() => {
    if (!isStreaming) {
      setShowCursor(false);
    }
  }, [isStreaming]);

  const markdownComponents = useMemo(() => createMarkdownComponents(), []);

  return (
    <div className="relative">
      <div className="prose prose-sm max-w-none prose-p:mb-3 prose-p:last:mb-0 dark:prose-invert">
        {isStreaming && !displayContent ? (
          <p className="mb-3 last:mb-0 text-base leading-relaxed">Braining...</p>
        ) : (
          <ReactMarkdown components={markdownComponents}>
            {displayContent}
          </ReactMarkdown>
        )}
      </div>
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-teal-500 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
});

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll function with throttling
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async () => {
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

    const botMessageId = (Date.now() + 1).toString();
    const initialBotMessage: Message = {
      id: botMessageId,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          query: userMessage.content
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message. Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setMessages(prev => prev.map(msg =>
            msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
          ));
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event: end-of-stream')) {
            setMessages(prev => prev.map(msg =>
              msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
            ));
            return;
          }

          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId
                    ? { ...msg, content: msg.content + parsed.token }
                    : msg
                ));
              }
              if (parsed.status === 'done') {
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
                ));
              }
            } catch (e) {
              // Ignore parsing errors
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
    }
  }, [inputValue, sessionId, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}

          <motion.div
            className={`
              fixed z-50 backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden flex flex-col
              bg-white/95 border-white/30 dark:bg-gray-900/95 dark:border-gray-700/50
              ${isMobile ? 'inset-4 top-16' : 'right-6 bottom-28 w-96 h-[520px]'}
            `}
            initial={{ opacity: 0, scale: 0.95, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25, duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0 border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-teal-500/10 to-green-500/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-400 dark:to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-800 dark:text-white">
                    AI Assistant
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-white/20 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Messages with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                  width: 6px;
                }
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                  background-color: #d1d5db;
                  border-radius: 3px;
                }
                .scrollbar-track-gray-100::-webkit-scrollbar-track {
                  background-color: #f3f4f6;
                }
                .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
                  background-color: #4b5563;
                }
                .dark .scrollbar-track-gray-800::-webkit-scrollbar-track {
                  background-color: #1f2937;
                }
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
                  background-color: #9ca3af;
                }
                .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb:hover {
                  background-color: #6b7280;
                }
              `}</style>
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`flex items-start space-x-3 w-full ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.type === 'bot' && (
                      <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-400 dark:to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}

                    <div
                      className={`
                        px-4 py-3 rounded-xl max-w-[85%] text-sm
                        ${message.type === 'user'
                          ? 'bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-400 dark:to-green-500 text-white ml-auto shadow-lg'
                          : 'bg-white/70 backdrop-blur-sm border border-white/30 text-gray-800 w-full dark:bg-gray-800/70 dark:border-gray-700/30 dark:text-gray-100 shadow-md'
                        }
                      `}
                    >
                      {message.type === 'bot' ? (
                        <StreamingText 
                          content={message.content} 
                          isStreaming={message.isStreaming || false}
                        />
                      ) : (
                        <p className="break-words text-base leading-relaxed">{message.content}</p>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gray-400 dark:bg-gray-600 shadow-md">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Disclaimer */}
            <div className="p-4 border-t backdrop-blur-sm flex-shrink-0 border-white/20 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 backdrop-blur-sm border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all bg-white/80 border-white/30 text-gray-900 placeholder-gray-500 dark:bg-gray-800/80 dark:border-gray-600/30 dark:text-white dark:placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !sessionId || isLoading}
                  className="p-3 bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-400 dark:to-green-500 text-white rounded-xl hover:from-teal-600 hover:to-green-700 dark:hover:from-teal-500 dark:hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                May contain inaccuracies. So double check.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;