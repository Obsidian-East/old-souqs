import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;                  // Mongo-generated _id
  orderId: string;             // "OSXXXX"
  userId: string;
  userLocation: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  discounted: boolean;
  creationDate: string;        // ISO timestamp
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly baseUrl = 'https://oldsouqs-backend-production.up.railway.app/orders';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all orders (admin or history view)
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}`);
  }

  /**
   * Fetch a single order by its orderId
   */
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  /**
   * Place a new order for the current user
   * The backend pulls cart by userId and converts to order
   */
  createOrder(userId: string, orderData: any): Observable<Order>  {
    return this.http.post<Order>(`${this.baseUrl}/${userId}`, orderData);
  }

  /**
   * Update arbitrary order fields
   */
  updateOrder(orderId: string, update: Partial<Order>): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${orderId}`, update);
  }

  /**
   * Delete an order by its orderId
   */
  deleteOrder(orderId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${orderId}`);
  }
}
