import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  products: CartItem[] = [];
  totalAmount = 0;

  Countries = ['--', 'Australia', 'Austria', 'Belgium', 'Canada', 'Denmark', 'Finland', 'France', 'Germany', 'Ireland', 'Italy'];
  selectedCountry: string = this.Countries[0];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the cart observable
    this.cartService.cart$.subscribe(items => {
      this.products = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeProduct(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  getTotalPrice(item: CartItem): number {
    return this.cartService.getTotalAmount();
  }

  onSelect(event: Event): void {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
  }

  checkout(): void {
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }

  goToProduct(id: string) {
		this.router.navigate(['/product'], { state: { productId: id } });
	}
}
