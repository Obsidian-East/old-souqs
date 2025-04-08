import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {

 // code for menu for tablet and mobile
    // show and hide the cart div
    isMenuVissible = false; // Initially hidden

    openMenu() {
      this.isMenuVissible = !this.isMenuVissible; // Toggle visibility
    }
  
    closeMenu(){
      this.isMenuVissible = false;
    }

// show and hide the cart div
  isCartVisible = false; // Initially hidden

  toggleCart() {
    this.isCartVisible = !this.isCartVisible; // Toggle visibility
  }

  closeCart(){
    this.isCartVisible = false;
  }

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


    // code for search
    // show and hide the cart div
  isSearchVisible = false; // Initially hidden

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible; // Toggle visibility
  }

  closeSearch(){
    this.isSearchVisible = false;
  }
  searchProducts = [
    { id: 1, name: 'Old Uniform', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 2, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 3, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 4, name: 'Leather Gloves', price: 49.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 5, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 6, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 }
  ];
  totalSearch = this.searchProducts.length

  isSearchResultVisible = false;
  textValue: string = '';

  searchChange(event: any){
    this.textValue = event.target.value;
    if(this.textValue)
        this.isSearchResultVisible=true;
    else 
        this.isSearchResultVisible=false;  
  }


  // to send the input field to the search page
  constructor(private router: Router) {}
        goToSearch() {
            if(this.textValue != '')
              this.router.navigate(['/search'], { state: { SearchText: this.textValue } });
        }
}
