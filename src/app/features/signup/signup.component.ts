import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
    lastname: new FormControl('',Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phonenumber: new FormControl('',Validators.required),
    location: new FormControl('',Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService) {}

  handleSubmit() {
    if (this.signupForm.valid) {
      console.log("Form Data:", this.signupForm.value); // Debugging Line
      this.authService.signup(this.signupForm.value).subscribe(
        (response) => {
          console.log('Signup successful', response);
          alert('Signup successful!');
        },
        (error) => {
          console.error('Signup failed', error);
          alert('Signup failed. Please try again.');
        }
      );
    } else {
      console.error("Form is invalid", this.signupForm.errors);
      alert("Please fill out the form correctly.");
    }
  }
  
}
