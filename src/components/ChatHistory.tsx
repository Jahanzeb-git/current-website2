import React from 'react';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  history: HistoryItem[];
  onSelectChat: (id: string) => void;
  selectedId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history, onSelectChat, selectedId }) => {
  const groupedHistory = history.reduce((acc, item) => {
    const date = format(item.timestamp, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const getDateLabel = (date: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    switch (date) {
      case today:
        return 'Today';
      case yesterday:
        return 'Yesterday';
      default:
        return format(new Date(date), 'MMMM d');
    }
  };

  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
      {Object.entries(groupedHistory).map(([date, items]) => (
        <div key={date} className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {getDateLabel(date)}
          </h3>
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectChat(item.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedId === item.id
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
