import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlSignup = 'https://oldsouqs-backend-production.up.railway.app/signup';
  private apiUrlLogin = 'https://oldsouqs-backend-production.up.railway.app/login';
  
  constructor(private http: HttpClient) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  signup(userData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrlSignup, userData, { headers }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  login(userData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrlLogin, userData, { headers }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  getProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('/api/profile', { headers });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  
}
