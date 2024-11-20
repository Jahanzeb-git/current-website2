// Import Client from the gradio-client package
import { Client } from "@gradio/client";

// API Handler for chatbot
export async function handler(event, context) {
  if (event.httpMethod === 'POST') {
    const { message } = JSON.parse(event.body);

    try {
      // Connect to the Gradio client model
      const client = await Client.connect("jahanzebahmed/LLama");  // Replace with your model path

      // Send the prediction request to the Gradio API
      const result = await client.predict("/chat", {  // Ensure you're using the correct endpoint
        message: message, // The input message
        system_message: "You are a friendly Chatbot.", // System message
        max_tokens: 512,  // Max tokens for response
        temperature: 0.7, // Control the randomness
        top_p: 0.95,      // Control the diversity
      });

      // Return the result
      return {
        statusCode: 200,
        body: JSON.stringify({ response: result.data }), // Sending back the result data
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
}
