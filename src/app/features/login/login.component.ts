import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  showPassword = false;
  Lreason = "";

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        console.log(localStorage.getItem('userId'));
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Login error:', error);
        if (typeof error.error === 'string') {
          this.Lreason = error.error;
        } else if (error.error?.message) {
          this.Lreason = error.error.message;
        } else {
          this.Lreason = 'Login failed. Please try again.';
        }
      }
    );
  }

}
