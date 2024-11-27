import React, { useState } from 'react';

const SimpleChatbot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const payload = {
      prompt: input.trim(),
      system_prompt: 'You are Engineer.',
      tokens: 500,
    };

    try {
      const res = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response from the API');
      }

      const data = await res.json();
      setResponse(data.output || 'Sorry, there was an error.');
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setResponse('Bot: Sorry, something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Simple Chatbot Test</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px 20px' }}>
        Send
      </button>
      {response && <div style={{ marginTop: '20px' }}>{response}</div>}
    </div>
  );
};

export default SimpleChatbot;
