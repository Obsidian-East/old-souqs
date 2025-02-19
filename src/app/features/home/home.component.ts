import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  // function to move from trending to new arrived in our collection section
  TabAction(index: number) {

    let buttonTrending = document.querySelector('.tabs-button-trending')
    let buttonArrived = document.querySelector('.tabs-button-arrived')
    let trendingContainer = document.getElementById('trending')
    let ArrivedContainer = document.getElementById('arrived')

    if (buttonTrending && buttonArrived && ArrivedContainer && trendingContainer) {
      if (index === 1) {
        // Trending button clicked
          buttonArrived.classList.remove("active")
          buttonTrending.classList.add("active")
          ArrivedContainer.style.display='none' 
          trendingContainer.style.display='flex'
        }
        else if(index === 2){
          // New Arrived button clicked
          buttonTrending.classList.remove("active")
          buttonArrived.classList.add("active")
          ArrivedContainer.style.display='flex'
          trendingContainer.style.display='none'
      } 
      }  
    }

    // to show and hide product actions container for a product
    products = [
      { id: 1, name: "Cityscape Painting", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 2, name: "Golden Globe", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 3, name: "Cylinder Hat", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 4, name: "Wall Sconce", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
    ];
    productsArrived = [
      { id: 1, name: "Cityscape Painting Arrived", price: "$44.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 2, name: "Golden Globe Arrived", price: "$225.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 3, name: "Cylinder Hat Arrived", price: "$99.00", image: "https://old-souqs.sirv.com/Essential/logo.png" },
      { id: 4, name: "Wall Sconce Arrived", price: "$155.00", image: "https://old-souqs.sirv.com/Essential/logo.png" }
    ];
  
    hoveredItem: any = null; // Tracks the currently hovered product
  
    showProductActions(product: any): void {
      this.hoveredItem = product; // Set hovered item
    }
  
    hideProductActions(): void {
      this.hoveredItem = null; // Reset on mouse leave
    }

    // carousel function
    //  currentIndex = 0;
    //    carousel = document.getElementById("deals-carousel");
    //     dots = document.querySelectorAll(".dot");

    //     moveToSlide(index: number) {
    //         this.currentIndex = index;
    //         if(this.carousel)
    //           this.carousel.style.transform = 'translateX(-${index * 50}%)';
    //         this.updateDots();
    //     }

    //      updateDots() {
    //         this.dots.forEach((dot, i) => {
    //             dot.classList.toggle("active", i === this.currentIndex);
    //         });
    //     }
   
    // hide and show product action for deals of the day article
    deals = [
      { name: 'Old Uniform', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
      { name: 'Cylinder Hat', price: '$99.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
      { name: 'Vintage Boots', price: '$79.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' },
      { name: 'Leather Gloves', price: '$49.00', image: 'https://old-souqs.sirv.com/Essential/logo.png' }
  ];
  hoveredDeal: any = null; // Tracks the currently hovered product
  
    showProductActionsInDeals(product: any): void {
      this.hoveredDeal = product; // Set hovered item
    }
  
    hideProductActionsInDeals(): void {
      this.hoveredDeal = null; // Reset on mouse leave
    }



    private currentIndex: number = 0;
 
    // using width only 2 is showing on click on a dot we got an index to translate so another item is showing
     moveToSlide(index: number): void {
        let carousel = document.getElementById("carousel");
        if (!carousel) {return};
        this.currentIndex = index;
        carousel.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/ 
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
      subscribed = false;
      showSubscribe = false;
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

}

