import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { EventBusService } from '../event-bus.service';
import { Subscription } from 'rxjs';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  currentIndex: number = 0;
  intervalId: any;
  transitionStyle: string = 'transform 0.5s ease-in-out';
  announcements: any[] = [];
  wishlistCount: number = 0;
  wishlistedProductIds: Set<string> = new Set();

  private readonly announcementKey = 'sliderMessages';

  private getAnnouncements(){
        this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
      },
      error: (err) => {
        console.error('Failed to get the announcements:', err);
        alert('Failed to get the announcements.');
      }
    });
  }

  constructor(private cartService: CartService,
    private router: Router,
    private tokenService: TokenService,
    private ngZone: NgZone,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private eventBus: EventBusService,
    private announcementService: AnnouncementService) {

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
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
    this.subscription.unsubscribe();
  }

  isLoggedIn = false;
  products: CartItem[] = []
  totalAmount: number = 0;

  ngOnInit() {
    this.subscription = this.eventBus.openCart$.subscribe(() => {
      this.openCart();
    });
    this.cartService.cart$.subscribe(items => {
      this.products = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
    this.checkLoginStatus();

    this.getAnnouncements();

    // for search 
    this.productService.getProducts().subscribe(
      products => {
        this.allProducts = products;
      },
      error => console.error('Error loading products:', error)
    );
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
  openCart(){
    this.isCartVisible = true;
  }

  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      title: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      stock: product.Stock
    };
    this.toggleCart();
    this.cartService.addToCart(item);
  }

  increaseQuantity(item: CartItem) {
    if(item.quantity<item.stock)
      this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeProductFromCart(id: string) {
    this.cartService.removeFromCart(id);
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

  allProducts: any[] = [];
  filteredResults: any[] = [];
  query = '';
  showDropdown = false;

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    this.query = input;

    if (this.query) {
      this.filteredResults = this.allProducts.filter(product =>
        (product.title || '').toLowerCase().includes(this.query.toLowerCase())
      );
      this.showDropdown = true;
    } else {
      this.filteredResults = [];
      this.showDropdown = false;
    }
  }

  goToSearch(): void {
    if (this.query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.query.trim() } });
      this.showDropdown = false;
      this.closeSearch();
    }
  }

  goToProduct(id: string) {
  this.router.navigate(['/product', id]);
}


  loadWishlistCount(): void {
    const token = this.tokenService.getToken();
    if (!token) return;

    this.wishlistService.getWishlist().subscribe({
      next: (wishlistIds) => {
        this.wishlistCount = wishlistIds.length;
        this.wishlistedProductIds = new Set(wishlistIds);
        localStorage.setItem("wishlistCount", String(this.wishlistCount));
        localStorage.setItem("wishlistProductIds", JSON.stringify([...this.wishlistedProductIds]));
      },
      error: (err) => console.error('Error fetching wishlist:', err)
    });
  }
  checkout(): void {
    // Navigate to checkout page
    this.router.navigate(['/checkout'], { state: { productFrom: 'cart' } });

  }
}
