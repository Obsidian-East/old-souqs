import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    constructor(private router: Router) {}
      searchText: string | null = null;
      ngOnInit() {
        if (typeof window !== 'undefined') { //  Ensure we are in the browser
          this.searchText = window.history.state.SearchText;
        }
      }
      // to toggle between list of products and "no products found"
      availableProducts= true;

       // all poducts
    allproducts = [
      { id: '1', name: 'American stamps', price: '$15.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3],instock:true },
      { id: '2', name: 'Amphora', price: '$105.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2],instock:true  },
      { id: '3', name: 'Cityscape Painting', price: '$44.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2] ,instock:true  },
      { id: '4', name: 'Cylinder hat', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1] , instock:true },
      { id: '5', name: 'Denarius', price: '$23.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,3] ,instock:true },
      { id: '6', name: 'Golden globe', price: '$225.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:true },
      { id: '7', name: 'Jewelry set', price: '$199.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] ,instock:true  },
      { id: '8', name: 'Old uniform', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:true },
      { id: '9', name: 'Shakespears sonnets', price: '$55.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] ,instock:false  },
      { id: '10', name: 'Wall sconce', price: '$155.00', image: 'https://old-souqs.sirv.com/Essential/logo.png',description: 'Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor1 Dicta sunt explicabo. Nemo enim ipsam voluptatem voluptas sit odit aut fugit, sed quia consequuntur. Lorem ipsum nonum eirmod dolor....', categoryId:[1,2,3] , instock:false }
    ];
    productsCount= this.allproducts.length

      hoveredItem: any = null; // Tracks the currently hovered product
  
      showProductActions(product: any): void {
        this.hoveredItem = product; // Set hovered item
      }
    
      hideProductActions(): void {
        this.hoveredItem = null; // Reset on mouse leave
      }
}
