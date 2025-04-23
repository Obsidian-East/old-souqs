import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'https://oldsouqs-backend-production.up.railway.app'; // Replace with your backend URL
  private userId = '67b384859e88cda0f13afee2'; // Replace with actual logged-in user ID logic

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cart?userId=${this.userId}`);
  }  

  addToCart(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart?userId=${this.userId}`, product);
  }

  addToCartItem(productId: string, quantity: number = 1): Observable<any> {
    const payload = { productId, quantity };
    return this.http.post(`${this.baseUrl}/cart?userId=${this.userId}`, payload);
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/${productId}?userId=${this.userId}`, { quantity });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/${productId}?userId=${this.userId}`);
  }
}
