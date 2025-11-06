import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule,  isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Old Souq';
  constructor(private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

   ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const lang = window.location.pathname.startsWith('/ar') ? 'ar' : 'en';
      this.translate.use(lang);
    }
  }
}