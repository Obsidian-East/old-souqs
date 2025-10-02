import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit {
  constructor(
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  payment = "Cash on Delivery";
  orderId = '680951e996b101a2fa456fe7';
  estimatedDeliveryDate: Date = new Date();

  orders: {
    orderId: string;
    orderDate: string;
    userId: string;
    productsIds: { id: string; quantity: string }[];
    location: string;
    subtotal: number;
    total: number;
    discounted: boolean;
  } | null = null;

  orderedProducts: {
    id: string;
    image: string;
    nameEn: string;
    nameAr: string;
    tags: string[];
    price: number;
    quantity: number;
    descriptionEn: string;
    descriptionAr: string;
  }[] = [];
  userData: { id: string; firstName: string; lastName: string; location: string; phoneNumber: string; email: string } = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
    email: ''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = id;
      }
    });

    if (this.isBrowser()) {
      const userId = this.getUserId();
      if (userId) {
        this.fetchUser(userId);
        this.fetchOrderAndProducts();
      }
    }
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private getUserId(): string | null {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.sub || null;
        } catch (e) {
          console.error('Invalid token:', e);
        }
      }
      return null;
    }
    return null;

  }

  fetchUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userData.id = user.id,
          this.userData.firstName = user.first_name,
          this.userData.lastName = user.last_name,
          this.userData.phoneNumber = user.phone_number,
          this.userData.location = user.location,
          this.userData.email = user.email
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  fetchOrderAndProducts() {
    this.orderService.getOrder(this.orderId).subscribe({
      next: (order: any) => {
        this.orders = {
          orderId: order.orderId,
          orderDate: new Date(order.creationDate).toISOString().split('T')[0],
          userId: order.userId,
          productsIds:
            order.items?.map((item: any) => ({
              id: item.productId,
              quantity: item.quantity
            })) || [],
          location: order.userLocation,
          subtotal: order.subtotal,
          total: order.total,
          discounted: order.discounted
        };

        // Set delivery estimate based on order creation date
        const orderDate = new Date(order.creationDate);
        this.estimatedDeliveryDate = new Date(orderDate.setDate(orderDate.getDate() + 5));

        // Extract product IDs
        const orderedProductsIds = this.orders.productsIds.map((item) => item.id);
        if (orderedProductsIds.length > 0) {
          this.fetchProductsByIds(orderedProductsIds);
        } else {
          console.warn('No product IDs found in order.');
        }
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  fetchProductsByIds(productIds: string[]) {
    this.productService.getProductsByIds(productIds).subscribe({
      next: (allProducts) => {
        this.orderedProducts = allProducts.map((product: any) => ({
          id: product.id,
          image: product.image,
          nameEn: product.title,
          nameAr: product.titleAr,
          tags: product.tag,
          descriptionEn: product.description,
          descriptionAr: product.descriptionAr,
          price: product.price,
          quantity: product.stock
        }));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.orderedProducts = [];
      }
    });
  }

  continueShopping() {
    this.router.navigate(['/product']);
  }

  goToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

}
