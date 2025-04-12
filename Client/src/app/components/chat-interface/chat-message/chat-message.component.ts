import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from '../../../services/chat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./chat-message.component.scss'],
  providers: [DatePipe]
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
  @Output() suggestionClicked = new EventEmitter<string>();
  @Output() messageEdited = new EventEmitter<{id: string, content: string}>();
  
  editMode = false;
  editedContent = '';

  constructor(
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {}

  quickReply(suggestion: string) {
    this.suggestionClicked.emit(suggestion);
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'shortTime') || '';
  }

  formatUserMessage(content: string): SafeHtml {
    if (!content) return '';
    
    // Replace newlines with <br>
    const formattedContent = content.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedContent);
  }

  formatAIResponse(content: string): string {
    if (!content) return '';
    
    // First, clean up the content
    let formattedText = content.trim();
    
    // Format numbered lists
    formattedText = formattedText.replace(/(\d+\.)\s*(\*\*[^*]+\*\*)/g, '\n$1 $2');
    
    // Add spacing after periods at the end of sentences
    formattedText = formattedText.replace(/\.(?=\s+[A-Z])/g, '.\n\n');
    
    // Format key recommendations
    if (formattedText.includes('**')) {
      // Already has markdown formatting
      formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '$1');
    }
    
    // Break down long paragraphs
    const paragraphs = formattedText.split('\n\n');
    const formattedParagraphs = paragraphs.map(para => {
      // If paragraph is very long, try to break it at logical points
      if (para.length > 150) {
        return para.replace(/\.(?=\s+[A-Z])/g, '.\n');
      }
      return para;
    });
    
    // Improve readability of lists with numbers
    formattedText = formattedParagraphs.join('\n\n')
      .replace(/(\d+\.)\s+/g, '\n$1 ') // Add newlines before numbered points
      .replace(/(\d+\.)\s+([A-Za-z])/g, '$1 $2'); // Ensure spacing between numbers and text
    
    return formattedText;
  }
  
  startEdit() {
    if (this.message.sender === 'user' && this.message.type !== 'file') {
      this.editMode = true;
      this.editedContent = this.message.content;
    }
  }
  
  saveEdit() {
    if (this.editedContent.trim()) {
      this.messageEdited.emit({
        id: this.message.id,
        content: this.editedContent.trim()
      });
    }
    this.editMode = false;
  }
  
  cancelEdit() {
    this.editMode = false;
    this.editedContent = this.message.content;
  }
} 