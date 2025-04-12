const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const openaiService = require('./services/openai.service');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signupDb')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('Users', userSchema);

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, default: 'text' },
  fileUrl: String,
  fileName: String,
  suggestions: [String]
});

// Chat Conversation Schema
const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
  isCompleted: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  context: String
});

const Chat = mongoose.model('Chat', chatSchema);

// Signup API route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Start a new chat conversation
app.post('/api/chats', async (req, res) => {
  try {
    const { userId, title, firstMessage, context } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ message: 'User ID and title are required' });
    }
    
    const messages = firstMessage ? [firstMessage] : [];
    
    const newChat = new Chat({
      userId,
      title,
      messages,
      context
    });
    
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat conversation' });
  }
});

// Add message to chat
app.post('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    chat.messages.push(message);
    await chat.save();
    
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Error adding message to chat' });
  }
});

// Get AI response for a message
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, chatId, userProfile } = req.body;
    
    if (!message || !message.content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    let conversationHistory = [];
    
    // If chatId is provided, get conversation history
    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (chat) {
        // Get last 10 messages for context
        conversationHistory = chat.messages.slice(-10);
      }
    }
    
    // Generate AI response
    const aiResponseContent = await openaiService.generateResponse(
      message.content,
      userProfile,
      conversationHistory
    );
    
    // Generate suggestions based on the conversation
    const suggestions = await openaiService.generateSuggestions(
      message.content,
      aiResponseContent
    );
    
    // Create AI response message
    const aiMessage = {
      content: aiResponseContent,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: suggestions
    };
    
    res.status(200).json(aiMessage);
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ 
      message: 'Error generating AI response',
      error: error.message 
    });
  }
});

// End chat conversation
app.put('/api/chats/:chatId/end', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    chat.isCompleted = true;
    chat.endedAt = new Date();
    await chat.save();
    
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error ending chat:', error);
    res.status(500).json({ message: 'Error ending chat conversation' });
  }
});

// Get user's chat history (only completed chats)
app.get('/api/users/:userId/chats', async (req, res) => {
  try {
    const { userId } = req.params;
    const { all } = req.query;
    
    let query = { userId };
    
    // If not explicitly requesting all chats, only return completed ones
    // This is modified to default to returning all chats
    if (all === 'false') {
      query.isCompleted = true;
    }
    
    const chats = await Chat.find(query)
      .sort({ endedAt: -1, startedAt: -1 })
      .select('title startedAt endedAt isCompleted messages');
    
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error retrieving chats:', error);
    res.status(500).json({ message: 'Error retrieving chat history' });
  }
});

// Get specific chat by ID
app.get('/api/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    console.error('Error retrieving chat:', error);
    res.status(500).json({ message: 'Error retrieving chat' });
  }
});

// Get current AI model configuration
app.get('/api/ai/config', (req, res) => {
  // Send simplified configuration without model details
  res.status(200).json({
    status: 'active'
  });
});

app.post('/api/ai/config', async (req, res) => {
  try {
    // Simply return success status without exposing model details
    res.status(200).json({
      success: true,
      message: 'AI configuration updated'
    });
  } catch (error) {
    console.error('Error updating AI config:', error);
    res.status(500).json({ message: 'Error updating AI configuration' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
