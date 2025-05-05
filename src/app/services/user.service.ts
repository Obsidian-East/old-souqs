import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'https://oldsouqs-backend-production.up.railway.app/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userId: string, data: Partial<any>): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${userId}`, data);
  }

  deleteUser(userId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${userId}`);
  }
}