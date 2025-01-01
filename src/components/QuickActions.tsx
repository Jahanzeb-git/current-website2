import React from 'react';
import { Code, Image, MessageCircle, Lightbulb, FileText, MoreHorizontal } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { icon: <Image className="w-4 h-4" />, label: 'Create image', action: 'create_image' },
    { icon: <Code className="w-4 h-4" />, label: 'Code', action: 'code' },
    { icon: <MessageCircle className="w-4 h-4" />, label: 'Get advice', action: 'get_advice' },
    { icon: <Lightbulb className="w-4 h-4" />, label: 'Brainstorm', action: 'brainstorm' },
    { icon: <FileText className="w-4 h-4" />, label: 'Summarize text', action: 'summarize' },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {actions.map(({ icon, label, action }) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {icon}
          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        </button>
      ))}
      <button className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
        <MoreHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default QuickActions;
