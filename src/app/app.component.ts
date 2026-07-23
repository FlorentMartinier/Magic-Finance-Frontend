import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <app-header />
      <main>
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent { }