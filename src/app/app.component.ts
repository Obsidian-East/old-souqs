import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { TranslateModule } from "@ngx-translate/core";
import { TranslateService } from "@ngx-translate/core";
import { RouterOutlet } from '@angular/router';
import { HomeModule } from './features/home/home.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, TranslateModule, RouterOutlet, HomeModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Old Souqs';
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
