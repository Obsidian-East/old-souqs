import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
// show and hide the cart div
  isCartVisible = false; // Initially hidden

  toggleCart() {
    this.isCartVisible = !this.isCartVisible; // Toggle visibility
  }

  closeCart(){
    this.isCartVisible = false;
  }

  // products in cart
    // products = [
    //   { id: 1, name: 'Old Uniform', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
    //   { id: 2, name: 'Cylinder Hat', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
    //   { id: 3, name: 'Vintage Boots', price: '$79.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
    //   { id: 4, name: 'Leather Gloves', price: '$49.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
    //   { id: 5, name: 'Cylinder Hat', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
    //   { id: 6, name: 'Vintage Boots', price: '$79.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' }
    // ];

    // number: number = 1;

    // increment() {
    //   this.number++;
    // }

    // decrement() {
    //   if (this.number > 1) {
    //     this.number--;
    //   }
    // }

    // counter

  //   onInputChange(event: any) {
  //     let newValue = event.target.value;

  //   // Convert the value to a number
  //   let parsedValue = parseInt(newValue, 10);

  //   // If the parsed value is NaN (not a number) or less than 1, set it to 1
  //   if (isNaN(parsedValue) || parsedValue < 1) {
  //     this.number = 1;
  //   } else {
  //     this.number = parsedValue;
  //   }
  // }

  //   totalPrice = this.products.reduce((total, product) => {
  //     // Remove '$' and ',' from the price, then convert to number
  //     const price = parseFloat(product.price.replace('$', '').replace(',', ''));
  //     return total + price;
  //   }, 0);


    // Function to remove a product using its ID
    // remove(productId: number) {
    //   this.products = this.products.filter(product => product.id !== productId);
    // }



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

    
}
