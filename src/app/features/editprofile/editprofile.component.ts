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



}
