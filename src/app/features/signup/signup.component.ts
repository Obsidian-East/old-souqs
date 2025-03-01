import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  
firstname2="before";
  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    lastname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),

  });

  handleSubmit() {
    this.firstname2="cynthia"
    alert(this.signupForm.value.firstname + ' | ' + this.signupForm.value.lastname + ' | ' + this.signupForm.value.email + ' | ' +this.signupForm.value.password);
  }
}
