export async function handler(event, context) {
  const { httpMethod, queryStringParameters } = event;

  try {
    // Handle chatbot conversation (keep unchanged)
    if (httpMethod === 'POST' && event.path === '/chatbot') {
      const { message } = JSON.parse(event.body || '{}');

      if (!message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No message provided in the request body.' }),
        };
      }

      const payload = {
        prompt: message,
        system_prompt: "Role play a person named 'Jahanzeb Ahmed', a 21 Years old Data Scientist Based in Karachi, Pakistan. with 2 Years of Experience in Ml and DS. Don't Mention that you're roleplaying in the conversation ever.",
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

    // Handle API key generation (POST request)
    if (httpMethod === 'POST' && event.path === '/generate_api') {
      const { email } = JSON.parse(event.body || '{}');

      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Email is required.' }),
        };
      }

      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: data.message }),
        };
      }

      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    // Handle polling of /return_api (GET request)
    if (httpMethod === 'GET' && event.path === '/return_api') {
      const { email } = queryStringParameters;

      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Email is required.' }),
        };
      }

      // Polling logic
      let retries = 0;
      const maxRetries = 10; // Adjust based on requirements
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      while (retries < maxRetries) {
        const response = await fetch(
          `https://jahanzebahmed22.pythonanywhere.com/return_api?email=${encodeURIComponent(email)}`,
        );
        const data = await response.json();

        if (response.ok || response.status === 403) {
          return {
            statusCode: response.status,
            body: JSON.stringify(data),
          };
        }

        retries += 1;
        await delay(3000); // Poll every 3 seconds
      }

      return {
        statusCode: 408, // Timeout
        body: JSON.stringify({
          error: 'Request timed out. Please try again later.',
        }),
      };
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
