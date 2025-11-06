import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLang = 'en';
  private supportedLangs = ['en', 'ar'];
  currentLang: 'en' | 'ar' = 'en';
  currentLang$ = new BehaviorSubject<'en' | 'ar'>(this.currentLang);

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initLanguage();
  }

  /** Initialize language based on URL or saved preference */
  private initLanguage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const path = window.location.pathname;
    const langFromUrl = path.startsWith('/ar') ? 'ar' : 'en';
    const savedLang = localStorage.getItem('lang');

    const lang = this.supportedLangs.includes(savedLang || '')
      ? (savedLang as string)
      : langFromUrl;

    this.setLanguage(lang, false);
  }

  /** Get the current language */
  getCurrentLang(): string {
    return this.translate.currentLang || this.defaultLang;
  }

  /** Get prefix for router links, like '' or '/ar' */
  getLangPrefix(): string {
    return this.getCurrentLang() === 'ar' ? '/ar' : '';
  }

  /** Change language manually */
  setLanguage(lang: string, reload: boolean = true): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.supportedLangs.includes(lang)) lang = this.defaultLang;

    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    document.documentElement.lang = lang;

    if (reload) {
      const currentUrl = window.location.pathname;
      const isArabic = currentUrl.startsWith('/ar');
      const newUrl = lang === 'ar'
        ? (isArabic ? currentUrl : '/ar' + currentUrl)
        : currentUrl.replace(/^\/ar/, '') || '/';
      window.location.href = newUrl;
    }
  }

  /** Toggle between EN and AR */
  toggleLanguage(): void {
    const newLang = this.getCurrentLang() === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }
}
