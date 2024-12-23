import React, { useState } from 'react';
import { Book, Briefcase, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Assessment = () => {
  const [selectedMeetingType, setSelectedMeetingType] = useState('Skill assessment');
  const { theme } = useTheme();

  const handleMeetingTypeChange = (type) => setSelectedMeetingType(type);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Assess Skill or need consultancy?
        </h2>
        <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Book a one-to-one meeting for skill assessment or consultancy.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative flex space-x-4">
          <div
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 p-2 rounded ${
              selectedMeetingType === 'Skill assessment' 
                ? theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-gray-900' 
                : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            onClick={() => handleMeetingTypeChange('Skill assessment')}
          >
            <Book className="w-6 h-6" />
            <span>Skill assessment</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 p-2 rounded ${
              selectedMeetingType === 'Consultancy' 
                ? theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-gray-900' 
                : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            onClick={() => handleMeetingTypeChange('Consultancy')}
          >
            <Briefcase className="w-6 h-6" />
            <span>Consultancy</span>
          </div>
          <ChevronDown 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer" 
            color={theme === 'dark' ? '#B8B8B8' : '#4A4A4A'} 
          />
        </div>

        <div className="transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Selected: {selectedMeetingType}
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {selectedMeetingType === 'Skill assessment'
              ? 'Book a meeting to assess your skills and receive personalized feedback.'
              : 'Need professional consultancy? Book a one-to-one session to discuss your needs.'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
          <div 
            dangerouslySetInnerHTML={{
              __html: `
                <!-- Calendly inline widget begin -->
                <div class="calendly-inline-widget" data-url="https://calendly.com/jahanzebahmed-mail/consultancy" style="min-width:320px;height:700px;"></div>
                <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
                <!-- Calendly inline widget end -->
              `
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Assessment;

