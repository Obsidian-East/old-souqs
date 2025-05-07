import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {  FormBuilder,FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {

  loginForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

   showPassword = false;
  
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
   
    // Replace this with your actual SHA-256 hashed password (e.g. from "admin123")
    private readonly hashedPassword = 'c73fcaaf5af162c73c93ba69b2cab2dab3e5a724c3bbfafd2ae13c0e8729912a';
  
    constructor(private fb: FormBuilder, private router: Router) {
      this.loginForm = this.fb.group({
        password: ['', Validators.required]
      });
    }

    async onSubmit(): Promise<void> {
      if (this.loginForm.invalid) return;
  
      const enteredPassword = this.loginForm.value.password? this.loginForm.value.password :"hi" ;
      const hashedInput = await this.hashPassword(enteredPassword);
  
      if (hashedInput === this.hashedPassword) {
        localStorage.setItem('admin-token', 'true');
        this.router.navigate(['/admin']);        
      } else {
        alert('Incorrect password.');
      }
    }
  
    private async hashPassword(password: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

}
