import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { UserService } from './user.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'chart';
  fileUrl?: string;
  fileName?: string;
  attachments?: string[];
  suggestions?: string[];
  userData?: any;
  edited?: boolean;
}

export interface ChatHistory {
  id: string;
  title: string;
  date: Date;
  lastMessage: string;
  isCompleted?: boolean;
}

export interface ChatConversation {
  _id?: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  isCompleted: boolean;
  startedAt: Date;
  endedAt?: Date;
  context?: string;
}

export interface AIModelConfig {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private historySubject = new BehaviorSubject<ChatHistory[]>([]);
  private userProfile: any = null;
  private currentChatId: string | null = null;
  private modelConfigSubject = new BehaviorSubject<AIModelConfig | null>(null);
  
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.loadInitialData();
    this.loadModelConfig();
    
    // Subscribe to user changes
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        // Load user-specific chat history from MongoDB
        this.loadUserChats(user.uid);
      } else {
        // Clear chat history on logout
        this.historySubject.next([]);
      }
    });
  }

  private loadInitialData() {
    // Load current chat messages from localStorage (for offline capability)
    const savedMessages = localStorage.getItem('currentChat');
    const savedChatId = localStorage.getItem('currentChatId');
    
    if (savedMessages) {
      this.messagesSubject.next(JSON.parse(savedMessages));
    }
    
    if (savedChatId) {
      this.currentChatId = savedChatId;
    }
    
    // Check if user is already logged in
    const user = this.userService.currentUserValue;
    if (user && savedChatId) {
      // If we have a saved chat ID, load it from server
      this.http.get<ChatConversation>(`${this.apiUrl}/chats/${savedChatId}`)
        .pipe(
          catchError(error => {
            console.error('Error loading chat:', error);
            return of(null);
          })
        )
        .subscribe(chat => {
          if (chat) {
            // Format messages
            const messages = chat.messages.map(msg => {
              // Ensure timestamp is a Date object
              if (typeof msg.timestamp === 'string') {
                msg.timestamp = new Date(msg.timestamp);
              }
              return msg;
            });
            
            // Update current messages
            this.messagesSubject.next(messages);
          }
        });
    }
  }
  
  private loadModelConfig() {
    // Get AI model configuration
    this.http.get<AIModelConfig>(`${this.apiUrl}/ai/config`)
      .pipe(
        catchError(error => {
          console.error('Error loading AI model config:', error);
          // Default config if server request fails
          return of({
            status: 'active'
          });
        })
      )
      .subscribe(config => {
        this.modelConfigSubject.next(config);
      });
  }
  
  private loadUserChats(userId: string) {
    // Get all chats from the server (both completed and ongoing)
    this.http.get<ChatConversation[]>(`${this.apiUrl}/users/${userId}/chats?all=true`)
      .pipe(
        catchError(error => {
          console.error('Error loading chat history:', error);
          return of([]);
        })
      )
      .subscribe(chats => {
        const history: ChatHistory[] = chats.map(chat => ({
          id: chat._id || '',
          title: chat.title,
          date: new Date(chat.startedAt),
          lastMessage: this.getLastMessage(chat.messages),
          isCompleted: chat.isCompleted
        }));
        
        this.historySubject.next(history);
        
        // If there's a current chat in localStorage, try to match it with a chat from history
        const savedMessages = localStorage.getItem('currentChat');
        if (savedMessages && !this.currentChatId && chats.length > 0) {
          const parsedMessages = JSON.parse(savedMessages);
          if (parsedMessages.length > 0) {
            // Look for a matching chat in the history based on message content
            const lastLocalMessage = parsedMessages[parsedMessages.length - 1];
            for (const chat of chats) {
              if (!chat.isCompleted && chat.messages.length > 0) {
                const lastServerMessage = chat.messages[chat.messages.length - 1];
                if (lastServerMessage.content === lastLocalMessage.content) {
                  // Found a match - set this as the current chat
                  this.currentChatId = chat._id || null;
                  break;
                }
              }
            }
          }
        }
      });
  }
  
  getModelConfig(): Observable<AIModelConfig | null> {
    return this.modelConfigSubject.asObservable();
  }
  
  /**
   * Update AI configuration
   */
  updateModelPreference(): Observable<AIModelConfig> {
    return this.http.post<{success: boolean, config: AIModelConfig}>(`${this.apiUrl}/ai/config`, {})
      .pipe(
        map(response => ({ status: 'active' })),
        tap(config => {
          this.modelConfigSubject.next(config);
        }),
        catchError(error => {
          console.error('Error updating AI configuration:', error);
          return of({ status: 'active' });
        })
      );
  }
  
  private getLastMessage(messages: ChatMessage[]): string {
    if (!messages || messages.length === 0) return '';
    return messages[messages.length - 1].content.substring(0, 30) + (messages[messages.length - 1].content.length > 30 ? '...' : '');
  }

  /**
   * Generates a descriptive title for the chat based on user messages
   * Avoids using generic greetings like "hello" or "hi"
   */
  private generateChatTitle(messages: ChatMessage[]): string {
    if (!messages || messages.length === 0) return 'New Conversation';
    
    // Find the first substantial user message (not just a greeting)
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return 'New Conversation';
    
    // Skip common greetings and short messages
    const greetings = ['hello', 'hi', 'hey', 'morning', 'afternoon', 'evening'];
    let firstSubstantialMessage = userMessages[0];
    
    for (const msg of userMessages) {
      const content = msg.content.toLowerCase().trim();
      // Check if it's a short greeting
      if (content.length < 10 && greetings.some(g => content.includes(g))) {
        continue;
      }
      // We found a substantial message
      firstSubstantialMessage = msg;
      break;
    }
    
    // Try to identify the main medical topic if possible
    const allUserContent = userMessages
      .map(m => m.content.toLowerCase())
      .join(' ');
    
    // Look for common medical topics
    const medicalKeywords = [
      'headache', 'migraine', 'pain', 'fever', 'cough', 'cold', 'flu', 
      'allergy', 'diabetes', 'blood pressure', 'heart', 'prescription',
      'medication', 'symptom', 'treatment', 'diet', 'exercise', 'scan',
      'test', 'vaccine', 'checkup', 'appointment', 'specialist'
    ];
    
    for (const keyword of medicalKeywords) {
      if (allUserContent.includes(keyword)) {
        // Create a more descriptive title based on the medical keyword
        return 'Consultation about ' + keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    
    // Extract a title from the first substantial message (max 40 chars)
    const title = firstSubstantialMessage.content.trim();
    return title.length > 40 ? title.substring(0, 37) + '...' : title;
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getHistory(): Observable<ChatHistory[]> {
    return this.historySubject.asObservable();
  }

  setUserProfile(profile: any) {
    this.userProfile = profile;
  }
  
  startNewChat(title: string, context?: string): Observable<string> {
    const userId = this.getUserId();
    if (!userId) {
      return of('');
    }
    
    // Create a new chat in the database
    return this.http.post<ChatConversation>(`${this.apiUrl}/chats`, {
      userId,
      title,
      context
    }).pipe(
      map(response => {
        this.currentChatId = response._id || null;
        return this.currentChatId || '';
      }),
      catchError(error => {
        console.error('Error starting new chat:', error);
        return of('');
      })
    );
  }

  sendMessage(content: string, type: 'text' | 'file' | 'image' | 'chart' = 'text', sender: 'user' | 'ai' | 'system' = 'user'): Observable<ChatMessage> {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: sender,
      timestamp: new Date(),
      type
    };

    // Add message immediately to local storage
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    this.saveCurrentChat();
    
    // If it's an AI message, we don't need to get a response
    if (sender === 'ai' || sender === 'system') {
      return of(message);
    }
    
    // For user messages, ensure we have a chat conversation started in the database
    return this.ensureChatStarted(content).pipe(
      switchMap(chatId => {
        // If we have a chat ID, save the message to the database
        if (chatId) {
          this.saveMessageToServer(chatId, message);
          
          // Add chat to recent chats list if it's not already there
          this.addToRecentChats(chatId);
        }
        
        // Get AI response from the server
        return this.getAIResponse(message, chatId);
      })
    );
  }
  
  private getAIResponse(userMessage: ChatMessage, chatId: string | null): Observable<ChatMessage> {
    // Call the AI service endpoint
    return this.http.post<ChatMessage>(`${this.apiUrl}/ai/chat`, {
      message: userMessage,
      chatId: chatId,
      userProfile: this.userProfile
    }).pipe(
      map(aiMessage => {
        // Generate a unique ID for the AI message
        aiMessage.id = (Date.now() + 1).toString();
        
        // Convert string timestamp to Date object if needed
        if (typeof aiMessage.timestamp === 'string') {
          aiMessage.timestamp = new Date(aiMessage.timestamp);
        }
        
        // Add the AI message to the current messages
        const updatedMessages = [...this.messagesSubject.value, aiMessage];
        this.messagesSubject.next(updatedMessages);
        this.saveCurrentChat();
        
        // Save AI message to the server if we have a chat ID
        if (chatId) {
          this.saveMessageToServer(chatId, aiMessage);
          
          // Update the last message in history
          this.updateChatLastMessage(chatId, aiMessage.content);
        }
        
        return aiMessage;
      }),
      catchError(error => {
        console.error('Error getting AI response:', error);
        
        // Create a fallback AI message in case of error
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm having trouble connecting to my knowledge base right now. Please try again later or contact support if the issue persists.",
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
          suggestions: ['Try again', 'Contact support', 'Different question']
        };
        
        // Add the fallback message to current messages
        const updatedMessages = [...this.messagesSubject.value, fallbackMessage];
        this.messagesSubject.next(updatedMessages);
        this.saveCurrentChat();
        
        if (chatId) {
          // Update the last message in history with error message
          this.updateChatLastMessage(chatId, "Connection error. Please try again.");
        }
        
        return of(fallbackMessage);
      })
    );
  }
  
  // Update the last message shown in chat history
  private updateChatLastMessage(chatId: string, lastMessageContent: string): void {
    const currentHistory = this.historySubject.value;
    const updatedHistory = currentHistory.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: lastMessageContent.length > 30 ? 
                      lastMessageContent.substring(0, 27) + '...' : 
                      lastMessageContent
        };
      }
      return chat;
    });
    
    this.historySubject.next(updatedHistory);
  }
  
  private saveMessageToServer(chatId: string, message: ChatMessage): void {
    this.http.post(`${this.apiUrl}/chats/${chatId}/messages`, { message })
      .pipe(
        catchError(error => {
          console.error('Error saving message to server:', error);
          return of(null);
        })
      )
      .subscribe();
  }
  
  private ensureChatStarted(firstMessageContent: string): Observable<string> {
    if (this.currentChatId) {
      return of(this.currentChatId);
    }

    // Generate a descriptive title based on the message content
    let title = firstMessageContent;
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(g => firstMessageContent.toLowerCase().includes(g)) || firstMessageContent.length < 10) {
      title = 'Medical Consultation';
    } else {
      // Truncate long titles
      title = firstMessageContent.length > 40 ? firstMessageContent.substring(0, 37) + '...' : firstMessageContent;
    }
    
    return this.startNewChat(title);
  }

  endCurrentChat(): Observable<boolean> {
    if (!this.currentChatId) {
      return of(false);
    }

    const userId = this.getUserId();
    if (!userId) {
      return of(false);
    }
    
    // Get the current messages to generate a better title
    const messages = this.messagesSubject.value;
    const betterTitle = this.generateChatTitle(messages);

    // Update the chat in the database
    return this.http.patch<{success: boolean}>(`${this.apiUrl}/chats/${this.currentChatId}`, {
      isCompleted: true,
      title: betterTitle  // Use the better title
    }).pipe(
      switchMap(response => {
        if (response.success) {
          // Update existing history item with better title and mark as completed
          const currentHistory = this.historySubject.value;
          const updatedHistory = currentHistory.map(chat => {
            if (chat.id === this.currentChatId) {
              return {
                ...chat,
                title: betterTitle,
                isCompleted: true
              };
            }
            return chat;
          });
          
          this.historySubject.next(updatedHistory);
          
          // Clear current chat
          this.currentChatId = null;
          this.messagesSubject.next([]);
          localStorage.removeItem('currentChat');
          
          return of(true);
        }
        return of(false);
      }),
      catchError(error => {
        console.error('Error ending chat:', error);
        return of(false);
      })
    );
  }

  private getUserId(): string | null {
    const user = this.userService.currentUserValue;
    if (user && user.uid) {
      return user.uid;
    }
    
    // Try from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return userData.uid;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return null;
  }

  private saveCurrentChat() {
    const currentMessages = this.messagesSubject.value;
    localStorage.setItem('currentChat', JSON.stringify(currentMessages));
    
    // Also save the current chat ID for persistence
    if (this.currentChatId) {
      localStorage.setItem('currentChatId', this.currentChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }

  /**
   * Clear the current chat
   */
  clearChat() {
    // End the current chat if exists
    if (this.currentChatId) {
      this.endCurrentChat().subscribe();
    }
     
    this.messagesSubject.next([]);
    localStorage.removeItem('currentChat');
    localStorage.removeItem('currentChatId');
    this.currentChatId = null;
     
    // Add a welcome message after clearing the chat
    setTimeout(() => {
      const userName = this.userService.getUserDisplayName();
      this.sendMessage(`Hello ${userName}! I'm your medical assistant. How can I help you today?`, 'text', 'ai');
    }, 300);
  }
  
  /**
   * Update messages after editing
   */
  updateMessages(messages: ChatMessage[]) {
    this.messagesSubject.next(messages);
    this.saveCurrentChat();
    
    // If we have a current chat ID, update the messages on the server
    if (this.currentChatId) {
      // Only implement if backend supports message editing
      // this.http.patch(`${this.apiUrl}/chats/${this.currentChatId}`, { messages })
      //   .subscribe({
      //     error: (error) => console.error('Error updating chat messages:', error)
      //   });
    }
  }
  
  /**
   * Clear all chat history for the current user
   */
  clearAllHistory() {
    const userId = this.getUserId();
    if (!userId) return;
    
    // Update the local state immediately
    this.historySubject.next([]);
    
    // Delete on the server
    this.http.delete(`${this.apiUrl}/users/${userId}/chats`)
      .subscribe({
        error: (error) => console.error('Error clearing chat history:', error)
      });
  }
  
  /**
   * Load a specific chat from history
   */
  loadChatFromHistory(chatId: string) {
    this.http.get<ChatConversation>(`${this.apiUrl}/chats/${chatId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading chat:', error);
          return of(null);
        })
      )
      .subscribe(chat => {
        if (chat) {
          // Format messages
          const messages = chat.messages.map(msg => {
            // Ensure timestamp is a Date object
            if (typeof msg.timestamp === 'string') {
              msg.timestamp = new Date(msg.timestamp);
            }
            return msg;
          });
          
          // Update current messages
          this.messagesSubject.next(messages);
          this.currentChatId = chatId;
          this.saveCurrentChat();
        }
      });
  }
  
  /**
   * Delete a specific chat from history
   */
  deleteFromHistory(chatId: string) {
    // Update local state immediately
    const currentHistory = this.historySubject.value;
    const updatedHistory = currentHistory.filter(chat => chat.id !== chatId);
    this.historySubject.next(updatedHistory);
    
    // Delete on the server
    this.http.delete(`${this.apiUrl}/chats/${chatId}`)
      .subscribe({
        error: (error) => console.error('Error deleting chat:', error)
      });
  }

  // Add chat to recent chats with a temporary title
  private addToRecentChats(chatId: string): void {
    // Check if chat is already in history
    const currentHistory = this.historySubject.value;
    if (currentHistory.some(chat => chat.id === chatId)) {
      return;
    }
    
    // Get the current messages to generate a title
    const messages = this.messagesSubject.value;
    let title = 'New Chat';
    
    // Try to generate a better title if we have user messages
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length > 0) {
      const firstMessage = userMessages[0].content;
      title = firstMessage.length > 40 ? firstMessage.substring(0, 37) + '...' : firstMessage;
    }
    
    // Add to history with temporary title
    const newHistoryItem: ChatHistory = {
      id: chatId,
      title: title,
      date: new Date(),
      lastMessage: this.getLastMessage(messages),
      isCompleted: false
    };
    
    this.historySubject.next([newHistoryItem, ...currentHistory]);
  }
} 