import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module'; // Import SharedModule

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule], // Import SharedModule here
})
export class HomeModule { }
