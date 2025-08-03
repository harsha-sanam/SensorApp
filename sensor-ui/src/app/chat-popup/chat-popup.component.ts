import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-chat-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent {
  isOpen = false;
  question = '';
  messages: { question: string, answer: string }[] = [];

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  send() {
    const trimmed = this.question.trim();
    if (!trimmed) return;

    const userMessage = trimmed;
    this.question = '';
    this.messages.push({ question: userMessage, answer: '...' });

    this.http.post<{ answer: string }>(`${window.location.origin.replace(/:\d+$/, ':1234')}/chat`, { question: userMessage })
      .subscribe({
        next: (res) => {
          const last = this.messages[this.messages.length - 1];
          last.answer = res.answer;
        },
        error: () => {
          const last = this.messages[this.messages.length - 1];
          last.answer = '⚠️ Error connecting to AI.';
        }
      });
  }
}
