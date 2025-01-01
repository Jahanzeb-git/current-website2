import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
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
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from session storage
    const storedHistory = sessionStorage.getItem('chatHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSend = async (message: string) => {
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
          system_prompt: "You are an AI assistant...", // Your existing system prompt
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

      // Update history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        timestamp: new Date(),
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      sessionStorage.setItem('chatHistory', JSON.stringify([newHistoryItem, ...history]));

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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHistory
        history={history}
        onSelectChat={setSelectedChat}
        selectedId={selectedChat}
      />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isInitialView ? (
            <div className="text-center mt-32">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                What can I help with?
              </h1>
              <QuickActions onAction={handleQuickAction} />
            </div>
          ) : (
            <div ref={chatContainerRef} className="space-y-4">
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
        
        <div className="p-4 border-t dark:border-gray-800">
          <ChatInput onSend={handleSend} isInitial={isInitialView} />
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
