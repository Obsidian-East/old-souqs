import { Component, OnInit,NgZone,OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartStateService } from '../../services/cart-state.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  // messages: string[] = ['Welcome to Old Souq!', 'Discover rare antiques today!'];
  currentIndex: number = 0;
  intervalId: any;
  transitionStyle: string = 'transform 0.5s ease-in-out';
  announcements: string[] = [];

  private readonly announcementKey = 'sliderMessages';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private getAnnouncements(): string[] {
    if (!this.isBrowser()) return ['Welcome to Old Souq!'];
    const stored = localStorage.getItem(this.announcementKey);
    return stored ? JSON.parse(stored) : ['Welcome to Old Souq!', 'Discover rare antiques today!','helloo'];
  }

  constructor(private cartService: CartService, 
    private router: Router, 
    private cartStateService: CartStateService,
    private tokenService: TokenService,
    private ngZone: NgZone) {

      this.ngZone.runOutsideAngular(() => {
        this.intervalId = setInterval(() => {
          // re-enter Angular zone only when updating view
          this.ngZone.run(() => this.showNextSlide());
        }, 5000);
      });
    }

  
  showNextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
  }

  showPrevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.announcements.length) % this.announcements.length;
  }

  getTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
  isLoggedIn = false;
  products: any[] = [];
  totalAmount: number = 0;


  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.products = items;
      this.cartStateService.getTotalAmount().subscribe(total => {
        this.totalAmount = total
      });
    });
    this.checkLoginStatus();

    this.announcements = this.getAnnouncements();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.tokenService.isLoggedIn();
  }

  onProfileClick(): void {
    const token = this.tokenService.getToken();

    if (!token || this.tokenService.isTokenExpired(token)) {
      this.isLoggedIn = false;
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']); // or open a login modal
    } else {
      this.router.navigate(['/profile']);
    }
  }

  isMenuVissible = false; // Initially hidden

  openMenu() {
    this.isMenuVissible = !this.isMenuVissible; // Toggle visibility
  }

  closeMenu() {
    this.isMenuVissible = false;
  }

  // show and hide the cart div
  isCartVisible = false; // Initially hidden

  toggleCart() {
    this.isCartVisible = !this.isCartVisible; // Toggle visibility
  }

  closeCart() {
    this.isCartVisible = false;
  }

  increaseQuantity(product: any) {
    this.cartService.updateQuantity(product, product.quantity + 1);
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      this.cartService.updateQuantity(product, product.quantity - 1);
    }
  }

  removeProduct(index: number) {
    const cartItems = this.cartStateService.getCartItems();
    const item = cartItems[index];
  
    if (!item) return;
  
    const productId = item.productId;
  
    this.cartStateService.removeProduct(productId);
    this.cartService.removeItem(productId).subscribe(() => {
      console.log(`Removed product with ID: ${productId}`);
    });
  }
  

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

  isSearchVisible = false; // Initially hidden

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible; // Toggle visibility
  }

  closeSearch() {
    this.isSearchVisible = false;
  }
  searchProducts = [
    { id: 1, name: 'Old Uniform', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 2, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 3, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 4, name: 'Leather Gloves', price: 49.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 5, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 6, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 }
  ];
  totalSearch = this.searchProducts.length

  isSearchResultVisible = false;
  textValue: string = '';

  searchChange(event: any) {
    this.textValue = event.target.value;
    if (this.textValue)
      this.isSearchResultVisible = true;
    else
      this.isSearchResultVisible = false;
  }

  goToSearch() {
    if (this.textValue != '')
      this.router.navigate(['/search'], { state: { SearchText: this.textValue } });
  }
}
