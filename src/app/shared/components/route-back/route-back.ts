import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-route-back',
  imports: [],
  templateUrl: './route-back.html',
  styleUrl: './route-back.scss',
})
export class RouteBack {
  private location = inject(Location);

  goBack(){
    this.location.back();
  }
}
