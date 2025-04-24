import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartKey = 'cart';

  // Internal state
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // Load from localStorage
  private loadCart(): CartItem[] {
    if (!this.isBrowser()) return [];
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  // Persist to localStorage and emit
  private saveCart(cart: CartItem[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  // Public API
  getCart(): CartItem[] {
    return this.cartSubject.getValue();
  }

  addToCart(item: CartItem): void {
    const cart = this.loadCart();
    const idx = cart.findIndex(i => i.id === item.id);

    if (idx > -1) {
      cart[idx].quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }

    this.saveCart(cart);
  }

  updateQuantity(id: string, quantity: number): void {
    const cart = this.loadCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) {
      cart[idx].quantity = quantity;
      this.saveCart(cart);
    }
  }

  removeFromCart(id: string): void {
    const cart = this.loadCart().filter(i => i.id !== id);
    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartSubject.next([]);
  }

  // Utility
  getTotalAmount(): number {
    return this.getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
