import { Injectable, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);

  async logIn(form: NgForm) {
    try {
      const response = await fetch('http://localhost:3030/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        console.error('Login failed');
      } else {
        this.isLoggedIn.set(true);
      }
    } catch (error) {
      console.error('Something went wrong while signing in', error);
    }
  }

  async register(form: NgForm) {
    try {
      const reponse = await fetch('http://localhost:3030/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if(!reponse.ok){
        console.error("Couldnt register");
      }
    } catch (error) {
      console.error('Something went wrong while registering', error);
    }
  }
}
