import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SirvService {
  private clientId = 'YJSw6mQ8yagO4n37YEXPhKto3kE';
  private clientSecret = 'i0G1wKuzM+qa7VLV3PCaZJjwyONW+J4bdZNoCM+WUgpSdFktUZNR3SqDDLFUxtvrm0/HVLOxlPRwORLl9L70xg==';
  private apiBase = 'https://api.sirv.com';

  constructor(private http: HttpClient) {}

  getAccessToken(): Promise<string> {
    const cachedToken = localStorage.getItem('sirvToken');
    if (cachedToken) return Promise.resolve(cachedToken);

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<any>(`${this.apiBase}/v2/token`, body.toString(), { headers }).toPromise().then((res) => {
      const token = res.access_token;
      localStorage.setItem('sirvToken', token);
      return token;
    });
  }

  uploadImage(token: string, file: File, sirvPath: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', sirvPath);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // DO NOT set Content-Type here
    });

    return this.http.post(`${this.apiBase}/v2/files/upload`, formData, { headers });
  }
}
