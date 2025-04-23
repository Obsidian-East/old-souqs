import { Injectable } from '@angular/core';
import { jwtDecode }from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private readonly tokenKey = 'token';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;  // Use 'sub' since that's where the userId is
    } catch (e) {
      console.error("Failed to decode token:", e);
      return null;
    }
  }
   
}
