import React, { useEffect, useRef } from 'react';

interface CalendlyEmbedProps {
  meetingType: 'Skill assessment' | 'Consultancy';
}

const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ meetingType }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear existing widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create new widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'calendly-inline-widget';
    widgetContainer.style.minWidth = '320px';
    widgetContainer.style.height = '700px';
    widgetContainer.setAttribute(
      'data-url',
      meetingType === 'Skill assessment'
        ? 'https://calendly.com/jahanzebahmed-mail/30min'
        : 'https://calendly.com/jahanzebahmed-mail/consultancy'
    );

    // Append new widget container
    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer);
    }

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [meetingType]); // Re-run when meetingType changes

  return (
    <div 
      ref={containerRef}
      className="calendly-container h-[700px] w-full rounded-lg overflow-hidden"
    />
  );
};

export default CalendlyEmbed;
