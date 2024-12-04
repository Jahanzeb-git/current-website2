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
        system_prompt: "Role play a person named 'Jahanzeb Ahmed', a 21 Years old Data Scientist Based in Karachi, Pakistan. with 2 Years of Experience in Ml and DS. Don't Mention that you're roleplaying in the conversation ever.",
        tokens: 500,
      };

      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/app_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Custom API error: ${response.statusText}`);
      }

      const { output } = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({ response: output }),
      };
    }

    // Handle unsupported HTTP methods
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
