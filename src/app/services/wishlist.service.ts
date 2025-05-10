import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private baseUrl = 'https://oldsouqs-backend-production.up.railway.app';
  private wishlistProductIds = new Set<string>();

  constructor(private http: HttpClient) {}

  private getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  getWishlist(): Observable<any[]> {
    const userId = this.getUserId();
    if (!userId) return throwError(() => new Error("No userId found in token"));

    return this.http.get<any[]>(`${this.baseUrl}/wishlist?userId=${userId}`).pipe(
      tap(items => {
        this.wishlistProductIds.clear();
        items.forEach(item => {
          if (item.productId) {
            this.wishlistProductIds.add(item.productId);
          }
        });
      }),
      catchError(error => {
        console.error('Error fetching wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  addToWishlist(productId: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return throwError(() => new Error("No userId found in token"));

    return this.http.post(`${this.baseUrl}/wishlist?userId=${userId}`, {
      productId: productId
    }).pipe(
      tap(() => this.wishlistProductIds.add(productId))
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return throwError(() => new Error("No userId found in token"));

    return this.http.delete(`${this.baseUrl}/wishlist/${productId}?userId=${userId}`).pipe(
      tap(() => this.wishlistProductIds.delete(productId))
    );
  }

  toggleWishlist(productId: string): Observable<any> {
    if (this.isWishlisted(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistProductIds.has(productId);
  }
}
