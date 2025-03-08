import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignupComponent } from './features/signup/signup.component';
import { LoginComponent } from './features/login/login.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { ExploreComponent } from './features/explore/explore.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'explore', component: ExploreComponent}
];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export { routes };