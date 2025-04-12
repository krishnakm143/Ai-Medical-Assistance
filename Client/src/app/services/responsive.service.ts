import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private isMobile = new BehaviorSubject<boolean>(window.innerWidth < 768);

  constructor() {
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize(): void {
    this.isMobile.next(window.innerWidth < 768);
  }

  getIsMobile(): Observable<boolean> {
    return this.isMobile.asObservable();
  }
} 