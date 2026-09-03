import { Component, inject } from '@angular/core';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthService } from './features/auth/services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);

  loggedIn = this.authService.isLoggedIn();

  protected title = 'projectmanager';
}
