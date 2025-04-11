import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit {
  constructor(private router: Router,
    private productService: ProductService,
  ) { }

  productId: number | null = null;
  ngOnInit() {
    this.fetchProductById()
    if (typeof window !== 'undefined') {
      this.productId = window.history.state.productId;
    }
    console.log('Product ID:', this.productId);
  }

  products: { id: string; name: string; description:string; price: number; image: string; stock: number }[] = [];
  fetchProductById() {
    this.productService.getProductById(String(this.productId)).subscribe({
      next: (data) => {
        this.products = data.map((product: any) => ({
          id: product.ID,
          name: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          stock: product.stock,
        }));
      }
    })
  }


  selectedIndex = 0;
  transitioning = false;
  direction: 'left' | 'right' = 'left';

  changeImage(index: number) {
    if (this.selectedIndex === index) return;
    this.direction = index > this.selectedIndex ? 'left' : 'right';
    this.transitioning = true;
    setTimeout(() => {
      this.selectedIndex = index;
      this.transitioning = false;
    }, 300); // Match CSS transition
  }








  Counter: number = 1
  increaseQuantity() {
    if (this.Counter < this.products[0].stock) {
      this.Counter++;
    }

  }

  decreaseQuantity() {
    if (this.Counter > 1) {
      this.Counter--;

    }
  }
  relatedProducts = [
    { id: 1, name: "Cityscape Painting", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
    { id: 2, name: "Golden Globe", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
    { id: 3, name: "Cylinder Hat", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
    { id: 4, name: "Wall Sconce", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
  ];
  hoveredItem: any = null; // Tracks the currently hovered product

  showProductActions(product: any): void {
    this.hoveredItem = product; // Set hovered item
  }

  hideProductActions(): void {
    this.hoveredItem = null; // Reset on mouse leave
  }
  // to send the product id to the product page when clicking on a product name


  goToProduct(id: number) {
    this.router.navigate(['/product'], { state: { productId: id } });
  }


}
