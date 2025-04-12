import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { 
    path: 'auth', 
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [publicGuard] 
  },
  { 
    path: 'landingpage', 
    loadComponent: () => import('./components/landingpage/landingpage.component').then(m => m.LandingpageComponent)
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat-interface/chat-interface.component').then(m => m.ChatInterfaceComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/landingpage', pathMatch: 'full' }
];