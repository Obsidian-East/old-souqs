import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor( private router: Router) { }  // Inject Router

  userData = {firstname: 'Cynthia', lastname: 'Farah', email: 'cynthiafarah@gmail.com', address: 'Beqaa Lebanon'};


  goToWishlist(){
    this.router.navigate(['/wishlist']);
  }

  Logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }  

  goToEditProfile(){
    this.router.navigate(['/editprofile']);
  }

  orders = [
    {
      orderId: 'ORD001',
      orderDate: '2025-04-03',
      userId: '1',
      productsIds: [
        { id: '1', quantity: 1 },
        { id: '2', quantity: 2 }
      ],
      location: 'zahle, lebanon'
    },
    {
      orderId: 'ORD002',
      orderDate: '2025-04-03',
      userId: '1',
      productsIds: [
        { id: '3', quantity: 1 }
      ],
      location: 'zahle, lebanon'
    },
    {
      orderId: 'ORD003',
      orderDate: '2025-03-31',
      userId: '1',
      productsIds: [
        { id: '2', quantity: 3 },
        { id: '4', quantity: 1 }
      ],
      location: 'zahle, lebanon'
    }
  ];

  products: { id: string; image: string; nameEn: string; nameAr: string; categoryId: string; price: number; quantity: number; descriptionEn: string; descriptionAr: string }[] = [
    {
      id: '1',
      image: 'https://old-souqs.sirv.com/Products/1f1.jpg',
      nameEn: 'Vintage Clock',
      nameAr: 'ساعة قديمة',
      categoryId: '1',
      price: 120,
      quantity: 5,
      descriptionEn: 'An exquisite antique brass wall clock from the early 19th century. This vintage clock features intricate engravings, a Roman numeral dial, and a beautiful aged patina that adds character to any space. A perfect addition for collectors and vintage lovers.',
      descriptionAr: 'ساعة حائط نحاسية عتيقة من أوائل القرن التاسع عشر. تتميز هذه الساعة المحفورة بتفاصيل دقيقة ومينا بأرقام رومانية، مما يضفي عليها طابعًا كلاسيكيًا رائعًا. إضافة مثالية لمحبي التحف والقطع النادرة.'
    },
    {
      id: '2',
      image: 'https://old-souqs.sirv.com/Products/1f1.jpg',
      nameEn: 'Old Map',
      nameAr: 'خريطة قديمة',
      categoryId: '2',
      price: 85,
      quantity: 2,
      descriptionEn: 'A rare historical map of the Middle East from the 18th century. This meticulously detailed map showcases the geography, trade routes, and major cities of the era, printed on aged parchment paper. An excellent decorative piece or gift for history enthusiasts.',
      descriptionAr: 'خريطة تاريخية نادرة لمنطقة الشرق الأوسط من القرن الثامن عشر. تعرض هذه الخريطة التفصيلية جغرافيا المنطقة ومسارات التجارة والمدن الكبرى في ذلك الوقت، مطبوعة على ورق بردي قديم. قطعة رائعة للزينة أو هدية لهواة التاريخ.'
    },
    {
      id: '3',
      image: 'https://old-souqs.sirv.com/Products/1f1.jpg',
      nameEn: 'Handcrafted Silver Dagger',
      nameAr: 'خنجر فضي مصنوع يدويًا',
      categoryId: '3',
      price: 250,
      quantity: 3,
      descriptionEn: 'A beautifully handcrafted silver dagger featuring detailed filigree work and an intricately designed handle. This traditional Middle Eastern piece is a symbol of heritage and craftsmanship, making it a valuable collector’s item.',
      descriptionAr: 'خنجر فضي مصنوع يدويًا بتفاصيل رائعة وتصميم معقد على المقبض. هذه القطعة التقليدية من الشرق الأوسط تعتبر رمزًا للتراث والحرفية، مما يجعلها إضافة قيمة لمجموعات التحف.'
    },
    {
      id: '4',
      image: 'https://old-souqs.sirv.com/Products/1f1.jpg',
      nameEn: 'Antique Brass Teapot',
      nameAr: 'إبريق شاي نحاسي عتيق',
      categoryId: '1',
      price: 180,
      quantity: 6,
      descriptionEn: 'An elegant antique brass teapot with intricate carvings and a sturdy handle. This traditional teapot was commonly used in Middle Eastern households for serving tea during gatherings. A stunning addition to any antique kitchenware collection.',
      descriptionAr: 'إبريق شاي نحاسي عتيق مزخرف بنقوش دقيقة ومقبض قوي. كان هذا الإبريق يُستخدم بشكل شائع في المنازل العربية لتقديم الشاي خلال المناسبات. إضافة رائعة لأي مجموعة أدوات مطبخ عتيقة.'
    },
    {
      id: '5',
      image: 'https://old-souqs.sirv.com/Products/1f1.jpg',
      nameEn: 'Persian Handwoven Rug',
      nameAr: 'سجادة فارسية يدوية الصنع',
      categoryId: '2',
      price: 600,
      quantity: 1,
      descriptionEn: 'A luxurious Persian handwoven rug featuring traditional motifs and vibrant colors. Made using natural wool and plant-based dyes, this exquisite rug is a timeless piece of art that enhances the aesthetic of any living space.',
      descriptionAr: 'سجادة فارسية فاخرة مصنوعة يدويًا بزخارف تقليدية وألوان زاهية. مصنوعة من الصوف الطبيعي والأصباغ النباتية، مما يجعلها قطعة فنية خالدة تضفي جمالًا وأناقة على أي مكان.'
    }
   
  ];
  // To track open order cards
  openOrders: { [orderId: string]: boolean } = {};

  getSortedOrders() {
    return this.orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  getTotalAmount(order: any): number {
    return order.productsIds.reduce((total: number, item: any) => {
      const product = this.products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  toggleDetails(orderId: string) {
    this.openOrders[orderId] = !this.openOrders[orderId];
  }

  getProductDetails(id: string) {
    return this.products.find(p => p.id === id);
  }

}
