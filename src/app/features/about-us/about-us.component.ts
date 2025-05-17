import { AfterViewInit, Component, Inject,PLATFORM_ID  } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent{
  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // ngAfterViewInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const elements = document.querySelectorAll('.fade-in-start');
  
  //     const observer = new IntersectionObserver((entries) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add('visible');
  //         } else {
  //           entry.target.classList.remove('visible'); // 👈 reset animation
  //         }
  //       });
  //     }, {
  //       threshold: 0.1
  //     });
  
  //     elements.forEach(el => observer.observe(el));
  //   }
  // }
  
  

}
