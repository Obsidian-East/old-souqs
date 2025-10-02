// src/app/app.config.ts

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './routing/custom-reuse-strategy';
import { HttpClient, provideHttpClient, withFetch } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routes } from './app-routing.module';

const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure routing once
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })),
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    // Provide application-wide services
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(FormsModule),

    // Import providers from NgModules
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};