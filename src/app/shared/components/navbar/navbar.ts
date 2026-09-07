import { Component, inject, input, signal } from '@angular/core';
import { MenuTab } from './components/menu-tab/menu-tab';
import { Menu } from './models/menu';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router } from '@angular/router';

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
  menuTabs: Menu[] = [
    {
      menuName: 'main menu',
      menuTabNames: [
        'Dashboard',
        'Tasks',
        'Projects',
        'Documents',
        'Team',
        'Calendar',
      ],
    },
    {
      menuName: 'projects',
      menuTabNames: [],
    },
  ];

  async logout(){
    try{
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
    catch(error){
      console.log(error);
    }
  }

  toggleNavbar(){
    this.navbar.update(value => !value);
  }
}
