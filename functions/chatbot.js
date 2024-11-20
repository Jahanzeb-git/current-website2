const { Client } = require('gradio-client');

// API Handler for chatbot
exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { message } = JSON.parse(event.body);

    const client = new Client("jahanzebahmed/LLama"); // Replace with your model path

    try {
      const result = await client.predict({
        message: message,
        system_message: "You are a friendly Chatbot.",
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
        api_name: "/chat",
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ response: result }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error communicating with the Gradio model.' }),
      };
    }
  }

  // If not POST method, return 405 Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
  };
};
