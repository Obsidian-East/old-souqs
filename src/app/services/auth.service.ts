import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlSinup = 'https://oldsouqs-backend-production.up.railway.app/signup';

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(this.apiUrlSinup, userData);
  }
}
