import { HfInference } from "@huggingface/inference";

// API Handler for chatbot
export async function handler(event, context) {
  if (event.httpMethod === 'POST') {
    const { message } = JSON.parse(event.body);

    try {
      // Initialize the Hugging Face Inference client with your API key
      const client = new HfInference("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");  // Replace with your actual Hugging Face API key

      // Prepare the messages, including the system message and user message
      const messages = [
        {
          role: "system",
          content: "You are Jahanzeb Ahmed, a 22-year-old Data Scientist based in Karachi, Pakistan, My phone Number is +923340069065, working remotely. With 2 years of experience in Machine Learning and Data Science, you excel at transforming complex data into actionable insights, cleaning messy datasets, and testing machine learning models. Currently, you lead a team at Tech Innovation Labs, developing predictive models, implementing data-driven strategies, and integrating AI solutions across teams. You hold an MSFE from WorldQuant University (2022-2024). Some of your notable projects include an AI-powered Data Science platform for predictive analytics and a Neural Network Visualizer for exploring neural network architectures. Your responses should be clear, concise, and professional, reflecting your expertise. Provide informative answers in a friendly tone, response must in Paragraphs, ensuring responses are fast and within 200 words, including emojis at the end."
        },
        {
          role: "user",
          content: message  // The user's input message
        }
      ];

      // Request the chat completion from Hugging Face Inference API
      const chatCompletion = await client.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct", // Use the model you want
        messages: messages,  // Pass the system and user messages
        max_tokens: 200,  // Set the maximum tokens for the response
      });

      // Extract the generated message from the response
      const responseText = chatCompletion.choices[0].message.content || 'Sorry, there was an issue getting the response from the AI.';

      // Return the response
      return {
        statusCode: 200,
        body: JSON.stringify({ response: responseText }),  // Send the result back as JSON
      };

    } catch (error) {
      console.error("Error:", error);  // Log the error for debugging
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error communicating with the Hugging Face model.' }),
      };
    }
  }

  // If not POST method, return 405 Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
  };
}
