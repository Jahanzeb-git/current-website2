import React, { useState } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatInterface from './ChatInterface';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // The session ID is now held only in the component's state.
  // It will be null initially and will be wiped on a page refresh.
  const [sessionId, setSessionId] = useState<string | null>(null);

  // This function is now only called when absolutely necessary.
  const createSession = async () => {
    try {
      console.log('Requesting /session Endpoint! Creating new session...');
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      const newSessionId = data.session_id;
      
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const handleToggleChat = async () => {
    // If the chat is opening AND a session does not already exist for this visit...
    if (!isOpen && !sessionId) {
      // ...then create one.
      await createSession();
    }
    setIsOpen(!isOpen);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <FloatingChatButton 
        isOpen={isOpen} 
        onClick={handleToggleChat}
      />
      
      <ChatInterface 
        isOpen={isOpen} 
        onClose={handleCloseChat}
        sessionId={sessionId}
      />
    </>
  );
};

export default ChatBot;