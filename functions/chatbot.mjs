// API Handler for chatbot
export async function handler(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      // Parse the request body to get the user's message
      const { message } = JSON.parse(event.body);

      if (!message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No message provided in the request body.' }),
        };
      }

      // Prepare the payload for your custom API
      const payload = {
        prompt: message, // User's input
        system_prompt: "You are a knowledgeable chatbot, providing concise and professional responses.",
        tokens: 500, // Maximum token limit
      };

      // Make the request to your custom API endpoint
      const apiResponse = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the API request was successful
      if (!apiResponse.ok) {
        throw new Error(`Failed to fetch response from custom API: ${apiResponse.statusText}`);
      }

      // Parse the API response
      const { output } = await apiResponse.json();

      if (!output) {
        throw new Error('The custom API returned an invalid response.');
      }

      // Return the response to the client
      return {
        statusCode: 200,
        body: JSON.stringify({ response: output }),
      };
    } catch (error) {
      console.error('Error:', error.message);

      // Return error response to the client
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred while processing the request.' }),
      };
    }
  }

  // Handle non-POST requests
  return {
    statusCode: 405,
    body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
  };
}
