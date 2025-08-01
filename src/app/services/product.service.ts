import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private apiCollectionUrl = 'https://oldsouqs-backend-production.up.railway.app/collections';
    private apiCollectionUrlAr = 'https://oldsouqs-backend-production.up.railway.app/ar/collections';
    private apiProductUrl = 'https://oldsouqs-backend-production.up.railway.app/products';
    private apiProductUrlAr = 'https://oldsouqs-backend-production.up.railway.app/ar/products';
    private baseUrl = 'https://oldsouqs-backend-production.up.railway.app';
    private language: string = "en";

    constructor(private http: HttpClient) { }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && !!window.localStorage;
    }

    private getLanguage(): string {
        if (this.isBrowser()) {
            return localStorage.getItem('lang') || 'en';
        }
        return "en";
    }

    // Fetch multiple products by IDs
    getProductsByIds(productIds: string[]): Observable<any[]> {
        this.language = this.getLanguage()
        if (this.language == "en") {
            return this.http.post<any[]>(`${this.apiProductUrl}/ids`, { productIds });
        } else {
            return this.http.post<any[]>(`${this.apiProductUrlAr}/ids`, { productIds });
        }
    }

    // Fetch products by collection ID
    getProductsByCollection(collectionId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiCollectionUrl}/${collectionId}/products`);
    }

    //Fetch all products
    getProducts(): Observable<any> {
        this.language = this.getLanguage()
        if (this.language == "en") {
            return this.http.get<any[]>(`${this.apiProductUrl}`)
        } else {
            return this.http.get<any[]>(`${this.apiProductUrlAr}`)
        }
    }

    getProductById(productId: string): Observable<any> {
        this.language = this.getLanguage()
        if (this.language == "en") {
            return this.http.get<any>(`${this.apiProductUrl}/${productId}`)
        } else {
            return this.http.get<any>(`${this.apiProductUrlAr}/${productId}`)
        }
    }

    adminGetProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiProductUrl}?isAdmin=true`);
    }

    adminGetProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiProductUrl}/${id}?isAdmin=true`);
    }

    createProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiProductUrl, product, { headers });
    }

    updateProduct(id: string, product: Product): Observable<Product> {
        // CORRECTED: ID is now a PATH parameter
        const url = `${this.apiProductUrl}/${id}`; // <--- This is the correct way
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<Product>(url, product, { headers });
    }

    deleteProduct(id: string): Observable<void> {
        const url = `${this.apiProductUrl}/${id}`;
        return this.http.delete<void>(url);
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.baseUrl}/api/upload`, formData);
    }

    addProduct(product: any) {
        return this.http.post(`${this.baseUrl}/products`, product);
    }

    // Collections related methods
    getCollections(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiCollectionUrl}`);
    }

    updateCollection(collectionId: string, updatedData: any): Observable<any> {
        const url = `${this.baseUrl}/collections/${collectionId}`;
        return this.http.put(url, updatedData);
    }

    addCollection(newData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/collections`, newData);
    }

    deleteCollection(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}/collections/${id}`);
    }

}
