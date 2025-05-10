import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OrderService, Order } from '../../services/order.service';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData: { id: string; firstName: string; lastName: string; location: string; phoneNumber: string; email: string } = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
    email: ''
  };

  orders: Order[] = [];
  productList: any[] = []; // Make sure this is populated from your product service
  wishlistCount: number = 0;
  wishlistProductIds: Set<string> = new Set();

  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (this.isBrowser()) {
      const userId = this.getUserId();
      if (userId) {
        this.fetchUser(userId);
        this.fetchOrders(userId);
        this.fetchProducts();
        this.fetchWishlist();
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload.sub)
        return payload.sub || null;
      } catch (e) {
        console.error('Invalid token:', e);
      }
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

  fetchOrders(id: string): void {
    this.orderService.getAllOrders().subscribe({
      next: (allOrders) => {
        this.orders = allOrders.filter(order => order.userId === id);
      },
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  Logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  goToEditProfile() {
    this.router.navigate(['/editprofile']);
  }

  openOrders: { [orderId: string]: boolean } = {};

  toggleDetails(orderId: string) {
    this.openOrders[orderId] = !this.openOrders[orderId];
  }

  getSortedOrders(): Order[] {
    return this.orders.sort((a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    );
  }

  getTotalAmount(order: Order): number {
    return order.items.reduce((total, item) => {
      const product = this.getProductDetails(item.productId);
      return product ? total + (item.quantity * product.price) : total;
    }, 0);
  }

  getProductDetails(productId: string) {
    return this.productList.find(product => product.id === productId);
  }

  fetchProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productList = products;
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  fetchWishlist(): void {
  const cachedCount = localStorage.getItem("wishlistCount");
  const cachedIds = localStorage.getItem("wishlistProductIds");

  if (cachedCount && cachedIds) {
    this.wishlistCount = Number(cachedCount);
    this.wishlistProductIds = new Set(JSON.parse(cachedIds));
  } else {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlistIds) => {
        this.wishlistCount = wishlistIds.length;
        this.wishlistProductIds = new Set(wishlistIds);
        localStorage.setItem("wishlistCount", String(this.wishlistCount));
        localStorage.setItem("wishlistProductIds", JSON.stringify([...wishlistIds]));
      },
      error: (err) => console.error('Error fetching wishlist:', err)
    });
  }
}
}
