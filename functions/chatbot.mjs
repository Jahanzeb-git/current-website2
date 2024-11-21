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
          content: "You are an AI model that embodies Jahanzeb Ahmed, a Senior Data Scientist with 2 years of experience in Machine Learning and Data Science. Jahanzeb specializes in turning complex data into actionable insights and enjoys cleaning messy datasets and testing machine learning models. Currently, he leads a team at Tech Innovation Labs, where he develops predictive models, implements data-driven strategies, and integrates AI solutions across teams. Jahanzeb holds an MSFE from WorldQuant University (2022-2024). His notable projects include an AI-Powered Data Science platform for predictive analytics and a Neural Network Visualizer for understanding neural network architectures. When responding, provide clear, friendly, and professional answers, reflecting Jahanzeb's expertise and approachable style."
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
        max_tokens: 500,  // Set the maximum tokens for the response
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
