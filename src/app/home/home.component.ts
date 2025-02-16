import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent  {
  // items = [
  //   { image: '../assets/about-us.jpg', name: 'Cityscape Painting', price: '$44.00' },
  //   { image: '../assets/about-us.jpg', name: 'Item 2', price: '$25.00' },
  //   // ... more items
  // ];
value="??"
testFunction(index: number) {
  console.log("Button clicked!");
  let buttonTrending = document.querySelector('.tabs-button-trending')
    let buttonArrived = document.querySelector('.tabs-button-arrived')
    if(buttonArrived && buttonTrending){
      this.value="done"
      if(index == 1){
        // clicked on trending button
        buttonTrending.setAttribute("class","active")
      }
    }else{
      this.value="not done"
     
    }
}
TabAction(index: number){
    let buttonTrending = document.querySelector('.tabs-button-trending')
    let buttonArrived = document.querySelector('.tabs-button-arrived')
     this.value="done"
      if(index == 1){
        // clicked on trending button
        this.value="trending"
        if(buttonTrending){
        buttonTrending.classList.add("active")
        // buttonTrending.setAttribute("class","tabs-button tabs-button-trending active")
        }else{
          this.value="button trending failed"
        }
      }
      if(index == 2)
        this.value="arrived"

  }
 
}

