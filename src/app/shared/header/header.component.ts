import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { CartStateService } from '../../services/cart-state.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  products: CartItem[] = []
  totalAmount: number = 0;

  constructor(private cartService: CartService, 
    private router: Router, 
    private tokenService: TokenService,) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.products = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
    this.checkLoginStatus();
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

  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      title: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    };
    this.cartService.addToCart(item);
  }

  increaseQuantity(item: CartItem) {
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
