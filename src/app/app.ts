import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { DemoBanner } from './components/shared/demo-banner/demo-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, DemoBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('diabetes-ai-app');
}
