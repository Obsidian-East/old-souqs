import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FadeInOnScrollDirective } from './directives/fade-in-on-scroll.directive';
import { HlsVideoPlayerComponent } from '../features/hls-video-player/hls-video-player.component';

@NgModule({
  declarations:[HeaderComponent, FooterComponent, HlsVideoPlayerComponent, FadeInOnScrollDirective],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  exports: [HeaderComponent, TranslateModule, FooterComponent, HlsVideoPlayerComponent, FadeInOnScrollDirective]
})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}