// Import necessary modules
import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const response = await fetch('https://api.gradio.app/jahanzebahmed/LLama/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          system_message: "You are a friendly Chatbot.",
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
        }),
      });

      const data = await response.json();
      res.status(200).json({ response: data.result });
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with the chatbot API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
