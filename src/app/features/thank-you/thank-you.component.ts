import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit {
  constructor(
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService
  ) {}
  order = {
    id: '12345',
    date: new Date(),
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+123456789',
      address: '123 Main Street, City, Country'
    },
    payment: 'Cash on Delivery',
    items: [
      { name: 'Vintage Clock', quantity: 1, price: 50 },
      { name: 'Antique Vase', quantity: 2, price: 30 }
    ],
    subtotal: 110,
    discounted: true,
    total: 100
  };

  orderId = '680951e996b101a2fa456fe7';
  estimatedDeliveryDate: Date = new Date();

  orders: {
    orderId: string;
    orderDate: string;
    urserId: string;
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

  ngOnInit(): void {
    this.fetchOrderAndProducts();
  }

  fetchOrderAndProducts() {
    this.orderService.getOrder(this.orderId).subscribe({
      next: (order: any) => {
        this.orders = {
          orderId: order.orderId,
          orderDate: new Date(order.creationDate).toISOString().split('T')[0],
          urserId: order.userId,
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
        // console.log('Fetched products:', allProducts);

        this.orderedProducts = allProducts.map((product: any) => ({
          id: product.ID,
          image: product.Image,
          nameEn: product.Title,
          nameAr: product.TitleAr,
          tags: product.Tag,
          descriptionEn: product.Description,
          descriptionAr: product.DescriptionAr,
          price: product.Price,
          quantity: product.Stock
        }));

        // console.log('Mapped orderedProducts:', this.orderedProducts);
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
    this.router.navigate(['/product'], { state: { productId: id } });
  }
}
