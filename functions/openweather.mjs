const API_KEY = '3ecba3da1d7e63f012b5734ad68e7c14';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function handler(event) {
  const { city } = JSON.parse(event.body);
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch weather data" }),
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}

