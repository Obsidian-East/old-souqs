import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})

export class EditprofileComponent implements OnInit {
  userData: { id: string; firstName: string; lastName: string; location: string; phoneNumber: string; email: string } = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
    email: ''
  };
  profileForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService) {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{8,15}$/)]),
      location: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.fetchUser(userId)
    }
  }

  fetchUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userData.id = user.id,
        this.userData.firstName = user.first_name,
        this.userData.lastName = user.last_name,
        this.userData.phoneNumber = user.phonenumber,
        this.userData.location = user.location,
        this.userData.email = user.email
        this.profileForm.patchValue({
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          phoneNumber: this.userData.phoneNumber,
          location: this.userData.location
        });
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  getUserIdFromToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.sub || null;
        } catch (e) {
          console.error('Invalid token', e);
        }
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.userService.updateUser(userId, {
          first_name: this.profileForm.value.firstName,
          last_name: this.profileForm.value.lastName,
          phone_number: this.profileForm.value.phoneNumber,
          location: this.profileForm.value.location,
          email: this.userData.email
        }).subscribe({
          next: () => {
            this.router.navigate(['/profile']);
          },
          error: (err) => console.error('Update failed', err)
        });
      }
    } 
  }

}
