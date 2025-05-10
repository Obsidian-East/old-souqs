import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  showButton: boolean = false;

  constructor(private translate: TranslateService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 300; // Show button after scrolling 300px
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isCompanyInfoVisible: boolean = false;
  isQuickActionsVisible: boolean = false;

  toggleQuickActions() {
    this.isQuickActionsVisible = !this.isQuickActionsVisible;
  }

  toggleCompanyInfo() {
    this.isCompanyInfoVisible = !this.isCompanyInfoVisible;
  }
  currentLanguage: 'en' | 'ar' = 'en';

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLanguage); 
  }

}
