import React, { useState } from 'react';
import { Book, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CalendlyEmbed from '../components/CalendlyEmbed';

const Assessment = () => {
  const [selectedMeetingType, setSelectedMeetingType] = useState<'Skill assessment' | 'Consultancy'>('Skill assessment');
  const { theme } = useTheme();

  const meetingTypes = [
    {
      id: 'skill',
      title: 'Skill assessment',
      icon: Book,
      description: 'Book a meeting to assess your skills and receive personalized feedback from our experts.',
      duration: '30 minutes'
    },
    {
      id: 'consultancy',
      title: 'Consultancy',
      icon: Briefcase,
      description: 'Get professional consultancy tailored to your specific needs and challenges.',
      duration: '60 minutes'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Book Your Session
        </h2>
        <p className={`text-xl mb-8 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Choose between a skill assessment or consultancy session
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {meetingTypes.map(({ id, title, icon: Icon, description, duration }) => (
          <div
            key={id}
            onClick={() => setSelectedMeetingType(title as 'Skill assessment' | 'Consultancy')}
            className={`relative cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              selectedMeetingType === title
                ? theme === 'dark'
                  ? 'bg-blue-900 border-2 border-blue-500'
                  : 'bg-blue-50 border-2 border-blue-500'
                : theme === 'dark'
                ? 'bg-gray-800 border-2 border-transparent hover:border-blue-400'
                : 'bg-white border-2 border-transparent hover:border-blue-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedMeetingType === title
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {title}
                </h3>
                <p className={`text-sm mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {description}
                </p>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Duration: {duration}
                </span>
              </div>
            </div>
            {selectedMeetingType === title && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-blue-500 text-white p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Schedule Your {selectedMeetingType}
          </h3>
        </div>
        <CalendlyEmbed meetingType={selectedMeetingType} />
      </div>
    </div>
  );
};

export default Assessment;

