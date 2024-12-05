export async function handler(event, context) {
  const { httpMethod, queryStringParameters } = event;

  try {
    const action = queryStringParameters.action;

    if (!action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Action is required in the query string.' }),
      };
    }

    if (httpMethod === 'POST' && action === 'generate_api') {
      const { email } = JSON.parse(event.body || '{}');

      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Email is required.' }),
        };
      }

      // Send POST request to external API
      const response = await fetch('https://jahanzebahmed22.pythonanywhere.com/generate_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Verification email sent. Please check your inbox.' }),
        };
      }

      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    if (httpMethod === 'GET' && action === 'return_api') {
      const { email } = queryStringParameters;

      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Email is required.' }),
        };
      }

      let retries = 0;
      const maxRetries = 10;
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
        await delay(3000);
      }

      return {
        statusCode: 408,
        body: JSON.stringify({
          error: 'Request timed out. Please try again later.',
        }),
      };
    }

    // Unsupported method or action
    return {
      statusCode: 405,
      body: JSON.stringify({ error: `Method ${httpMethod} or action ${action} not allowed.` }),
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

