import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

  availableProducts: Boolean = true;
   // products in cart
   products = [
    { id: 1, name: 'Old Uniform', price: 99.00, image: 'https://old-souqs.sirv.com/Products/1f1.jpg', quantity: 1 },
    { id: 2, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 3, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 4, name: 'Leather Gloves', price: 49.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 5, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 6, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 }
  ];
  totalCount =   this.products.length;

  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

}
