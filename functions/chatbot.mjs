export async function handler(event) {
  const { httpMethod, queryStringParameters } = event;

  try {
    // Handle chatbot conversation
    if (httpMethod === "POST") {
      const { message, previousContext } = JSON.parse(event.body || "{}");

      if (!message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No message provided in the request body." }),
        };
      }

      // Generate dynamic system prompt
      const contextMessages = previousContext?.slice(-5) || [];
      const contextString = contextMessages
        .map((msg) => msg.replace("You:", "user:").replace("Bot:", "you:"))
        .join(", ");

      const systemPrompt = `
        Roleplay a person named 'Jahanzeb Ahmed', a 22-year-old Data Scientist based in Karachi, Pakistan.
        (Previous conversational context: ${contextString || "No context yet."})
        Note: Use previous conversational context to understand the user's query and provide relevant answers. 
        Important: Always use the latest context for follow-up questions if needed.
      `;

      // Prepare payload for the custom API
      const payload = {
        prompt: message,
        system_prompt: systemPrompt,
        tokens: 200,
      };

      // Make a request to the custom endpoint
      const response = await fetch("https://jahanzebahmed22.pythonanywhere.com/app_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    console.error("Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
}

