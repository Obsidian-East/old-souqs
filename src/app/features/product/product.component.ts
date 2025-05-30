import { Component, OnInit, ElementRef, ViewChild,  Renderer2, HostListener, NgZone } from '@angular/core';
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
  @ViewChild('pinchImage') pinchImageRef!: ElementRef;

  scale = 1;
  lastScale = 1;
  startDistance = 0;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;
  lastTranslateX = 0;
  lastTranslateY = 0;
  isModalOpen = false;
  isHovering = false;
  isDragging = false;

  @ViewChild('zoomImage') zoomImageRef!: ElementRef;
  @ViewChild('zoomWrapper') zoomWrapperRef!: ElementRef;

  zoomStyles = {
    transform: 'scale(1) translate(0px, 0px)'
  };
// to open img popup
  openModal() {
    this.isModalOpen = true;
    this.resetZoom();
  }
// to close img popup
  closeModal() {
    this.isModalOpen = false;
    this.resetZoom();
  }
// for laptop
  onMouseEnter() {
    if (this.isTouchDevice()) return;
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
    this.resetZoom();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isHovering) return;

    const rect = this.zoomWrapperRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    this.translateX = (0.5 - x) * rect.width * 0.5;
    this.translateY = (0.5 - y) * rect.height * 0.5;
    this.scale = 2;

    this.updateTransform();
  }

  updateTransform() {
    this.zoomStyles = {
      transform: `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`
    };
  }

  isTouchDevice(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
  }
// for mobile and tablet
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.startDistance = this.getDistance(event.touches[0], event.touches[1]);
    } else if (event.touches.length === 1 && this.scale > 1) {
      this.startX = event.touches[0].clientX - this.lastTranslateX;
      this.startY = event.touches[0].clientY - this.lastTranslateY;
      this.isDragging = true;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const newDistance = this.getDistance(event.touches[0], event.touches[1]);
      this.scale = Math.max(1, Math.min(this.lastScale * (newDistance / this.startDistance), 4)); // limit zoom
      this.applyTransform();
    } else if (event.touches.length === 1 && this.scale > 1 && this.isDragging) {
      this.translateX = event.touches[0].clientX - this.startX;
      this.translateY = event.touches[0].clientY - this.startY;
      this.applyTransform();
    }
    event.preventDefault(); // Prevent scrolling
  }

  onTouchEnd(event: TouchEvent) {
    this.lastScale = this.scale;
    this.lastTranslateX = this.translateX;
    this.lastTranslateY = this.translateY;
    this.isDragging = false;
  }

  getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  applyTransform() {
    const el = this.pinchImageRef.nativeElement;
    el.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
    el.style.transition = 'none';
  }

  resetZoom() {
    this.scale = 1;
    this.lastScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.lastTranslateX = 0;
    this.lastTranslateY = 0;
    this.applyTransform();
    this.updateTransform();
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
     checkout(productID: string): void {
      // Navigate to checkout page
      this.router.navigate(['/checkout'], { state: { productFrom: 'wishlist' ,productIdToBuy: productID} });
  
    }


}
