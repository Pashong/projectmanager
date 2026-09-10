import { Injectable, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MemberModel } from '../../../shared/models/member.model';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<MemberModel | null>(null);

  async logIn(form: NgForm) {
    try {
      const response = await fetch(`${environment.apiUrl}/login/`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });
      if (!response.ok) {
        throw Error('Login failed!');
      }

      this.isLoggedIn.set(true);
    } catch (error) {
      console.error('Something went wrong while signing in', error);
    }
  }

  async register(form: NgForm) {
    try {
      const reponse = await fetch(`${environment.apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });

      if (!reponse.ok) {
        console.error('Couldnt register');
        return;
      }
    } catch (error) {
      console.error('Something went wrong while registering', error);
    }
  }

  async checkAuth() {
    try {
      const response = await fetch(`${environment.apiUrl}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        this.isLoggedIn.set(false);
        return false;
      }

      const data = await response.json();

      const user = {
        id: data.user.id,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        email: data.user.email
      }

      this.currentUser.set(user);
      this.isLoggedIn.set(true);

      return true;
    } catch (error) {
      this.isLoggedIn.set(false);
      return false;
    }
  }


  async logout(){
    try{
      const response = await fetch(`${environment.apiUrl}/logout`, {
        method: "post",
        credentials: 'include',
      });

      if(!response.ok){
        throw new Error(`Logout failed: ${response.status}`);
      }

      this.isLoggedIn.set(false);

    }catch(error){
      console.error("Failed to logout", error);
    }
  }
}
