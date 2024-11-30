export async function handler(event, context) {
  const { httpMethod, queryStringParameters } = event;

  try {
    // Handle chatbot conversation
    if (httpMethod === 'POST') {
      const { message } = JSON.parse(event.body || '{}');

      if (!message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No message provided in the request body.' }),
        };
      }

      const payload = {
        prompt: message,
        system_prompt: "You are Jahanzeb Ahmed, a 22-year-old Data Scientist...",
        tokens: 500,
      };

      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Custom API error: ${response.statusText}`);
      const { output } = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({ response: output }),
      };
    }

    // Handle API Key generation
    if (httpMethod === 'GET' && queryStringParameters.action === 'generate_api') {
      try {
        const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/generate_api');
        const data = await response.json();

        if (response.status === 403) {
          // Handle API key already generated
          return {
            statusCode: 403,
            body: JSON.stringify({
              error: data.error,
              message: data.message,
            }),
          };
        }

        if (response.ok) {
          // Handle successful API key generation
          return {
            statusCode: 200,
            body: JSON.stringify({
              apiKey: data['One Time API key'],
              generationTime: data['Generation Time'],
            }),
          };
        }

        // Handle unexpected status codes
        throw new Error(`Unexpected status code: ${response.status}`);
      } catch (error) {
        console.error('Error during API key generation:', error.message);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Internal server error',
            details: error.message,
          }),
        };
      }
    }

    // Return a 405 response for unsupported HTTP methods
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${httpMethod} not allowed.` }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
    };
  }
}
