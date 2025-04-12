import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { ResponsiveService } from '../../services/responsive.service';
import { TimePipe } from '../../time.pipe';

describe('ChatInterfaceComponent', () => {
  let component: ChatInterfaceComponent;
  let fixture: ComponentFixture<ChatInterfaceComponent>;
  let responsiveService: jasmine.SpyObj<ResponsiveService>;

  beforeEach(async () => {
    const responsiveServiceSpy = jasmine.createSpyObj('ResponsiveService', ['getIsMobile']);
    responsiveServiceSpy.getIsMobile.and.returnValue(new BehaviorSubject(false));

    await TestBed.configureTestingModule({
      imports: [
        ChatInterfaceComponent,
        FormsModule,
        TimePipe
      ],
      providers: [
        { provide: ResponsiveService, useValue: responsiveServiceSpy }
      ]
    }).compileComponents();

    responsiveService = TestBed.inject(ResponsiveService) as jasmine.SpyObj<ResponsiveService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with welcome message', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].sender).toBe('ai');
    expect(component.messages[0].content).toContain('How can I help you today?');
  });

  it('should toggle sidebar', () => {
    const initialState = component.isSidebarOpen;
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(!initialState);
  });

  it('should toggle theme', () => {
    const initialTheme = component.isDarkMode;
    component.toggleTheme();
    expect(component.isDarkMode).toBe(!initialTheme);
    expect(document.documentElement.classList.contains('dark')).toBe(component.isDarkMode);
  });

  it('should send message and receive AI response', (done) => {
    const testMessage = 'Test message';
    component.messageInput = testMessage;
    component.sendMessage();

    // Check user message was sent
    expect(component.messages[component.messages.length - 1].content).toBe(testMessage);
    expect(component.messageInput).toBe('');
    expect(component.isTyping).toBe(true);

    // Wait for AI response
    setTimeout(() => {
      expect(component.isTyping).toBe(false);
      expect(component.messages.length).toBeGreaterThan(2);
      expect(component.messages[component.messages.length - 1].sender).toBe('ai');
      done();
    }, 2000);
  });

  it('should handle file upload', (done) => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.handleFileUpload(event);
    expect(component.isUploading).toBe(true);

    setTimeout(() => {
      expect(component.isUploading).toBe(false);
      expect(component.messages[component.messages.length - 1].type).toBe('file');
      expect(component.messages[component.messages.length - 1].fileName).toBe('test.pdf');
      done();
    }, 2500);
  });

  it('should handle quick replies', (done) => {
    const quickReply = 'Get Prescription';
    component.sendQuickReply(quickReply);

    expect(component.messageInput).toBe(quickReply);

    setTimeout(() => {
      expect(component.messages[component.messages.length - 2].content).toBe(quickReply);
      expect(component.messages[component.messages.length - 1].sender).toBe('ai');
      done();
    }, 2000);
  });

  it('should load chat history', () => {
    expect(component.chatHistory.length).toBeGreaterThan(0);
    expect(component.chatHistory[0].title).toBe('General Checkup');
  });

  it('should handle voice input not supported', () => {
    spyOn(window, 'alert');
    component.toggleVoiceInput();
    expect(window.alert).toHaveBeenCalledWith('Speech recognition is not supported in your browser.');
  });

  it('should generate medical summary', (done) => {
    component.generateMedicalSummary();
    expect(component.isTyping).toBe(true);

    setTimeout(() => {
      expect(component.isTyping).toBe(false);
      const lastMessage = component.messages[component.messages.length - 1];
      expect(lastMessage.sender).toBe('ai');
      expect(lastMessage.content).toContain('Medical Chat Summary');
      expect(lastMessage.suggestions).toContain('Download Summary');
      done();
    }, 1500);
  });

  afterEach(() => {
    // Clean up theme changes
    document.documentElement.classList.remove('dark');
  });
});
