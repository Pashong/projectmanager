import { Component, input } from '@angular/core';
import { Menu } from '../../models/menu';

@Component({
  selector: 'app-menu-tab',
  imports: [],
  templateUrl: './menu-tab.html',
  styleUrl: './menu-tab.scss',
})
export class MenuTab {

  // needs to be changed for the dynamic content 
  menu = input<Menu>();
}
