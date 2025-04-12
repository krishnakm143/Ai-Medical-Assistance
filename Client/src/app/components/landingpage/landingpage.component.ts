import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, Lock,Bot ,Brain,Sparkles,MessageSquare,Activity,Star,WandSparkles,Menu} from 'lucide-angular';


@Component({
  selector: 'app-landingpage',
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingpageComponent implements OnInit {

  readonly Lock = Lock;
  readonly bot = Bot;
  readonly brain = Brain;
  readonly sparkles = Sparkles;
  readonly messageSquare = MessageSquare;
  readonly activity = Activity;
  readonly Star = Star;
  readonly wandsparkles = WandSparkles;
  readonly menu = Menu;

  // Mobile menu state
  showMobileMenu = false;

  // Toggle mobile menu
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  testimonials = [
    { quote: "This service is amazing!", author: "John Doe", role: "Patient" },
    { quote: "Highly recommend MedAI.", author: "Jane Smith", role: "Doctor" },
    { quote: "A game-changer in healthcare.", author: "Alice Johnson", role: "Nurse" }
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('LandingpageComponent initialized');
  }

  currentYear: number = new Date().getFullYear();
  navItems = ['Features', 'Chat Demo', 'Security', 'Contact'];

  features = [
    {
      title: 'Real-time Diagnosis',
      description: 'Get instant AI-powered symptom analysis and preliminary diagnosis',
      icon: Brain,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: '24/7 AI Chat',
      description: 'Access medical guidance anytime with our intelligent chatbot',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Smart Monitoring',
      description: 'Continuous health tracking with wearable integration',
      icon: Activity,
      gradient: 'from-pink-500 to-red-500'
    },
    {
      title: 'Secure Records',
      description: 'Blockchain-secured, encrypted personal health data',
      icon: Lock,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  footerSections = [
    {
      title: 'Company',
      links: ['About', 'Careers', 'Contact']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Help Center', 'Privacy Policy']
    },
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Demo']
    }
  ];

  chatMessage = '';
  showAIResponse = false;

  handleChatSubmit() {
    if (this.chatMessage.trim()) {
      this.showAIResponse = true;
      setTimeout(() => {
        this.showAIResponse = false;
        this.chatMessage = '';
      }, 5000);
    }
  }

}
