import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    constructor(private router: Router,private route: ActivatedRoute, private productService: ProductService) {}
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
      // to toggle between list of products and "no products found"
      // availableProducts= true;

       // all poducts
    // allproducts = [
    //   { id: '1', name: 'American stamps', price: '$15.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3],instock:true },
    //   { id: '2', name: 'Amphora', price: '$105.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2],instock:true  },
    //   { id: '3', name: 'Cityscape Painting', price: '$44.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2] ,instock:true  },
    //   { id: '4', name: 'Cylinder hat', price: '$99.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1] , instock:true },
    //   { id: '5', name: 'Denarius', price: '$23.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,3] ,instock:true },
    //   { id: '6', name: 'Golden globe', price: '$225.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:true },
    //   { id: '7', name: 'Jewelry set', price: '$199.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] ,instock:true  },
    //   { id: '8', name: 'Old uniform', price: '$99.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:true },
    //   { id: '9', name: 'Shakespears sonnets', price: '$55.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] ,instock:false  },
    //   { id: '10', name: 'Wall sconce', price: '$155.00', image: 'https://old-souqs.sirv.com/Products/1f1.jpg',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:false }
    // ];
    // productsCount= this.allproducts.length

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

}
