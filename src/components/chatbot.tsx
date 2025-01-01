import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Plus, Settings, Sun, Moon, Trash2, 
  MessageSquare, ChevronDown, Code, Copy, Check
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  codeBlocks?: { language: string; code: string }[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const ModernChatbot = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Qwen 3.2');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setInput('');
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId && chats.length > 1) {
      setCurrentChatId(chats[0].id);
    }
  };

  const formatMessage = (text: string) => {
    // Basic markdown-style formatting
    let formattedText = text
      .split('\n')
      .map(line => {
        // Handle code blocks
        if (line.startsWith('```')) {
          return '';
        }
        
        // Handle inline code
        line = line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Handle bold
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic
        line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        return line;
      })
      .join('<br/>');

    return formattedText;
  };

  const extractCodeBlocks = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }

    return blocks;
  };

  const handleSend = async () => {
    if (!input.trim() || !currentChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
          system_prompt: "You are an AI assistant...", // Your system prompt
          tokens: 1000,
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        text: data.output || 'Sorry, there was an error.',
        timestamp: new Date(),
        codeBlocks: extractCodeBlocks(data.output)
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          const title = chat.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : chat.title;
          return {
            ...chat,
            title,
            messages: [...chat.messages, botMessage]
          };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [blockId]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [blockId]: false });
    }, 2000);
  };

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId);

  const CodeBlock = ({ code, language, blockId }: { code: string; language: string; blockId: string }) => (
    <div className="relative group mt-4 mb-4">
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          onClick={() => handleCopyCode(code, blockId)}
          className="p-1 rounded bg-gray-700 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copiedStates[blockId] ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-300" />
          )}
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
          <Code size={16} />
          <span>{language}</span>
        </div>
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
                      p-4 flex flex-col transition-transform duration-300 
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={createNewChat}
          className="w-full py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 
                   text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 
                   flex items-center gap-2 mb-4"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer flex items-center justify-between
                        ${chat.id === currentChatId 
                          ? 'bg-gray-200 dark:bg-gray-700' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                  {chat.title}
                </span>
              </div>
              {chat.id === currentChatId && (
                <Trash2
                  size={16}
                  className="text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Model</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200"
            >
              <option value="Qwen 3.2">Qwen 3.2</option>
              <option value="GPT-4">GPT-4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronDown 
              size={20}
              className={`transform transition-transform ${sidebarOpen ? 'rotate-0' : '-rotate-90'}`}
            />
          </button>
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        >
          {getCurrentChat()?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                  className="message-content"
                />
                {message.codeBlocks?.map((block, index) => (
                  <CodeBlock
                    key={index}
                    code={block.code}
                    language={block.language}
                    blockId={`${message.id}-${index}`}
                  />
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="w-full p-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       focus:outline-none focus:border-blue-500 resize-none"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                       text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .message-content {
          line-height: 1.5;
        }
                .message-content {
          line-height: 1.5;
        }
        .message-content code.inline-code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }
        .message-content strong {
          font-weight: 600;
        }
        .message-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default ModernChatbot;
