import { Component, HostListener, Inject, PLATFORM_ID, ElementRef} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
 
    // to show and hide product actions container for a product
    productsTrending = [
      { id: 1, name: "Cityscape Painting", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 2, name: "Golden Globe", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 3, name: "Cylinder Hat", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 4, name: "Wall Sconce", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
    ];
    productsArrived = [
      { id: 5, name: "Cityscape Painting Arrived", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 6, name: "Golden Globe Arrived", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 7, name: "Cylinder Hat Arrived", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 8, name: "Wall Sconce Arrived", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
    ];
    // collection showing 
    products = this.productsTrending
    hoveredItem: any = null; // Tracks the currently hovered product
    TabAction(index: number) {

      let buttonTrending = document.querySelector('.tabs-button-trending')
      let buttonArrived = document.querySelector('.tabs-button-arrived')
      
      if (buttonTrending && buttonArrived) {
        if (index === 1) {
          // Trending button clicked
            buttonArrived.classList.remove("active")
            buttonTrending.classList.add("active")
            this.products = this.productsTrending
          }
          else if(index === 2){
            // New Arrived button clicked
            buttonTrending.classList.remove("active")
            buttonArrived.classList.add("active")
            this.products = this.productsArrived
        } 
        }  
      }

      // using width only 2 is showing on click on a dot we got an index to translate so another item is showing
     moveCollection(index: number): void {
      let carousel = document.getElementById("collection");
      if (!carousel) {return};
      this.currentIndex = index;
      carousel.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/ 
      this.updateCollectionDots();// to update the color of the clicked dot
    }

  updateCollectionDots() {
    let dots = document.querySelectorAll(".dot-collection");
    dots.forEach((dot, i) => { 
      if (dot) {
          if(i === this.currentIndex){//clicked dot
            dot.classList.add("active-dot")
          }
          else{
            dot.classList.remove("active-dot")
          }
        }
      });
    }
  
  
    showProductActions(product: any): void {
      this.hoveredItem = product; // Set hovered item
    }
  
    hideProductActions(): void {
      this.hoveredItem = null; // Reset on mouse leave
    }

   
    // hide and show product action for deals of the day article
    deals = [
      { id: 1, name: "Cityscape Painting", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 2, name: "Golden Globe", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 3, name: "Cylinder Hat", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 4, name: "Wall Sconce", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
    ];
 

  hoveredDeal: any = null;

  constructor( private router: Router, private el: ElementRef) {}
   
 
  hideProductActionsInDeals(): void {
      this.hoveredDeal = null;
  }
  showProductActionsInDeals(product: any): void {
      this.hoveredDeal = product; // Set hovered item
      }    

    private currentIndex: number = 0;
 
    // using width only 2 is showing on click on a dot we got an index to translate so another item is showing
     moveToSlide(index: number): void {
        let carousel = document.getElementById("carousel");
        let carouselTablet = document.getElementById("carousel-tablet");
        if (!carousel || !carouselTablet) {return};
        this.currentIndex = index;
        carousel.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/ 
        carouselTablet.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/ 
        this.updateDots();// to update the color of the clicked dot
      }

    updateDots() {
      let dots = document.querySelectorAll(".dot");
      dots.forEach((dot, i) => { 
        if (dot) {
            if(i === this.currentIndex){//clicked dot
              dot.classList.add("active-dot")
            }
            else{
              dot.classList.remove("active-dot")
            }
          }
        });
      }

      comments = [
        { name: 'Julian Nyatt', starsNumber: 1, comment: ":there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable." },
        { name: 'Claire Divas', starsNumber: 2, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable."  },
        { name: 'Lisa Rosnick', starsNumber: 3, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable."  },
        { name: 'Jack Aranda', starsNumber: 4, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable."  }
    ];
      currentCommentIndex: number = 0;
      commentName = this.comments[0].name
      commentStar = this.comments[0].starsNumber
      commentContent = this.comments[0].comment

     moveComment(index: number): void {
        this.currentCommentIndex += index;
        if(this.currentIndex === -1) this.currentCommentIndex = this.comments.length-1
        if(this.currentCommentIndex === this.comments.length) this.currentCommentIndex = 0

        this.commentName = this.comments[this.currentCommentIndex].name
        this.commentStar = this.comments[this.currentCommentIndex].starsNumber
        this.commentContent = this.comments[this.currentCommentIndex].comment



      }

      // email subscription 
      subscribed = true;
      showSubscribe = true;
      email = '';
      
      ngOnInit() {
        setTimeout(() => {
          if (!this.subscribed) {
            this.showSubscribe = true;
          }
        }, 1000);
      }
      
      closeSubscribe() {
        this.showSubscribe = false;
      }
      
      subscribe() {
        this.showSubscribe = false;        
      }


      // to send the product id to the product page when clicking on a product name

      // constructor(private router: Router) {}
      goToProduct(id: number) {
        this.router.navigate(['/product'], { state: { productId: id } });
      }

}

