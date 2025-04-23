import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // 👈 ensures it's a singleton across the app
})
export class CartStateService {
  private cartItems = new Map<string, number>();

  constructor(private productService: ProductService) {}

  addProduct(productId: string) {
    const currentQty = this.cartItems.get(productId) || 0;
    this.cartItems.set(productId, currentQty + 1);
  }

  removeProduct(productId: string) {
    this.cartItems.delete(productId);
  }

  getCartItems(): { productId: string; quantity: number }[] {
    return Array.from(this.cartItems.entries()).map(([productId, quantity]) => ({
      productId,
      quantity
    }));
  }

  getQuantity(productId: string): number {
    return this.cartItems.get(productId) || 0;
  }

  clearCart() {
    this.cartItems.clear();
  }

  getTotalAmount(): Observable<number> {
    const items = this.getCartItems();
  
    if (items.length === 0) {
      return new Observable(observer => {
        observer.next(0);
        observer.complete();
      });
    }
  
    const productObservables = items.map(item =>
      this.productService.getProductById(item.productId).pipe(
        map(product => product.price * item.quantity)
      )
    );
  
    return forkJoin(productObservables).pipe(
      map(prices => prices.reduce((sum, value) => sum + value, 0))
    );
  }
  
}
