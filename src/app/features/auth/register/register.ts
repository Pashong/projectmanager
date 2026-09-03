import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);

  passwordMismatch = false;

  async register(form: NgForm){
  
    const {password, passwordRepeat} = form.value;

    if(password !== passwordRepeat){
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    try{
    await this.authService.register(form);

    // could change it to immediately logged in after registration
      this.router.navigate(["/login"]);

    }
    catch(error){
      console.error("Something went wrong during the registration");
    }
    
  }

}
