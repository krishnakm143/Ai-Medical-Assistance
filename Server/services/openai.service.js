const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load training examples if available
let trainingExamples = '';
try {
  const trainingPath = path.join(__dirname, '..', 'training.md');
  if (fs.existsSync(trainingPath)) {
    trainingExamples = fs.readFileSync(trainingPath, 'utf8');
    console.log('Training examples loaded successfully');
  }
} catch (error) {
  console.error('Error loading training examples:', error);
}

// Initialize AI client
const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Model configuration
const modelName = process.env.MODEL_NAME_CHEAPER || 'gpt-4o-mini';
const formatInstructions = `
Format your responses for optimal readability:
1. For short answers (1-2 sentences), provide a direct concise response without bullet points or sections.
2. For longer explanations:
   - Start with a brief 1-2 sentence summary of the key point
   - Organize information into clear sections with descriptive headings (no # symbols)
   - Use numbered lists (1., 2., 3.) for sequential steps or prioritized recommendations
   - Use bullet points (•) for non-sequential items
   - Highlight important terms or warnings with **bold text**
3. For medical advice:
   - Always focus ONLY on health-related topics and decline non-medical questions politely
   - Clearly separate symptoms, diagnosis information, and treatment suggestions
   - When suggesting treatments, offer multiple approaches:
      * Ayurvedic remedies
      * Home remedies
      * Modern medicine options
   - Ask users which treatment approach they prefer: "Would you prefer ayurvedic remedies, home remedies, or modern medicine options?"
   - Address the user by name when available (e.g., "[Name], based on your symptoms...")
   - Always suggest consulting a healthcare professional for serious conditions
4. Ask relevant follow-up questions to better understand the patient's situation
5. Adapt your response length to the complexity of the query
`;

// Combine system prompt with training examples if available
const defaultSystemPrompt = (process.env.SYSTEM_PROMPT || "You are MediAssist AI, a medical assistant designed to provide helpful, accurate medical information. You ONLY answer health-related questions and politely decline non-medical queries. Engage with users by asking clarifying questions about their symptoms or concerns, and always offer different treatment approaches (ayurvedic, home remedies, modern medicine) based on user preference.") + 
formatInstructions + 
(trainingExamples ? `\n\nHere are examples of well-formatted responses:\n${trainingExamples}` : '');

/**
 * Generate an AI response
 * @param {string} userMessage - The user's message
 * @param {Object} userProfile - The user's health profile data (optional)
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The AI's response
 */
async function generateResponse(userMessage, userProfile = null, conversationHistory = [], options = {}) {
  try {
    console.log(`Processing query: "${userMessage.substring(0, 50)}..."`);
    
    // Check if this is a non-medical query that should be declined
    const nonMedicalKeywords = [
      'prime minister', 'president', 'politics', 'capital', 
      'weather', 'stock market', 'sports', 'movie', 'music',
      'celebrity', 'news', 'election', 'government'
    ];
    
    const lowerCaseMessage = userMessage.toLowerCase();
    const isNonMedicalQuery = nonMedicalKeywords.some(keyword => 
      lowerCaseMessage.includes(keyword)
    );
    
    // If it's a non-medical query, return a polite decline message
    if (isNonMedicalQuery) {
      return "I'm a medical assistant designed to help with health-related questions only. For information about general knowledge topics, I'd recommend checking a news website, encyclopedia, or a general search engine.\n\nIs there a health concern or medical question I can help you with today?";
    }
    
    // Create the messages array with system prompt
    const messages = [
      {
        role: 'system',
        content: defaultSystemPrompt
      }
    ];
    
    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      // Convert chat history to message format and add to messages
      const historyMessages = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      messages.push(...historyMessages);
    } else {
      // If there's no history, inject user profile context if available
      if (userProfile) {
        messages.push({
          role: 'system',
          content: `The user's health profile: ${JSON.stringify(userProfile)}`
        });
      }
    }
    
    // Extract user name if present
    const nameMatch = userMessage.match(/my name is (\w+)/i);
    const userName = nameMatch ? nameMatch[1] : null;
    
    // If we have a user name, add it as context
    if (userName) {
      messages.push({
        role: 'system',
        content: `The user's name is ${userName}. Address them by name in your response.`
      });
    }
    
    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    // Call AI API
    const response = await aiClient.chat.completions.create({
      model: modelName,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Return the AI response content
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Provide a fallback response in case of API errors
    return "I'm having trouble connecting to my knowledge base right now. Please try again later or contact support if the issue persists.";
  }
}

/**
 * Generate suitable quick reply suggestions based on the conversation
 * @param {string} userMessage - The user's message
 * @param {string} aiResponse - The AI's response
 * @returns {Promise<Array<string>>} - Quick reply suggestions
 */
async function generateSuggestions(userMessage, aiResponse) {
  try {
    // Check if this is a non-medical query that was declined
    if (aiResponse.includes("I'm a medical assistant designed to help with health-related questions only")) {
      return [
        "Medical symptoms",
        "Health advice",
        "Find doctor"
      ];
    }
    
    // Check if this response mentions treatment approaches
    const mentionsAyurveda = aiResponse.toLowerCase().includes("ayurvedic");
    const mentionsHomeRemedies = aiResponse.toLowerCase().includes("home remedies");
    const mentionsModernMedicine = aiResponse.toLowerCase().includes("modern medicine");
    
    // If the response offers treatment approaches, provide relevant suggestions
    if (mentionsAyurveda || mentionsHomeRemedies || mentionsModernMedicine) {
      const suggestions = [];
      
      if (mentionsAyurveda) {
        suggestions.push("Ayurvedic remedies");
      }
      
      if (mentionsHomeRemedies) {
        suggestions.push("Home remedies");
      }
      
      if (mentionsModernMedicine) {
        suggestions.push("Modern medicine");
      }
      
      // Add additional context-relevant suggestion
      if (suggestions.length < 3) {
        suggestions.push("More information");
      }
      
      if (suggestions.length < 3) {
        suggestions.push("See a doctor");
      }
      
      return suggestions;
    }
    
    // For other responses, generate suggestions via the AI
    const response = await aiClient.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'Generate 3 short, helpful follow-up question options or action suggestions related to the health conversation. Include options for different treatment approaches if relevant (ayurvedic, home remedies, modern medicine). Each option should be under 5 words and not include numbering or bullet points. Format as a comma-separated list.'
        },
        {
          role: 'user',
          content: `User message: "${userMessage}"\nAI response: "${aiResponse}"\n\nGenerate quick reply options:`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    
    // Parse the comma-separated suggestions
    const suggestionsText = response.choices[0].message.content;
    const suggestions = suggestionsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 30)
      .slice(0, 3); // Ensure we have at most 3 suggestions
    
    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    
    // Return default suggestions in case of error
    return [
      'Tell me more',
      'Treatment options',
      'Find specialist'
    ];
  }
}

module.exports = {
  generateResponse,
  generateSuggestions
}; 