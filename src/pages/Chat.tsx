import React, { useState, useEffect, useRef } from 'react';
import ChatInput from '../components/ChatInput';
import ChatHistory from '../components/ChatHistory';
import QuickActions from '../components/QuickActions';
import { Message, HistoryItem } from '../types';
import { formatDate, serializeDate, deserializeHistory } from '../utils/date';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedHistory = deserializeHistory(sessionStorage.getItem('chatHistory'));
    setHistory(storedHistory);
  }, []);

  const handleSend = async (message: string) => {
    setIsInitialView(false);
    setLoading(true);

    const newMessage: Message = {
      type: 'user',
      text: message,
      timestamp: serializeDate(new Date())
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
        timestamp: serializeDate(new Date())
      };

      setMessages((prev) => [...prev, botMessage]);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        timestamp: serializeDate(new Date())
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      sessionStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Sorry, something went wrong.',
          timestamp: serializeDate(new Date())
        },
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
    <div className="flex h-screen overflow-hidden">
      <ChatHistory
        history={history}
        onSelectChat={setSelectedChat}
        selectedId={selectedChat}
        onStartNewChat={() => {
          setMessages([]);
          setSelectedChat(undefined);
        }}
        onToggleHistory={toggleHistory}
        isHistoryOpen={isHistoryOpen}
      />
      <main className="flex-1 flex flex-col relative">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {isInitialView ? (
            <div className="text-center mt-32">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                What can I help with?
              </h1>
              <QuickActions onAction={handleQuickAction} />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDate(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="animate-pulse flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 shadow-lg">
          <ChatInput onSend={handleSend} isInitial={isInitialView} />
        </div>
      </main>
    </div>
  );
};

export default Chatbot;


