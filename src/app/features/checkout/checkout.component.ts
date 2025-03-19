import { Component, HostListener, OnInit, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
constructor( private router: Router,private el: ElementRef) { }

  goToCart(){
    this.router.navigate(['/cart']);
  }
  goToHome(){
    this.router.navigate(['/home']);
  }


  // when user scroll right div is fixed when it hits the top of the screen 
  @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const rightDiv = this.el.nativeElement.querySelector('#rightDiv');
  //   const rightBox = this.el.nativeElement.querySelector('#rightBox');
  //   const topOffset = rightDiv.offsetTop;
  //   const scrollPosition = window.scrollY;

  //   if (scrollPosition >= topOffset) {
  //     rightBox.style.position = 'fixed';
  //     rightBox.style.top = '0';
  //     rightBox.style.width = `90%`; // Maintain width
  //   } else {
  //     rightBox.style.position = 'relative';
  //     rightBox.style.top = 'auto';
  //     // rightBox.style.width = `94%`; // Maintain width

  //   }
  // }

  onWindowScroll() {
    const rightDiv = this.el.nativeElement.querySelector('#rightDiv') as HTMLElement;
    const rightBox = this.el.nativeElement.querySelector('#rightBox') as HTMLElement;
    const topOffset = rightDiv.offsetTop;
    const scrollPosition = window.scrollY;
  
    if (scrollPosition >= topOffset) {
      rightBox.style.position = 'fixed';
      rightBox.style.top = '0';
      rightBox.style.width = `${rightDiv.clientWidth - 66}px`; // Set width dynamically
    } else {
      rightBox.style.position = 'relative';
      rightBox.style.top = 'auto';
      rightBox.style.width = '90%'; // Reset width
    }
  }

  ngOnInit() {}

  // product from the cart
   // products in cart
   products = [
    { id: 1, name: 'Old Uniform', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 2, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 3, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 },
    { id: 4, name: 'Leather Gloves', price: 49.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 6 },
    { id: 5, name: 'Cylinder Hat', price: 99.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 5 },
    { id: 6, name: 'Vintage Boots', price: 79.00, image: 'https://old-souqs.sirv.com/Essential/logo.png', quantity: 1 }
  ];
  totalAmount =   this.products.reduce((sum, product) => sum + this.getTotalPrice(product), 0);
 

  getTotalPrice(product: any) {
    return product.price * product.quantity;
  }


}
