import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent  {
  // categories
    categories = [
      {id:'1', name: 'Home', count: 4 },
      {id:'2', name: 'New Arrived', count: 5 },
      {id:'3', name: 'Trending', count: 5 }
    ];
    // total nb of products in all categories
    selectedCategoryNumber = this.categories.reduce((sum, category) => sum + category.count, 0);

    selectedCategory: any = null;
    selectedName: string = "";  // to display selected category name
    // to track nb of products in a selected category initially = total nb of prod
    totalCount = this.categories.reduce((sum, category) => sum + category.count, 0);
    
    toggleCategory(category: any) {
      // if selected === new selected one so remove selection -> null 
      this.selectedCategory = this.selectedCategory === category ? null : category;
      this.selectedName = this.selectedName === category.name ? null : category.name;
      this.totalCount = this.selectedCategory === category ? this.selectedCategory.count : this.selectedCategoryNumber;
      
    }

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


    // in stock and out of stock number
    totalCountInStock = this.allproducts.reduce((sum, product) => product.instock ? sum + 1 : sum, 0);
    totalCountOfOutStock = this.allproducts.reduce((sum, product) => product.instock ? sum : sum + 1, 0);

    selectedAvailability: any = null;
    selectednumber: number = this.totalCountInStock + this.totalCountOfOutStock

    toggleAvailability(availibility: any) {
      // if selected === new selected one so remove selection -> null 
      this.selectedAvailability = this.selectedAvailability === availibility ? null : availibility;
      if(availibility === 'instock') this.selectednumber = this.totalCountInStock
      if(availibility === 'outofstock') this.selectednumber = this.totalCountOfOutStock
      if(this.selectedAvailability === null) this.selectednumber = this.totalCountInStock + this.totalCountOfOutStock
      
    }



    // minimum ans maximum price
    minPrice = this.allproducts.reduce((min, product) => {
      const price = parseFloat(product.price.replace('$', '')); // Convert "$15.00" to 15.00
      return price < min ? price : min;
    }, Infinity); // Start with a very high value

    maxPrice = this.allproducts.reduce((max, product) => {
      const price = parseFloat(product.price.replace('$', '')); // Convert "$15.00" to 15.00
      return price > max ? price : max;
    }, 0); // Start with a very low value
    


    // try price
    minValue: number = 0;
    maxValue: number = this.maxPrice;
    minLimit: number = 0;
    maxLimit: number = this.maxPrice;
   
   updateValues(type: 'min' | 'max', event: Event) {
      const value = Number((event.target as HTMLInputElement).value);
  
     
      if (type === 'min' && value < this.maxValue) {
        this.minValue = value;
      } else if (type === 'max' && value > this.minValue) {
        this.maxValue = value;
      }
    }
   

    updateMinValue(event: Event) {
      const value = Number((event.target as HTMLInputElement).value);
      if (value < this.maxValue) {
        this.minValue = value;
      } else {
        // add message to tell the user that min should be < max
        this.minValue = this.maxValue - 1; // Prevent overlap
      }
    }
  
    // Function to update the max value from slider or input
    updateMaxValue(event: Event) {
      const value = Number((event.target as HTMLInputElement).value);
      if (value > this.minValue) {
        this.maxValue = value;
       } else {
        // add message to tell the user that max should be > min
        this.maxValue = this.minValue + 1; // Prevent overlap
      }
    }

    selectedItem: string = 'Best selling'; // Set the 3rd item as default selected

    onSelect(event: Event) {
      this.selectedItem = (event.target as HTMLSelectElement).value;
    }



    
   // function to move from trending to new arrived in our collection section
   TabAction(index: number) {

    let buttonGrid = document.querySelector('.grid-list')
    let buttonList = document.querySelector('.ul-list')
    let GridContainer = document.getElementById('grid-product-list')
    let ListContainer = document.getElementById('ul-product-list')

    if (buttonGrid && buttonList && ListContainer && GridContainer) {
      if (index === 1) {
        // Grid svg clicked
          buttonList.classList.remove("active")
          buttonGrid.classList.add("active")
          ListContainer.style.display='none' 
          GridContainer.style.display='flex'
        }
        else if(index === 2){
          // List svg clicked
          buttonGrid.classList.remove("active")
          buttonList.classList.add("active")
          ListContainer.style.display='flex'
          GridContainer.style.display='none'
      } 
      }  
    }

    hoveredItem: any = null; // Tracks the currently hovered product
  
    showProductActions(product: any): void {
      this.hoveredItem = product; // Set hovered item
    }
  
    hideProductActions(): void {
      this.hoveredItem = null; // Reset on mouse leave
    }
}

