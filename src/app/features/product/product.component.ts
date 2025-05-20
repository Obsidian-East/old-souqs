import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
import { EventBusService } from '../../shared/event-bus.service';


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
    private cartService: CartService,
        private eventBus: EventBusService
  ) { }

  // to zoom the img
   zoomActive = false;
  zoomOffset = { left: 0, top: 0 };

  @ViewChild('source', { static: false }) sourceRef!: ElementRef;
  @ViewChild('zoomImage', { static: false }) zoomImageRef!: ElementRef;
  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  onMouseEnter() {
    this.zoomActive = true;
  }

  onMouseLeave() {
    this.zoomActive = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.sourceRef || !this.zoomImageRef || !this.containerRef) return;

    const sourceRect = this.sourceRef.nativeElement.getBoundingClientRect();
    const zoomRect = this.zoomImageRef.nativeElement.getBoundingClientRect();
    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();

    const xRatio = (zoomRect.width - containerRect.width) / sourceRect.width;
    const yRatio = (zoomRect.height - containerRect.height) / sourceRect.height;

    const left = Math.max(Math.min(event.pageX - sourceRect.left, sourceRect.width), 0);
    const top = Math.max(Math.min(event.pageY - sourceRect.top, sourceRect.height), 0);

    this.zoomOffset = {
      left: -left * xRatio,
      top: -top * yRatio
    };
  }

  isLoading: boolean = true;
  productId: string | null = null;
  
  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.productId = window.history.state.productId;
      if (this.productId) {
        this.fetchProductById();
      } else {
        console.error('No Product ID received');
      }
    }
  }

  // currentProduct: any;
  relatedProducts: any[] = [];

  product: { id: string; name: string; description:string; price: number; image: string; stock: number;tag:string }| null = null;
  fetchProductById() {
    this.productService.getProductById(this.productId!).subscribe({
      next: (product: any) => {
        console.log(product)
        this.product = {
          id: product.id,
          name: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          stock: product.stock,
          tag: product.tag || [],
        };
        this.fetchRelatedProducts(this.product.tag[0]); // take the first collection for now

        this.isLoading = false; // stop loading after data is ready
      },
      
      error: (err) => {
        console.error('Error fetching product:', err);
        this.isLoading = false; // also stop loading if error
      }
    });
  }
  fetchRelatedProducts(collectionName: string) {
    this.productService.getCollections().subscribe({
      next: (collectionsData) => {
        console.log('All collections:', collectionsData);
  
        // Find the collection by name
        const collection = collectionsData.find((col: any) => col.CollectionName === collectionName);
        console.log(collection)
  
        if (!collection) {
          console.error('Collection not found');
          return;
        }
  
        // Filter out current product ID from related products
        const relatedProductIds = Array.isArray(collection.ProductIds)
        ? collection.ProductIds.filter((id: string) => id !== this.productId)  // Filter out the current product's ID
        : []; 
        if (relatedProductIds.length === 0) {
          console.log('No related products found.');
          this.relatedProducts = [];
          return;
        }
  
        // Fetch all products to match related product IDs
        this.productService.getProductsByIds(relatedProductIds).subscribe({
          next: (allProducts) => {
            console.log("all prod", allProducts)
            // Filter products by the related product IDs and map them into a simplified format
            this.relatedProducts = allProducts
              // .filter((product: any) => relatedProductIds.includes(product.id))
              .map((product: any) => ({
                id: product.ID,
                name: product.Title,
                price: +product.Price,
                image: product.Image
              }));
  
            // Limit to max 4 related products
            if (this.relatedProducts.length > 4) {
              this.relatedProducts = this.relatedProducts.slice(0, 4);
            }
  
            console.log('Related products:', this.relatedProducts);
          },
          error: (err) => {
            console.error('Error fetching products:', err);
            this.relatedProducts = [];
          }
        });
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
        this.relatedProducts = [];
      }
    });
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
    if (!this.product) return; // If product not loaded, stop.
  
    const stock = this.product.stock ?? 0;
    if (this.Counter < stock) {
      this.Counter++;
    }
  }
  

  decreaseQuantity() {
    if (this.Counter > 1) {
      this.Counter--;

    }
  }
  
  hoveredItem: any = null; // Tracks the currently hovered product

  showProductActions(product: any): void {
    this.hoveredItem = product; // Set hovered item
  }

  hideProductActions(): void {
    this.hoveredItem = null; // Reset on mouse leave
  }
  // to send the product id to the product page when clicking on a product name


  goToProduct(id: string) {
    this.router.navigate(['/product'], { state: { productId: id } });
  }
  addToCart(product: any): void {
    const item: CartItem = {
      id: product.id,
      title: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    };
    this.cartService.addToCart(item);
    this.eventBus.triggerOpenCart();
    }


}
