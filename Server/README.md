# MediAssist Server

This is the backend server for the MediAssist application, providing API endpoints for chat management and persistence with AI-powered responses.

## Features

- User authentication
- Chat conversation management
- Message persistence in MongoDB
- RESTful API endpoints
- AI-powered medical assistant
- Dynamic response generation based on user health profiles
- Automatic conversation suggestions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- API key for AI service

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your API key and other configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/signupDb
OPENAI_API_KEY=your_api_key_here
MODEL_NAME_CHEAPER=gpt-4o-mini
SYSTEM_PROMPT="You are MediAssist AI, a medical assistant designed to provide helpful, accurate, and ethical medical information..."
```

3. Setup MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Make sure MongoDB is running on port 27017 (default)
   - The database will be created automatically when the server starts

4. Start the server:
```bash
npm start
```

5. For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/signup`: Register a new user

### Chat Management
- `POST /api/chats`: Start a new chat conversation
- `POST /api/chats/:chatId/messages`: Add message to an existing chat
- `PUT /api/chats/:chatId/end`: End a chat conversation
- `GET /api/users/:userId/chats`: Get user's chat history (completed chats)
- `GET /api/chats/:chatId`: Get a specific chat by ID

### AI Integration
- `POST /api/ai/chat`: Generate an AI response to a user message
  - Required body: `{ message: { content: "user message", sender: "user" } }`
  - Optional body: `{ chatId: "existing chat ID", userProfile: { user profile object } }`
  - Returns: AI message object with content and suggestions
- `GET /api/ai/config`: Get the current AI status
- `POST /api/ai/config`: Update AI configuration (admin only)

## AI Integration

The MediAssist server uses advanced language models to provide intelligent medical assistance:

- **Contextual Understanding**: The AI considers the user's health profile and conversation history when generating responses
- **Personalized Assistance**: When a user profile is provided, the AI can tailor responses to the user's specific health conditions
- **Smart Suggestions**: The AI automatically generates relevant follow-up questions and action suggestions
- **Ethical Guidelines**: The AI is configured with medical ethics guidelines to provide helpful but responsible information

## Notes

- By default, only completed conversations appear in the chat history
- Each conversation has an `isCompleted` flag that is set to true when a conversation is ended
- Messages are saved in real-time, but conversations only appear in history after they are ended
- The AI is designed to provide helpful medical information but always reminds users to consult healthcare professionals for diagnosis and treatment 