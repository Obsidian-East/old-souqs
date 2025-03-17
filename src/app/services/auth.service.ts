import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlSignup = 'https://oldsouqs-backend-production.up.railway.app/signup';
  private apiUrlLogin = 'https://oldsouqs-backend-production.up.railway.app/login';

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrlSignup, JSON.stringify(userData), { headers });
  }

  login(credentials: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrlLogin, credentials);
  }
  
}
