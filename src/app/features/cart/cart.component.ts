import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
      // products in cart
      products = [
        { id: 1, name: 'Old Uniform', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
        { id: 2, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
        { id: 3, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
        { id: 4, name: 'Leather Gloves', price: 49.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
        { id: 5, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
        { id: 6, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 }
      ];
      totalAmount =   this.products.reduce((sum, product) => sum + this.getTotalPrice(product), 0);

    
      increaseQuantity(product: any) {
        product.quantity++;
        this.totalAmount =   this.products.reduce((sum, product) => sum + this.getTotalPrice(product), 0);

      }
    
      decreaseQuantity(product: any) {
        if (product.quantity > 1) {
          product.quantity--;
          this.totalAmount =   this.products.reduce((sum, product) => sum + this.getTotalPrice(product), 0);

        }
      }
    
      removeProduct(index: number) {
        this.products.splice(index, 1);
        this.totalAmount =   this.products.reduce((sum, product) => sum + this.getTotalPrice(product), 0);

      }
    
      getTotalPrice(product: any) {
        return product.price * product.quantity;
      }



      Countries = ['--','Australia','Austria','Belgium','Canada','Denmark','Finland','France','Germany','Ireland','Italy']
      selectedCountry: string = this.Countries[0]; // Set the 3rd item as default selected

      onSelect(event: Event) {
        this.selectedCountry = (event.target as HTMLSelectElement).value;
      }



}
