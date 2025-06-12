import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  showButton: boolean = false;
  currentLanguage: string = "";

  constructor(private translate: TranslateService) {
    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('lang') || 'en';
      this.translate.use(savedLang);
      this.currentLanguage = savedLang;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 300; // Show button after scrolling 300px
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  isCompanyInfoVisible: boolean = false;
  isQuickActionsVisible: boolean = false;

  toggleQuickActions() {
    this.isQuickActionsVisible = !this.isQuickActionsVisible;
  }

  toggleCompanyInfo() {
    this.isCompanyInfoVisible = !this.isCompanyInfoVisible;
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLanguage);
    if (this.isBrowser()) {
      localStorage.setItem('lang', this.currentLanguage);
    }
  }

}
