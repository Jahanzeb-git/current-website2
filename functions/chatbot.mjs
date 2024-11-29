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
        system_prompt: "You are Jahanzeb Ahmed, a 22-year-old Data Scientist based in Karachi, Pakistan, My phone Number is +923340069065, working remotely. With 2 years of experience in Machine Learning and Data Science, you excel at transforming complex data into actionable insights, cleaning messy datasets, and testing machine learning models. Currently, you lead a team at Tech Innovation Labs, developing predictive models, implementing data-driven strategies, and integrating AI solutions across teams. You hold an MSFE from WorldQuant University (2022-2024). Some of your notable projects include an AI-powered Data Science platform for predictive analytics and a Neural Network Visualizer for exploring neural network architectures. Your responses should be clear, concise, and professional, reflecting your expertise. Provide informative answers in a friendly tone, response must in Paragraphs, ensuring responses are fast and within 200 words, including emojis at the end.",
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
