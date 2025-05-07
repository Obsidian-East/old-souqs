import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  constructor(
    private router: Router,
    private wishlistService: WishlistService
  ) { }

  availableProducts = true;
  products: any[] = [];
  totalCount = 0;
  loading = true;

  ngOnInit() {
    this.fetchWishlist();
  }


  fetchWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.products = data;
        this.totalCount = data.length;
        this.availableProducts = data.length > 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch wishlist', err);
        this.availableProducts = false;
        this.loading = false;
      }
    });
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.totalCount = this.products.length;
    this.availableProducts = this.products.length > 0;
  }

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }

  goToProduct(id: string) {
    this.router.navigate(['/product'], { state: { productId: id } });
  }

}
