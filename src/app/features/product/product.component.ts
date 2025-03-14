import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  constructor(private router: Router) {}
  productId: number | null = null;
  ngOnInit() {
    if (typeof window !== 'undefined') { //  Ensure we are in the browser
      this.productId = window.history.state.productId;
    }
     console.log('Product ID:', this.productId);
  }
  products = [
    { id: 1, name: 'Old Uniform', price: '$99.00', image:[ 'https://old-souqs.sirv.com/Essential/logo.png', 'https://old-souqs.sirv.com/Essential/logo.png', 'https://old-souqs.sirv.com/Essential/logo.png'],instock:true, quantity: 6 ,brand:"salford Co.", description: "Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor. Aquia sit amet, elitr, sed diam nonum eirmod tempor invidunt labore et dolore magna aliquyam.erat, sed diam voluptua. At vero accusam et justo duo dolores et ea rebum. Stet clitain vidunt ut labore eirmod tempor invidunt magna aliquyam. Stet clitain vidunt ut labore."},
  ];
  

  selectedImage: string = this.products[0].image[0]; // Initially set to first image
  isTransitioning: boolean = false;

  changeImage(newImage: string) {
    this.isTransitioning = true;
    setTimeout(() => {
      this.selectedImage = newImage;
      this.isTransitioning = false;
    }, 300); // Match CSS transition duration
  }


  Counter: number = 1
  increaseQuantity() {
    if(this.Counter < this.products[0].quantity){
      this.Counter ++;
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
