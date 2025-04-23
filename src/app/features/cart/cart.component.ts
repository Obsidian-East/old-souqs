import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit{
  products: any[] = [];
  totalAmount = 0;
  items: {id: string, qty: number}[] = []

  Countries = ['--', 'Australia', 'Austria', 'Belgium', 'Canada', 'Denmark', 'Finland', 'France', 'Germany', 'Ireland', 'Italy']
  selectedCountry: string = this.Countries[0]; // Set the 3rd item as default selected

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((cart) => {
      this.products = cart.items;
      this.updateTotal();
    });
  }

  increaseQuantity(product: any) {
    product.quantity++;
    this.cartService.updateQuantity(product.productId, product.quantity).subscribe(() => {
      this.updateTotal();
    });
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.updateQuantity(product.productId, product.quantity).subscribe(() => {
        this.updateTotal();
      });
    }
  }

  removeProduct(index: number, productId: string) {
    this.cartService.removeItem(productId).subscribe(() => {
      this.products.splice(index, 1);
      this.updateTotal();
    });
  }

  updateTotal() {
    this.totalAmount = this.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

  onSelect(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
  }

}
