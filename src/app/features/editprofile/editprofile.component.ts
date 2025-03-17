import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css'
})
export class EditprofileComponent {

  constructor( private router: Router) { }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

  userData = {firstname: 'Cynthia', lastname: 'Farah',phonenumber:'0096171000000', email: 'cynthiafarah@gmail.com', location: 'Beqaa Lebanon', profilepic: 'https://old-souqs.sirv.com/Essential/logo.png'};






  profileImage: string  = this.userData.profilepic;
  errorMessage: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file: File = input.files[0];

      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'File size should be less than 2MB.';
        return;
      }

      // File is valid, read and preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Clear error message
      this.errorMessage = '';
    }
  }

}
