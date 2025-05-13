import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
import { EventBusService } from '../../shared/event-bus.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})

export class WishlistComponent implements OnInit {
  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private eventBus: EventBusService
  ) { }

  availableProducts = true;
  products: any[] = [];
  totalCount = 0;
  loading = true;

  ngOnInit() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        this.fetchWishlist();
      }
      else{
        this.router.navigate(['/login']);
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }


  fetchWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        console.log('Raw wishlist items:', data);

        const productIds = data.map(item => item.productId);
        this.totalCount = productIds.length;
        this.availableProducts = productIds.length > 0;

        if (productIds.length === 0) {
          this.products = [];
          this.loading = false;
          return;
        }

        this.productService.getProductsByIds(productIds).subscribe({
          next: (products) => {
            this.products = products;
            this.totalCount = products.length;
            this.loading = false;
            console.log('Fetched wishlist products:', this.products);
          },
          error: (err) => {
            console.error('Failed to fetch products by IDs:', err);
            this.products = [];
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch wishlist', err);
        this.products = [];
        this.availableProducts = false;
        this.loading = false;
      }
    });
  }

  removeProduct(index: number, productId: string) {
    this.products.splice(index, 1);
    this.totalCount = this.products.length;
    this.availableProducts = this.products.length > 0;
    this.wishlistService.removeFromWishlist(productId);
  }

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

  goToProduct(id: string) {
    this.router.navigate(['/product'], { state: { productId: id } });
  }
  addToCart(product: any): void {
      const item: CartItem = {
        id: product.ID,
        title: product.Title,
        image: product.Image,
        price: product.Price,
        quantity: 1
      };
      this.cartService.addToCart(item);
      this.eventBus.triggerOpenCart();
    }
    checkout(productID: string): void {
      // Navigate to checkout page
      this.router.navigate(['/checkout'], { state: { productFrom: 'wishlist' ,productIdToBuy: productID} });
  
    }
}
