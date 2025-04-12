import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimePipe } from '../../time.pipe';
import { ResponsiveService } from '../../services/responsive.service';
import { ChatService, ChatMessage, ChatHistory, AIModelConfig } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './chat-message/chat-message.component';

// Update the ChatMessage interface to include edited property
export interface EditableChatMessage extends ChatMessage {
  edited?: boolean;
}

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, CommonModule, TimePipe, ChatMessageComponent],
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;

  messages: ChatMessage[] = [];
  chatHistory: ChatHistory[] = [];
  messageInput = '';
  isTyping = false;
  isDarkMode = false;
  isRecording = false;
  isUploading = false;
  isMobile = false;
  isSidebarOpen = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  
  // AI Model Config
  modelConfig: AIModelConfig | null = null;
  
  // Context information from URL
  chatContext: string | null = null;
  profileData: any = null;

  quickReplies = [
    'Get Prescription',
    'Schedule Appointment',
    'View Medical History',
    'Emergency Contact',
    'Find Nearest Hospital'
  ];

  private destroy$ = new Subject<void>();
  private speechRecognition: any;

  // User Info
  user = {
    name: '',
    id: '#00000',
    isPremium: false
  };

  constructor(
    private responsiveService: ResponsiveService,
    public chatService: ChatService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window) {
      this.speechRecognition = new (window as any).webkitSpeechRecognition();
      this.setupSpeechRecognition();
    }

    // Load theme preference
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();

    // Subscribe to responsive changes
    this.responsiveService.getIsMobile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
        this.isMobile = isMobile;
        if (!isMobile) {
          this.isSidebarOpen = true;
        }
      });

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) this.isSidebarOpen = true;
    });

    // Check system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.toggleTheme();
    }
    
    // Subscribe to AI model config changes
    this.chatService.getModelConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        if (config) {
          this.modelConfig = config;
        }
      });
  }

  ngOnInit() {
    // Get context from query parameters
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['context']) {
          this.chatContext = params['context'];
          this.handleChatContext();
        }
      });
    
    // Get user information
    this.loadUserProfile();
    
    // Subscribe to user changes
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user.name = this.userService.getUserDisplayName();
          // Generate a consistent ID based on the user ID
          this.user.id = '#' + this.hashCode(user.uid || 'user').toString().substring(0, 5);
          // For demo purposes, users with gmail.com are premium
          this.user.isPremium = user.email?.includes('gmail.com') || false;
        } else {
          // If not logged in, redirect to login page
          this.router.navigate(['/login']);
        }
      });
    
    // Subscribe to messages
    this.chatService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      });

    // Subscribe to chat history
    this.chatService.getHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe(history => {
        this.chatHistory = history;
      });

    // Add welcome message if no messages exist
    // if (this.messages.length === 0 && !this.chatContext) {
    //   this.chatService.sendMessage(`Hello ${this.user.name}! I'm your medical assistant. How can I help you today?`);
    // }
  }
  
  /**
   * Update AI configuration
   */
  updateAIConfig() {
    this.chatService.updateModelPreference()
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          content: `AI configuration updated successfully.`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        
        this.messages = [...this.messages, systemMessage];
        this.scrollToBottom();
      });
  }
  
  private handleChatContext() {
    if (!this.chatContext) return;
    
    // Check if this is a profile-based context
    if (this.chatContext.startsWith('user_profile:')) {
      try {
        // Parse the profile data from the context
        const profileJson = this.chatContext.substring('user_profile:'.length);
        this.profileData = JSON.parse(profileJson);
        
        // Provide the profile data to chat service
        this.chatService.setUserProfile(this.profileData);
        
        // Immediate welcome with profile acknowledgment
        setTimeout(() => {
          this.chatService.clearChat();
          this.chatService.sendMessage(`Hello ${this.profileData.name || this.user.name}! I have access to your health profile and can provide personalized assistance. How can I help you today?`, 'text', 'ai');
        }, 300);
      } catch (e) {
        console.error('Error parsing profile data from context', e);
      }
    } else {
      // Handle other context types
      const contextMap: {[key: string]: string} = {
        'feeling_unwell': 'I\'m sorry to hear you\'re not feeling well. Could you describe your symptoms?',
        'daily_checkup': 'How are you feeling today? Let\'s do a quick health check-up.',
        'feeling_great': 'I\'m glad you\'re feeling good! Is there anything specific you\'d like to discuss about your health?',
        'health_metrics': 'Would you like to review your recent health metrics or log new ones?',
        'new_symptom': 'What symptoms are you experiencing? Please describe them in detail.',
        'medication_question': 'Do you have questions about your medications?'
      };
      
      // Extract specialized context like 'find_doctor:cardiology'
      let specializedContext = '';
      if (this.chatContext.includes(':')) {
        const parts = this.chatContext.split(':');
        const contextType = parts[0];
        specializedContext = parts[1];
        
        if (contextType === 'find_doctor') {
          setTimeout(() => {
            this.chatService.clearChat();
            this.chatService.sendMessage(`I'll help you find a ${specializedContext} specialist. What's your preferred location?`, 'text', 'ai');
          }, 300);
          return;
        } else if (contextType === 'symptom_analysis') {
          setTimeout(() => {
            this.chatService.clearChat();
            this.chatService.sendMessage(`Let's analyze your ${specializedContext} symptom in more detail. When did it start?`, 'text', 'ai');
          }, 300);
          return;
        } else if (contextType === 'appointment_prep') {
          setTimeout(() => {
            this.chatService.clearChat();
            this.chatService.sendMessage(`I'll help you prepare for your ${specializedContext} appointment. What specific concerns would you like to discuss with your doctor?`, 'text', 'ai');
          }, 300);
          return;
        }
      }
      
      // Use the mapped message or a default
      const message = contextMap[this.chatContext] || 
                    `How can I help you with ${this.chatContext.replace(/_/g, ' ')}?`;
      
      // Send the context-specific message
      setTimeout(() => {
        this.chatService.clearChat();
        this.chatService.sendMessage(message, 'text', 'ai');
      }, 300);
    }
  }

  loadUserProfile() {
    this.user.name = this.userService.getUserDisplayName();
    
    // If there's a currentUser in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Generate a consistent ID based on the user ID
      this.user.id = '#' + this.hashCode(userData.uid || 'user').toString().substring(0, 5);
      // For demo purposes, users with gmail.com are premium
      this.user.isPremium = userData.email?.includes('gmail.com') || false;
    }
  }
  
  // Simple hash function to generate consistent user IDs
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private setupSpeechRecognition() {
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = 'en-US';

    this.speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.messageInput = transcript;
      this.sendMessage();
    };

    this.speechRecognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isRecording = false;
    };
  }

  toggleVoiceInput() {
    if (!this.speechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (this.isRecording) {
      this.speechRecognition.stop();
    } else {
      this.speechRecognition.start();
    }
    this.isRecording = !this.isRecording;
  }

  sendMessage() {
    if (!this.messageInput.trim()) return;
    
    this.isTyping = true;
    this.chatService.sendMessage(this.messageInput, 'text')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (aiMessage) => {
          // Smoothly display the response after a short delay for better UX
          setTimeout(() => {
            this.isTyping = false;
            this.messageInput = '';
            // Ensure the UI scrolls to the newest message
            this.scrollToBottom();
          }, 300);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isTyping = false;
          this.messageInput = '';
        }
      });
  }

  sendQuickReply(reply: string) {
    this.messageInput = reply;
    setTimeout(() => {
      this.sendMessage();
    }, 300);
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploading = true;
    // Simulate file upload
    setTimeout(() => {
      this.chatService.sendMessage(`Uploaded file: ${file.name}`, 'file');
      this.isUploading = false;
    }, 1500);
  }

  endConversation() {
    if (this.messages.length === 0) return;
    
    // Set typing indicator
    this.isTyping = true;
    
    this.chatService.endCurrentChat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        this.isTyping = false;
        
        if (success) {
          // Show confirmation message
          const systemMessage: ChatMessage = {
            id: Date.now().toString(),
            content: `This conversation has been saved to your history.`,
            sender: 'system',
            timestamp: new Date(),
            type: 'text'
          };
          
          this.messages = [...this.messages, systemMessage];
          this.scrollToBottom();
          
          // Clear messages after a delay to show the confirmation message
          setTimeout(() => {
            this.chatService.clearChat();
          }, 2000);
        }
      });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    });
  }

  /**
   * Starts a new chat session by clearing the current messages
   */
  startNewChat() {
    this.chatService.clearChat();
    // No need to send a welcome message as clearChat already does this
  }

  /**
   * Clears all chat history from storage
   */
  clearAllChats() {
    if (confirm('Are you sure you want to delete all chat history?')) {
      this.chatService.clearAllHistory();
    }
  }

  /**
   * Loads a specific chat from history
   */
  loadChat(chat: ChatHistory) {
    this.chatService.loadChatFromHistory(chat.id);
  }

  /**
   * Deletes a specific chat from history
   */
  deleteChat(chat: ChatHistory) {
    event?.stopPropagation();
    if (confirm(`Are you sure you want to delete "${chat.title}"?`)) {
      this.chatService.deleteFromHistory(chat.id);
    }
  }

  // Handle edited messages
  handleEditedMessage(event: {id: string, content: string}) {
    // Find the message to edit
    const messageIndex = this.messages.findIndex(m => m.id === event.id);
    if (messageIndex !== -1) {
      // Create a new array to trigger change detection
      const updatedMessages = [...this.messages];
      // Update the message content with TypeScript type safety
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: event.content,
        edited: true
      } as ChatMessage; // Cast to ChatMessage since we added 'edited' to the interface
      // Update the messages in the service
      this.chatService.updateMessages(updatedMessages);
    }
  }
} 