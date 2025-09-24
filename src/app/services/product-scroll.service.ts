import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductScrollService {
  // This property will hold the ID of the last product the user clicked on.
  public lastClickedProductId: string | null = null;

  constructor() { }
}