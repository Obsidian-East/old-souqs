import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {

}
