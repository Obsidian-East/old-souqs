import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Announcement {
  id?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AnnouncementService {
  private baseUrl = 'https://oldsouqs-backend-production.up.railway.app/announcements'; // Adjust base URL as needed

  constructor(private http: HttpClient) { }

  getAllAnnouncements() {
    return this.http.get<any[]>(this.baseUrl);
  }

  createAnnouncement(data: { message: string }): Observable<Announcement> {
    return this.http.post<Announcement>(this.baseUrl, data);
  }

  updateAnnouncement(id: string, data: { message: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteAnnouncement(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
