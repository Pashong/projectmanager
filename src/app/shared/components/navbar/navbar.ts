import { Component, input } from '@angular/core';
import { MenuTab } from './components/menu-tab/menu-tab';
import { Menu } from './models/menu';

@Component({
  selector: 'app-navbar',
  imports: [MenuTab],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

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
}
