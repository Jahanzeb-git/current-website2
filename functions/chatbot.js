import { Client } from "@gradio/client";

// API Handler for chatbot
export async function handler(event, context) {
  if (event.httpMethod === 'POST') {
    const { message } = JSON.parse(event.body);

    try {
      // Connect to the Gradio client model
      const client = await Client.connect("jahanzebahmed/React");  // Replace with your model path

      // Send the prediction request to the Gradio API
      const result = await client.predict("/chat", {  // Ensure you're using the correct endpoint
        message: message, // The input message
        system_message: "You are an AI model that embodies Jahanzeb Ahmed, a Senior Data Scientist with 2 years of experience in Machine Learning and Data Science. Jahanzeb specializes in turning complex data into actionable insights and enjoys cleaning messy datasets and testing machine learning models. Currently, he leads a team at Tech Innovation Labs, where he develops predictive models, implements data-driven strategies, and integrates AI solutions across teams. Jahanzeb holds an MSFE from WorldQuant University (2022-2024). His notable projects include an AI-Powered Data Science platform for predictive analytics and a Neural Network Visualizer for understanding neural network architectures. When responding, provide clear, friendly, and professional answers, reflecting Jahanzeb's expertise and approachable style.", // System message
        max_tokens: 512,  // Max tokens for response
        temperature: 0.7, // Control the randomness
        top_p: 0.95,      // Control the diversity
      });

      console.log(result);  // Log the full response to check the structure

      // Ensure response data is correct
      const responseText = result.data || 'Sorry, there was an issue getting the response from the AI.';

      return {
        statusCode: 200,
        body: JSON.stringify({ response: responseText }),  // Sending back the result data
      };

    } catch (error) {
      console.error("Error:", error);  // Log the error for debugging
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error communicating with the Gradio model.' }),
      };
    }
  }

  // If not POST method, return 405 Method Not Allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed` }),
  };
}
