import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { LanguageService } from './language.service';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private apiCollectionUrl = 'https://oldsouqs-backend-production.up.railway.app/collections';
    private apiProductUrl = 'https://oldsouqs-backend-production.up.railway.app/products';
    private baseUrl = 'https://oldsouqs-backend-production.up.railway.app';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private lang: LanguageService,
    ) { }

    private getLanguage(): 'en' | 'ar' {
        if (isPlatformBrowser(this.platformId)) {
            const path = window.location.pathname;
            if (path.startsWith('/ar')) return 'ar';
        }
        return this.lang.currentLang === 'ar' ? 'ar' : 'en';
    }


    private getApiUrl(endpoint: string): string {
        const lang = this.getLanguage();
        return lang === 'ar'
            ? `${this.baseUrl}/ar/${endpoint}`
            : `${this.baseUrl}/${endpoint}`;
    }
    // Fetch multiple products by IDs
    getProductsByIds(productIds: string[]): Observable<any[]> {
        const url = this.getApiUrl('products/ids');
        return this.http.post<any[]>(url, { productIds });
    }

    /** Get all products for a collection */
    getProductsByCollection(collectionId: string): Observable<Product[]> {
        return this.http.get<Product[]>(this.getApiUrl(`collections/${collectionId}/products`));
    }

    /** Get all products */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.getApiUrl('products'));
    }

    /** Get one product by ID */
    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(this.getApiUrl(`products/${id}`));
    }

    /** Admin (always English) */
    adminGetProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products?isAdmin=true`);
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
    getCollectionById(collectionId: string): Observable<any> {
        return this.http.get<any>(`${this.apiCollectionUrl}/${collectionId}`);
    }

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

    //Discounts related methods
    getDiscounts(): Observable<any> {
        return this.http.get(`${this.baseUrl}/discounts`);
    }

    createDiscount(discount: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/discounts`, discount);
    }

    updateDiscount(id: string, discount: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/discounts/${id}`, discount);
    }

    deleteDiscount(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/discounts/${id}`);
    }


}
