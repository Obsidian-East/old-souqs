import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { EventBusService } from '../../shared/event-bus.service';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    constructor(private router: Router,
        private route: ActivatedRoute, 
        private productService: ProductService,
        private cartService: CartService,
        private eventBus: EventBusService) {}
      // searchText: string | null = null;
      ngOnInit() {
        if (typeof window !== 'undefined') { //  Ensure we are in the browser
          this.searchText = window.history.state.SearchText;
        }

        // Fetch all products when the component loads
    this.productService.getProducts().subscribe(
      (products) => {
        this.allProducts = products;
        // Check for query params (search text)
        this.route.queryParams.subscribe((params) => {
          this.searchText = params['q'] || '';
          this.runSearch(); // Filter products based on the search query
        });
      },
      (error) => console.error('Error loading products:', error)
    );
      }
      hoveredItem: any = null; // Tracks the currently hovered product
  
      showProductActions(product: any): void {
        this.hoveredItem = product; // Set hovered item
      }
    
      hideProductActions(): void {
        this.hoveredItem = null; // Reset on mouse leave
      }


      searchText: string = ''; // Search text from the URL
  allProducts: any[] = []; // Holds all products from the database
  filteredProducts: any[] = []; // Products filtered by search query
  availableProducts: boolean = true; // To toggle between list of products and "no products found"
  finalSearchText: string = ''; // Search text to display after searching
  


  // Search function based on the input search text
  runSearch(): void {
    const query = this.searchText.trim().toLowerCase();
    if (query) {
      this.filteredProducts = this.allProducts.filter((product) =>
        product.title.toLowerCase().includes(query) // Filter based on title
      );
      this.availableProducts = this.filteredProducts.length > 0;
      this.finalSearchText = this.searchText
    } else {
      this.filteredProducts = [];
      this.availableProducts = false;
    }
  }

  // Method to trigger search on button click
  // not used
  onSearchClick(): void {
    // Ensure searchText is trimmed and then navigate with queryParams
    if (this.searchText.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchText.trim() } });
    }
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
