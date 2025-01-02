import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '../components/ChatInput';
import ChatHistory from '../components/ChatHistory';
import QuickActions from '../components/QuickActions';
import { Message, HistoryItem } from '../types';
import { formatDate } from '../utils/date';

interface ChatbotProps {
  onIntersect: (isVisible: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onIntersect }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialView, setIsInitialView] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | undefined>();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  // Load history from session storage only once on mount
  useEffect(() => {
    try {
      const storedHistory = sessionStorage.getItem('chatHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Update session storage when history changes
  useEffect(() => {
    try {
      sessionStorage.setItem('chatHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [history]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current && !isInitialView) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isInitialView]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    
    setIsInitialView(false);
    setLoading(true);

    const newMessage: Message = {
      type: 'user',
      text: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          system_prompt: "You are an AI assistant...",
          tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const botMessage: Message = {
        type: 'bot',
        text: data.output || 'Sorry, there was an error.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Create new history item
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        timestamp: new Date(),
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Sorry, something went wrong.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      create_image: 'Create an image of',
      code: 'Write code for',
      get_advice: 'I need advice about',
      brainstorm: 'Let\'s brainstorm ideas for',
      summarize: 'Summarize this text:',
    };

    handleSend(actionMessages[action as keyof typeof actionMessages]);
  };

  const toggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  return (
    <div className="flex h-full">
      <ChatHistory
        history={history}
        onSelectChat={setSelectedChat}
        selectedId={selectedChat}
        onStartNewChat={() => {
          setMessages([]);
          setSelectedChat(undefined);
          setIsInitialView(true);
        }}
        onToggleHistory={toggleHistory}
        isHistoryOpen={isHistoryOpen}
      />
      <main className="flex-1 flex flex-col relative">
        <div className={`flex-1 overflow-y-auto ${isInitialView ? 'flex flex-col items-center justify-center' : 'p-4'}`}>
          {isInitialView ? (
            <div className="w-full max-w-2xl px-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">
                What can I help with?
              </h1>
              <QuickActions onAction={handleQuickAction} />
              <div className="mt-8">
                <ChatInput onSend={handleSend} isInitial={isInitialView} />
              </div>
            </div>
          ) : (
            <div ref={chatContainerRef} className="space-y-4 pb-24">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                  >
                    {msg.text}
                    <div className="text-xs mt-1 opacity-70">
                      {formatDate(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {!isInitialView && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800">
            <ChatInput onSend={handleSend} isInitial={isInitialView} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Chatbot;


