import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from '../firebase.config';
import { onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
      
      // Store user info in localStorage for persistence
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User'
        }));
      } else {
        localStorage.removeItem('currentUser');
      }
    });

    // Check if we have user data in localStorage (for page refreshes)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && !this.currentUserSubject.value) {
      const userData = JSON.parse(savedUser);
      // We're not setting the full user object, but enough for the UI to work
      this.currentUserSubject.next(userData as any);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getUserDisplayName(): string {
    const user = this.currentUserSubject.value;
    if (user) {
      return user.displayName || user.email?.split('@')[0] || 'User';
    }
    
    // Fallback to localStorage in case the auth state hasn't initialized yet
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      return userData.displayName || userData.email?.split('@')[0] || 'User';
    }
    
    return 'User';
  }

  public logout(): void {
    auth.signOut();
    localStorage.removeItem('currentUser');
  }
} 