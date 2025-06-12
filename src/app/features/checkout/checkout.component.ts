import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent {
  products: any[] = [];
  shippingPrice = 4.00;
  subtotalAmount = 0;
  totalAmount = 0;
  paymentMethod: string = '';
  displaySummary = false;
  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private el: ElementRef, 
    private cartService: CartService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private productService: ProductService) { }

  goToCart() {
    this.router.navigate(['/cart']);
  }
  goToHome() {
    this.router.navigate(['/home']);
  }


  // when user scroll right div is fixed when it hits the top of the screen 
  @HostListener('window:scroll', [])

  onWindowScroll() {
    if (window.innerWidth >= 769) {
      const rightDiv = this.el.nativeElement.querySelector('#rightDiv') as HTMLElement;
      const rightBox = this.el.nativeElement.querySelector('#rightBox') as HTMLElement;
      const topOffset = rightDiv.offsetTop;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= topOffset) {
        rightBox.style.position = 'fixed';
        rightBox.style.top = '0';
        rightBox.style.padding = '2rem';
        rightBox.style.width = `${rightDiv.clientWidth - 66}px`; // Set width dynamically
      } else {
        rightBox.style.position = 'relative';
        rightBox.style.top = 'auto';
        rightBox.style.width = '90%'; // Reset width
        rightBox.style.padding = '2rem 1.5rem';
      }
    }
  }
  productId: string | null = null;
  productFrom: string | null = null;

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      apartment: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['']
    });

    if (typeof window !== 'undefined') {
      this.productFrom = window.history.state.productFrom;
      if (this.productFrom ==='wishlist') {
        // single product order
          this.productId = window.history.state.productIdToBuy;
          this.fetchProductById();

      } else if(this.productFrom ==='cart'){
                // checkout from cart
            // Subscribe to the cart observable
            this.cartService.cart$.subscribe(items => {
              this.products = items;
              this.subtotalAmount = this.cartService.getTotalAmount();
              this.totalAmount = this.subtotalAmount + this.shippingPrice;
            });
      }
      else{
        console.error('No state received');
      }
    }
  }
  // product: { id: string; name: string; description:string; price: number; image: string; stock: number;tag:string }| null = null;
  fetchProductById() {
    this.productService.getProductById(this.productId!).subscribe({
      next: (product: any) => {
        this.products[0] = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: 1
        };
        console.log(this.products)

        this.subtotalAmount = this.products[0].price;
        this.totalAmount = this.subtotalAmount + this.shippingPrice;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }

  selectPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  toggleSummary() {
    this.displaySummary = !this.displaySummary;
    const rightBox = this.el.nativeElement.querySelector('#rightBox') as HTMLElement;

    if (rightBox.style.display === 'flex') {
      rightBox.style.display = 'none';
    } else if (rightBox.style.display = 'none') {
      rightBox.style.display = 'flex';
    }

  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }
  
    const userId = this.tokenService.getUserId();
  
    const form = this.checkoutForm.value;
    const location = `${form.address}, Apt ${form.apartment}, ${form.city}, ${form.postalCode || ''}`;
  
    const orderData = {
      userId,
      userLocation: location,
      items: this.products.map(p => ({
        productId: p.id,
        quantity: p.quantity
      })),
      subtotal: this.subtotalAmount,
      total: this.totalAmount,
      discounted: false,
      creationDate: new Date().toISOString()
    };
  
    this.orderService.createOrder(userId, orderData).subscribe({
      next: () => {
        if(this.productFrom === 'cart')
        // from cart
            this.cartService.clearCart();
              
        alert('Order submitted! Your items will be delivered ASAP.');
        this.router.navigate(['/order-success']);
      },
      error: (err) => {
        console.error('Order submission failed', err);
        alert('Something went wrong. Please try again later.');
      }
    });
  }
  goToProduct(id: string) {
  this.router.navigate(['/product', id]);
}

}
