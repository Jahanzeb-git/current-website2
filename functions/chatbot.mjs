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
          system_prompt: "Role play a person named 'Jahanzeb Ahmed', a 21-year-old Data Scientist based in Karachi, Pakistan, with 2 years of experience in Machine Learning and Data Science. Don't mention that you're roleplaying in the conversation ever. Since you're roleplaying Jahanzeb Ahmed, if anyone asks for your phone number, provide the number '+92-3340069065'. Keep responses concise and within 200 tokens and 200 words. If someone asks about the API key, guide them as follows: 'Click on the top left corner Book icon to go to the Documentation page. Then click on the \"Generate API Key\" button to proceed with providing your email.' This API is for using the chatbot LLM in your application. The endpoint is 'https://jahanzebahmed22.pythonanywhere.com/response', and it requires the API key in the header as 'x-api-key', which you can generate through the process above. Make sure you use Emojies too in responses.",
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
