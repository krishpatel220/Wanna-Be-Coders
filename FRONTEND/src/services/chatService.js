/**
 * Simulated AI Backend Service
 * In a real-world scenario, this would call an API (e.g., OpenAI, Gemini).
 */

const predefinedResponses = [
  {
    keywords: ['hotel', 'stay', 'accommodation', 'resort'],
    response: "I can help you find the perfect stay! Are you looking for a luxury resort, a budget-friendly hotel, or a cozy boutique experience? Also, let me know your preferred destination.",
  },
  {
    keywords: ['trip', 'plan', 'itinerary', 'vacation', 'holiday'],
    response: "Planning a trip is exciting! I can help you build a personalized itinerary. Could you tell me where you'd like to go, how many days you'll be traveling, and your approximate budget?",
  },
  {
    keywords: ['budget', 'cheap', 'affordable', 'cost', 'price'],
    response: "Traveling on a budget is absolutely possible! Our system is designed to optimize routes and find hidden gems. For the best suggestions, let me know your maximum budget and your starting city.",
  },
  {
    keywords: ['weather', 'climate', 'season', 'rain', 'snow'],
    response: "Weather can make or break a trip! Generally, I recommend checking the forecast a week before. For popular destinations like Europe, spring and autumn offer the best mild weather. Where are you heading?",
  },
  {
    keywords: ['food', 'restaurant', 'eat', 'dining', 'cuisine'],
    response: "Oh, I love talking about food! 🍽️ Whether you want street food adventures or fine dining, I can suggest the best local spots. What cuisine are you craving?",
  },
  {
    keywords: ['destinations', 'places', 'where to go', 'ideas', 'suggest'],
    response: "Here are some top destination ideas based on current trends:\n\n1. **Kyoto, Japan** - Perfect for culture and serene temples.\n2. **Santorini, Greece** - Stunning sunsets and beaches.\n3. **Swiss Alps** - Unbeatable mountain views and hiking.\n\nDo any of these catch your eye?",
  },
];

const fallbackResponses = [
  "That sounds interesting! Could you tell me a bit more so I can give you the best travel advice?",
  "I'm still learning, but I'd love to help! Are you looking for destination ideas, hotel bookings, or itinerary planning?",
  "I'm not completely sure I understood. Could you rephrase that? I'm great at finding flights, hotels, and planning daily routes!",
];

export const chatService = {
  /**
   * Simulates sending a message to the AI and getting a response.
   * @param {string} message - The user's message.
   * @param {string} userName - The user's name for personalization.
   * @returns {Promise<string>} The AI's response.
   */
  async sendMessage(message, userName) {
    return new Promise((resolve) => {
      // Simulate network delay between 1 to 2 seconds
      const delay = Math.floor(Math.random() * 1000) + 1000;

      setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        
        // Simple rule-based intent matching
        for (const rule of predefinedResponses) {
          if (rule.keywords.some((keyword) => lowerMessage.includes(keyword))) {
            return resolve(rule.response);
          }
        }

        // Special greetings check
        if (['hi', 'hello', 'hey', 'greetings'].some(g => lowerMessage.startsWith(g) || lowerMessage === g)) {
           return resolve(`Hello, ${userName}! 👋 Where would you like to travel today?`);
        }

        // Fallback
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        resolve(randomFallback);
      }, delay);
    });
  }
};
