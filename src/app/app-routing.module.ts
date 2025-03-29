import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignupComponent } from './features/signup/signup.component';
import { LoginComponent } from './features/login/login.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { ExploreComponent } from './features/explore/explore.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductComponent } from './features/product/product.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SearchComponent } from './features/search/search.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { EditprofileComponent } from './features/editprofile/editprofile.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PasswordComponent } from './features/password/password.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'explore', component: ExploreComponent},
  { path: 'cart', component: CartComponent},
  { path: 'product', component: ProductComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'search', component: SearchComponent},
  { path: 'wishlist', component: WishlistComponent},
  { path: 'editprofile', component: EditprofileComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'password', component: PasswordComponent}
];

@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export { routes };