import { Component, inject, input, signal } from '@angular/core';
import { MenuTab } from './components/menu-tab/menu-tab';
import { Menu } from './models/menu';
import { AuthService } from '../../../features/auth/services/auth.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MenuTab],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  navbar = signal<boolean>(true);
  isOpen = signal<boolean>(false);
  menuTabs: Menu[] = [
    {
      menuName: 'Main Menu',
      menuTabNames: ['Dashboard', 'Projects'],
    },
  ];

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }

  toggleNavbar(el?: string) {
    if (el) {
      this.isOpen.update((value) => !value);
      return;
    }

    this.navbar.update((value) => !value);
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => this.isOpen.set(false));
  }
}
