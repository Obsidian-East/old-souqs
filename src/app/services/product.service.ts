import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiCollectionUrl = 'https://oldsouqs-backend-production.up.railway.app/collections';
    private apiProductUrl = 'https://oldsouqs-backend-production.up.railway.app/products';

    constructor(private http: HttpClient) { }

    // Fetch all collections
    getCollections(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiCollectionUrl}`);
    }

    // Fetch multiple products by IDs
    getProductsByIds(productIds: string[]): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiProductUrl}/ids`, { productIds });
    }

    // Fetch products by collection ID
    getProductsByCollection(collectionId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiCollectionUrl}/${collectionId}/products`);
    }

    //Fetch all products
    getProducts(): Observable<any> {
        return this.http.get<any[]>(`${this.apiProductUrl}`)
    }

    getProductById(productId: string): Observable<any>{
        return this.http.get<any[]>(`${this.apiProductUrl}/${ productId }`)
    }


     //  Search products by name
  searchProducts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiProductUrl}/search?q=${query}`);
  }

}
