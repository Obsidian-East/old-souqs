import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private baseUrl = 'https://oldsouqs-backend-production.up.railway.app/';

  constructor(private http: HttpClient) {}

  private getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
    return null;
  }

  getWishlist(): Observable<any[]> {
    const userId = this.getUserId();
    if (!userId) throw new Error('User ID not found');

    return this.http.get<any>(`${this.baseUrl}/wishlist?userId=${userId}`).pipe(
      switchMap((items) => {
        const requests = (items as any[]).map((item) =>
          this.http.get(`${this.baseUrl}/products/${item.productId}`)
        );
        return forkJoin(requests);
      })
    );
  }

  addToWishlist(userId: string, productId: string): Observable<any> {
    const body = {
      userId,
      productId
    };
    return this.http.post(`${this.baseUrl}/wishlist`, body);
  }
}
