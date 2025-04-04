import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';  // Import Router
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phonenumber: new FormControl('', [
      Validators.required,
    ]),
    location: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    
  });

  showPassword = false;
  Freason = "";

  constructor(private authService: AuthService, private router: Router) { }  // Inject Router

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleSubmit() {
    console.log('Submitting:', this.signupForm.value); // Debugging log
  
    this.authService.signup(this.signupForm.value).subscribe(
      (response) => {
        alert('Signup successful!');
        this.router.navigate(['/profile']); // Redirect to profile component
      },
      (error) => {
        if (error.error) {
          // Set detailed error message from the backend
          this.Freason = typeof error.error === 'string' ? error.error : 'Signup failed. Please try again.';
        } else {
          this.Freason = 'An unexpected error occurred.';
        }
      }
    );
  }
  
  
  
}
