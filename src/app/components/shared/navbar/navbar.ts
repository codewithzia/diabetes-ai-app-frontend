import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 9h-6L8 4z" />
              </svg>
            </div>
            <div>
              <span class="text-sm font-semibold text-slate-800 block leading-tight">Adaptive Diabetes AI</span>
              <span class="text-xs text-slate-500 leading-tight">Research Prototype</span>
            </div>
          </div>

          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/assessment" routerLinkActive="nav-link-active" class="nav-link">Assessment</a>
            <a routerLink="/prediction" routerLinkActive="nav-link-active" class="nav-link">Prediction</a>
            <a routerLink="/history" routerLinkActive="nav-link-active" class="nav-link">History</a>
            <a routerLink="/adaptive" routerLinkActive="nav-link-active" class="nav-link">Adaptive Monitor</a>
            <a routerLink="/comparison" routerLinkActive="nav-link-active" class="nav-link">Model Comparison</a>
            <a routerLink="/admin" routerLinkActive="nav-link-active" class="nav-link">Admin</a>
          </div>

          <button class="md:hidden text-slate-600" (click)="toggleMobile()">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        @if (mobileOpen) {
          <div class="md:hidden pb-3 flex flex-col gap-1">
            <a routerLink="/assessment" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">Assessment</a>
            <a routerLink="/prediction" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">Prediction</a>
            <a routerLink="/history" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">History</a>
            <a routerLink="/adaptive" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">Adaptive Monitor</a>
            <a routerLink="/comparison" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">Model Comparison</a>
            <a routerLink="/admin" routerLinkActive="nav-link-active" class="nav-link" (click)="toggleMobile()">Admin</a>
          </div>
        }
      </div>
    </nav>
  `
})
export class Navbar {
  mobileOpen = false;

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }
}
