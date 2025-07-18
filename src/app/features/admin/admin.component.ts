import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';

// new dicount
type DiscountField = 'type' | 'targetId' | 'value';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent implements OnInit {
  selectedImageFile: File | null = null;

  constructor(private router: Router, private productService: ProductService, private orderService: OrderService,
    private userService: UserService
  ) {
    this.loadAnnouncements();
  }
  ngOnInit() {
    this.fetchCollections();
    this.fetchProducts();
    this.fetchOrders();

    this.computeDiscountNames();
  }
  allproducts: { id: string; image: string; nameEn: string; nameAr: string; tags: string[]; price: number; quantity: number; descriptionEn: string; descriptionAr: string, sku: string, instock: boolean }[] = [];
  collections: { id: string; nameEn: string; nameAr: string }[] = [];
  orders: { orderId: string; orderDate: string; urserId: string; productsIds: { id: string; quantity: string; }[]; location: string, total: number }[] = [];

  // --- Fetching Functions ---
  fetchCollections() {
    this.productService.getCollections().subscribe({
      next: (data) => {
        this.collections = data.map((collection: any) => ({
          id: collection.ID,
          nameEn: collection.collectionName,
          nameAr: collection.collectionNameAr
        }));
      },
      error: (error) => {
        console.error('Error fetching collections:', error);
      }
    });
  }

  fetchProducts() {
    this.productService.adminGetProducts().subscribe({
      next: (data) => {
        console.log('Raw data from DB:', data);

        this.allproducts = data.map((product: any) => ({
          id: product.id,
          image: product.image,
          nameEn: product.title,
          nameAr: product.titleAr,
          tags: product.tag,
          descriptionEn: product.description,
          descriptionAr: product.descriptionAr,
          price: product.price,
          quantity: product.stock,
          sku: product.sku,
          instock: product.stock > 0,
        }));
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  fetchOrders() {
    this.userService.getAllUsers().subscribe(users => {
      const userMap = new Map<string, { id: string; first_name: string; last_name: string; phone_number: string }>(
        users.map((user: { id: string; first_name: string; last_name: string; phone_number: string }) => [user.id, user])
      );
      this.orderService.getAllOrders().subscribe(orders => {
        this.orders = orders.map(order => {
          const user = userMap.get(order.userId);
          return {
            orderId: order.orderId,
            orderDate: new Date(order.creationDate).toISOString().split('T')[0], // "YYYY-MM-DD"
            urserId: order.userId,
            productsIds: order.items?.map((item: any) => ({
              id: item.productId,
              quantity: item.quantity
            })) || [],
            location: order.userLocation,
            total: order.total,
            userFullName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
            userPhone: user ? user.phone_number : 'N/A'
          };
        });
      });
    });

  }


  categories: { id: string; nameEn: string; nameAr: string }[] = [
    { id: '1', nameEn: 'Clocks', nameAr: 'ساعات' },
    { id: '2', nameEn: 'Maps', nameAr: 'خرائط' },
    { id: '3', nameEn: 'Jewelry', nameAr: 'مجوهرات' },
    { id: '4', nameEn: 'Kitchenware', nameAr: 'أدوات المطبخ' },
    { id: '5', nameEn: 'Rugs', nameAr: 'سجاد' },
    { id: '6', nameEn: 'Ceramics', nameAr: 'سيراميك' },
    { id: '7', nameEn: 'Coins', nameAr: 'عملات' }
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
  // Set active section and toggle sidebar styles
  activeSection = 'products'; // default section

  selectSection(section: string) {
    this.activeSection = section;
    const allButtons = document.querySelectorAll('.menu-item');
    allButtons.forEach(btn => btn.classList.remove('active'));
    const target = document.getElementById(`${section}-btn`);
    target?.classList.add('active');
  }

  // get category name for each product in the product section
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.nameEn + ' - ' + category.nameAr : 'Unknown';
  }


  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          // Refresh product list
          this.fetchProducts();
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
          alert('Failed to delete product: ' + (err.error?.message || err.message));
        }
      });
    }
  }



  // update product
  showPopup = false;
  selectedProduct: any = null;

  // Open the popup with selected product
  openEditPopup(product: any) {
    this.productService.getProductById(product.id).subscribe({
      next: (freshProduct) => {
        this.selectedProduct = {
          id: freshProduct.id || freshProduct._id,
          title: freshProduct.title,
          titleAr: freshProduct.titleAr,
          description: freshProduct.description,
          descriptionAr: freshProduct.descriptionAr,
          sku: freshProduct.sku,
          image: freshProduct.image,
          price: freshProduct.price,
          stock: freshProduct.stock,
          instock: freshProduct.instock ?? freshProduct.stock > 0,
          tag: Array.isArray(freshProduct.tag) ? [...freshProduct.tag] : [],
        };
        this.showPopup = true;
      },
      error: (err) => {
        console.error('Failed to load product for editing:', err);
        alert('Error loading product for editing');
      }
    });
  }

  // Close the popup
  closePopup() {
    this.showPopup = false;
  }

  // Handle input changes
  updateField(field: string, eventOrValue: Event | any): void {
    if (eventOrValue instanceof Event) {
      const input = eventOrValue.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      this.selectedProduct[field] = input.value;
    } else {
      this.selectedProduct[field] = eventOrValue;
    }
  }

  // Update the product in the array
  updateProduct() {
    // Ensure selectedProduct has an _id for the update
    if (!this.selectedProduct.id) {
      alert('Error: Product ID is missing for update.');
      return;
    }
    console.log('Submitting updated product:', this.selectedProduct);
    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated successfully:', updatedProduct);
        // Update the product in the local array with the response from the backend
        const index = this.products.findIndex(p => p.id === updatedProduct['id']);
        if (index !== -1) {
          this.newProduct[index] = updatedProduct;
        }
        this.closePopup(); // Close popup after successful update
        this.productService.getProducts().subscribe((products) => {
          this.products = products;
          this.closePopup();
        });

      },
      error: (err) => {
        console.error('Failed to update product:', err);
        alert('Failed to update product: ' + (err.error?.message || err.message)); // Show more specific error
      }
    });
  }

  toggleTag(tag: string, event: Event) {
    if (!this.selectedProduct.tags) {
      this.selectedProduct.tags = [];
    }

    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (!this.selectedProduct.tags.includes(tag)) {
        this.selectedProduct.tags.push(tag);
      }
    } else {
      this.selectedProduct.tags = this.selectedProduct.tags.filter((t: string) => t !== tag);
    }
  }



  // add new product
  showAddPopup: boolean = false;
  newProduct: Product = {
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    stock: 0,
    price: 0,
    sku: '',
    tag: [],
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  openAddPopup() {
    this.showAddPopup = true;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  resetNewProduct() {
    this.newProduct = {
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      stock: 0,
      price: 0,
      sku: '',
      tag: [],
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.selectedImageFile = null;
  }

  updateFieldNewProduct(field: string, event: any) {
    let value: any = event.target.value; // Initialize as any, will be converted if needed

    if (field === 'tag') {
      const checked = event.target.checked;
      const tagValue = event.target.value;

      if (checked && !this.newProduct.tag.includes(tagValue)) {
        this.newProduct.tag.push(tagValue);
      } else if (!checked) {
        this.newProduct.tag = this.newProduct.tag.filter((t: string) => t !== tagValue);
      }
    } else {
      // Explicitly convert 'stock' and 'price' values to numbers
      if (field === 'stock' || field === 'price') {
        // Use parseFloat to handle both integers and decimals
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          value = parsedValue; // Assign the parsed number
        } else {
          // Handle invalid numeric input (e.g., user typed text into a number field)
          console.warn(`Invalid numeric input for ${field}: "${event.target.value}". Setting to 0.`);
          value = 0; // Default to 0 or handle as an error
        }
      }
      this.newProduct[field] = value;
    }
  }

  // Handle image upload for new product
  handleNewImageUpload(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.productService.uploadImage(file).subscribe({
      next: (res) => {
        this.newProduct.image = res.url;
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed.');
      }
    });
  }

  addNewProduct() {
    if (!this.newProduct.image) {
      alert('Please upload an image first.');
      return;
    }

    this.productService.addProduct(this.newProduct).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.showAddPopup = false;
      },
      error: (err) => {
        console.error('Failed to add product:', err);
        alert('Failed to add product.');
      }
    });
  }


  // collection section
  editingStates: { [key: string]: boolean } = {}; // for edit mode
  inputValuesEn: { [key: string]: string } = {};     // temp input value for editing
  inputValuesAr: { [key: string]: string } = {};     // temp input value for editing

  // to hide and show order details
  expandedCategoriesIds: Set<string> = new Set();

  toggleCategoryDetails(CategoryId: string) {
    if (this.expandedCategoriesIds.has(CategoryId)) {
      this.expandedCategoriesIds.delete(CategoryId);
    } else {
      this.expandedCategoriesIds.add(CategoryId);
    }
  }

  isCategoryDetailsShown(CategoryId: string): boolean {
    return this.expandedCategoriesIds.has(CategoryId);
  }


  // Return products related to a collection
  getProductsByCategory(categoryName: string) {
    return this.allproducts.filter(product => product.tags.includes(categoryName));
  }

  // Start editing
  editCollectionName(collectionId: string, currentNameEn: string, currentNameAr: string) {
    this.editingStates[collectionId] = true;
    this.inputValuesEn[collectionId] = currentNameEn;
    this.inputValuesAr[collectionId] = currentNameAr;
  }

  // Save updated name
  saveCollectionName(collectionId: string) {
    const collection = this.categories.find(c => c.id === collectionId);
    if (collection) {
      collection.nameEn = this.inputValuesEn[collectionId];
      collection.nameAr = this.inputValuesAr[collectionId];
    }
    this.editingStates[collectionId] = false;
  }

  // Cancel editing
  cancelEditing(collectionId: string) {
    this.editingStates[collectionId] = false;
    delete this.inputValuesEn[collectionId]; // optional: clean up
    delete this.inputValuesAr[collectionId]; // optional: clean up
  }

  // Handle input change
  onInputChangeEn(collectionId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValuesEn[collectionId] = input.value;
  }
  onInputChangeAr(collectionId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValuesAr[collectionId] = input.value;
  }

  // add new category
  showAddCollectionPopup = false;

  newCollectionNameEn = '';
  newCollectionNameAr = '';

  openAddCollectionPopup() {
    this.showAddCollectionPopup = true;
    this.newCollectionNameEn = '';
    this.newCollectionNameAr = '';
  }

  closeAddCollectionPopup() {
    this.showAddCollectionPopup = false;
  }

  handleCollectionNameInputEn(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newCollectionNameEn = input.value;
  }
  handleCollectionNameInputAr(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newCollectionNameAr = input.value;
  }

  addNewCollection() {
    const nameEn = this.newCollectionNameEn.trim();
    const nameAr = this.newCollectionNameAr.trim();
    if (nameEn && nameAr) {
      alert(`New collection name: ${nameEn} - ${nameAr}`);
      this.closeAddCollectionPopup();
    } else {
      alert('Please enter a collection name.');
    }
  }
  deleteCollection(collectinId: string) {
    if (confirm('Are you sure you want to delete this collection?')) {

    }
  }


  // orders section
  expandedOrderId: string | null = null;

  users = [
    { id: '1', name: 'Ali Ahmed' },
    { id: '2', name: 'Sarah Khalil' },
    { id: '3', name: 'Mohammed Said' },
  ];


  selectedSort = 'latest';

  get groupedOrders() {
    const sorted = [...this.orders].sort((a, b) => {
      const d1 = new Date(a.orderDate).getTime();
      const d2 = new Date(b.orderDate).getTime();
      return this.selectedSort === 'latest' ? d2 - d1 : d1 - d2;
    });

    const groups: { [key: string]: any[] } = {};
    sorted.forEach(order => {
      if (!groups[order.orderDate]) groups[order.orderDate] = [];
      groups[order.orderDate].push(order);
    });

    return Object.entries(groups);
  }
  getProductById(id: string) {
    return this.allproducts.find(p => p.id === id);
  }
  getUserNameById(id: string): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : 'Unknown User';
  }

  // to hide and show order details
  expandedOrderIds: Set<string> = new Set();

  toggleOrderDetails(orderId: string) {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isOrderDetailsShown(orderId: string): boolean {
    return this.expandedOrderIds.has(orderId);
  }

  // calculate total price
  calculateTotalPrice(productsInOrder: { id: string; quantity: number }[]): number {
    let total = 0;

    for (const item of productsInOrder) {
      const product = this.products.find(p => p.id === item.id);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    return total;
  }

  //  discount section
  newDiscount: Record<DiscountField, string> = {
    type: 'product',
    targetId: '',
    value: ''
  };

  showAddDiscountPopup = false;

  discounts = [
    {
      id: 'd1',
      type: 'product',
      targetId: '1',
      value: '10',
      createdAt: new Date('2024-12-01')
    },
    {
      id: 'd2',
      type: 'category',
      targetId: '2',
      value: '15',
      createdAt: new Date('2024-12-03')
    },
    {
      id: 'd3',
      type: 'product',
      targetId: '2',
      value: '10',
      createdAt: new Date('2024-12-01')
    },
    {
      id: 'd4',
      type: 'product',
      targetId: '3',
      value: '10',
      createdAt: new Date('2024-11-11')
    },
    {
      id: 'd5',
      type: 'category',
      targetId: '1',
      value: '10',
      createdAt: new Date('2024-12-12')
    },
    {
      id: 'd6',
      type: 'category',
      targetId: '3',
      value: '10',
      createdAt: new Date('2025-1-01')
    }
  ];

  handleDiscountField(field: DiscountField, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    this.newDiscount[field] = input.value;
  }



  editingId: string | null = null;
  editingIndex: number | null = null; // To track the index of the editing discount
  editingValue: string = ''; // Initialize as an empty string instead of null
  newDiscountValue: string = ''; // New discount value for adding a discount
  newDiscountTargetId: string = ''; // Target ID for new discount
  newDiscountType: 'product' | 'category' = 'product'; // Default type for new discount

  discountNames: { [key: string]: string } = {}; // Store computed names

  isValidValue: boolean = true; // To track if the value is valid

  // ngOnInit() {
  //   this.computeDiscountNames();
  // }

  // Precompute the names of products or categories
  computeDiscountNames() {
    this.discounts.forEach(d => {
      if (d.type === 'product') {
        const product = this.products.find(p => p.id === d.targetId);
        this.discountNames[d.id] = product ? product.nameEn + ' - ' + product.nameAr : 'Unknown Product';
      } else if (d.type === 'category') {
        const category = this.categories.find(c => c.id === d.targetId);
        this.discountNames[d.id] = category ? category.nameEn + ' - ' + category.nameAr : 'Unknown Category';
      }
    });
  }
  addDiscount() {
    if (!this.newDiscount.targetId || !this.newDiscount.value) {
      alert('Please fill all fields');
      return;
    }

    this.discounts.push({
      id: Date.now().toString(),
      type: this.newDiscount.type as 'product' | 'category',
      targetId: this.newDiscount.targetId,
      value: this.newDiscount.value,
      createdAt: new Date()
    });

    alert(`Discount added for ${this.newDiscount.type} ${this.newDiscount.targetId}`);
    this.showAddDiscountPopup = false;
    this.newDiscount = { type: 'product', targetId: '', value: '' };
    this.computeDiscountNames();
  }


  // Method to start editing a discount
  editDiscount(id: string) {
    this.editingId = id;
    const discount = this.discounts.find(d => d.id === id);
    if (discount) {
      this.editingValue = discount.value;
      this.isValidValue = true;
    }
  }

  // Method to save the edited discount
  saveDiscount() {
    if (this.isValidValue && this.editingId) {
      const discount = this.discounts.find(d => d.id === this.editingId);
      if (discount) {
        discount.value = this.editingValue;
        discount.createdAt = new Date(); // Update the date when saving
        this.editingId = null;
        this.editingValue = '';
      }
    } else {
      alert('Please enter a valid discount value between 0 and 100.');
    }
  }

  // Method to cancel the editing
  cancelEdit() {
    this.editingId = null;
    this.editingValue = '';
  }

  // Method to delete a discount
  deleteDiscount(id: string) {
    if (confirm('Are you sure you want to delete this discount?')) {
      this.discounts = this.discounts.filter(d => d.id !== id);
    }
  }

  // Method to handle the input change when editing the discount value
  onEditValue(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (value >= 0 && value <= 100) {
      this.isValidValue = true;
      this.editingValue = input.value;
    } else {
      this.isValidValue = false;
    }
  }

  // Get the product and category discounts
  get productDiscounts() {
    return this.discounts
      .filter(d => d.type === 'product')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by date descending
  }

  get categoryDiscounts() {
    return this.discounts
      .filter(d => d.type === 'category')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by date descending
  }

  // show and hide the filter div in tablet and mobile
  showSidebar() {
    let sidebar = document.getElementById('sidebar')

    if (sidebar) {
      sidebar.style.display = 'flex'
    }
  }

  closeSidebar() {
    let sidebar = document.getElementById('sidebar')
    if (sidebar)
      sidebar.style.display = 'none'
  }

  // code to change announcement
  announcementsEn: string[] = [];

  editingAnnouncementStates: { [key: number]: boolean } = {};
  AnnouncementinputValuesEn: { [key: number]: string } = {};
  // AnnouncementinputValuesAr: { [key: number]: string } = {};

  newAnnouncementEn = '';
  // newAnnouncementAr = '';
  showAddAnnouncementPopup = false;

  private readonly announcementKey = 'sliderMessages';


  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private loadAnnouncements(): void {
    if (this.isBrowser()) {
      const stored = localStorage.getItem(this.announcementKey);
      this.announcementsEn = stored ? JSON.parse(stored) : [];
    }
  }

  //  Save to localStorage
  private saveAnnouncements(): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.announcementKey, JSON.stringify(this.announcementsEn));
    }
  }

  openAddAnnouncementPopup() {
    this.showAddAnnouncementPopup = true;
    this.newAnnouncementEn = '';
    // this.newAnnouncementAr = '';
  }

  closeAddAnnouncementPopup() {
    this.showAddAnnouncementPopup = false;
  }

  handleAnnouncementInputEn(event: Event) {
    this.newAnnouncementEn = (event.target as HTMLInputElement).value;
  }

  // handleAnnouncementInputAr(event: Event) {
  //   this.newAnnouncementAr = (event.target as HTMLInputElement).value;
  // }

  addNewAnnouncement() {
    const en = this.newAnnouncementEn.trim();
    // const ar = this.newAnnouncementAr.trim();
    if (en) {
      this.announcementsEn.push(en)
      this.saveAnnouncements();
      this.closeAddAnnouncementPopup();
    } else {
      alert('Please enter both EN and AR announcements.');
    }
  }

  editAnnouncementName(index: number, en: string) {
    this.editingAnnouncementStates[index] = true;
    this.AnnouncementinputValuesEn[index] = en;
    // this.AnnouncementinputValuesAr[index] = ar;
  }

  saveAnnouncementName(index: number) {
    this.announcementsEn[index] = this.AnnouncementinputValuesEn[index];
    this.saveAnnouncements();
    this.editingAnnouncementStates[index] = false;
  }

  cancelAnnouncementEditing(index: number) {
    this.editingAnnouncementStates[index] = false;
    delete this.AnnouncementinputValuesEn[index];
    // delete this.AnnouncementinputValuesAr[index];
  }

  AnnouncementChangeEn(index: number, event: Event) {
    this.AnnouncementinputValuesEn[index] = (event.target as HTMLInputElement).value;
  }

  AnnouncementChangeAr(index: number, event: Event) {
    // this.AnnouncementinputValuesAr[index] = (event.target as HTMLInputElement).value;
  }

  confirmDeleteAnnouncement(index: number) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementsEn.splice(index, 1);
      this.saveAnnouncements();
    }
  }

  Logout() {
    localStorage.removeItem('admin-token');
    this.router.navigate(['/login-admin']);
  }

}
