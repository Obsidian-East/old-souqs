import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  value = "??"
  testFunction(index: number) {
    // console.log("Button clicked!");
    // let buttonTrending = document.querySelector('.tabs-button-trending')
    // let buttonArrived = document.querySelector('.tabs-button-arrived')
    // if (buttonArrived && buttonTrending) {
    //   this.value = "done"
    //   if (index == 1) {
    //     buttonTrending.setAttribute("class", "active")
    //   }
    // } else {
    //   this.value = "not done"

    // }
  }
  TabAction(index: number) {
    let buttonTrending = document.querySelector('.tabs-button-trending')
    let buttonArrived = document.querySelector('.tabs-button-arrived')
    let trendingContainer = document.getElementById('trending')
    let ArrivedContainer = document.getElementById('arrived')

    this.value = "done"
    if (buttonTrending && buttonArrived && ArrivedContainer && trendingContainer) {
      if (index === 1) {
          buttonArrived.classList.remove("active")
          buttonTrending.classList.add("active")
          ArrivedContainer.style.display='none'
          trendingContainer.style.display='flex'
        }
        else if(index === 2){
         buttonTrending.classList.remove("active")
        buttonArrived.classList.add("active")
        ArrivedContainer.style.display='flex'
          trendingContainer.style.display='none'
      } 
      }  
    }
    
  

   

}

