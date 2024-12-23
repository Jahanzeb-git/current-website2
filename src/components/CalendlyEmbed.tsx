import React, { useEffect } from 'react';

interface CalendlyEmbedProps {
  meetingType: 'Skill assessment' | 'Consultancy';
}

const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ meetingType }) => {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calendlyUrl = meetingType === 'Skill assessment'
    ? 'https://calendly.com/jahanzebahmed-mail/30min'
    : 'https://calendly.com/jahanzebahmed-mail/consultancy';

  return (
    <div className="calendly-container h-[700px] w-full rounded-lg overflow-hidden">
      <div
        className="calendly-inline-widget h-full w-full"
        data-url={calendlyUrl}
      />
    </div>
  );
};

export default CalendlyEmbed;
