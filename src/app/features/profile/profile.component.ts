import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor( private router: Router) { }  // Inject Router

  userData = {firstname: 'Cynthia', lastname: 'Farah', email: 'cynthiafarah@gmail.com', address: 'Beqaa Lebanon'};

  orderExists: boolean = false;

  goToWishlist(){
    this.router.navigate(['/wishlist']);
  }

  Logout(){

  }
  goToEditProfile(){
    this.router.navigate(['/editprofile']);
  }

}
