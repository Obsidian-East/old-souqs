import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  showButton: boolean = false;
  currentLanguage: string = "";

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public lang: LanguageService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.onLangChange.subscribe((event) => {
        this.currentLanguage = event.lang;
      });
    }
  }

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

  toggleLanguage() {
    this.lang.toggleLanguage();
  }

}
