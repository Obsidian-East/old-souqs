import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { AnnouncementService } from '../../services/announcement.service';
import { Product } from '../../models/product.model';
import { catchError, forkJoin, map, of } from 'rxjs';

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

  // Data from backend
  products: any[] = [];
  categories: any[] = [];
  discounts: any[] = [];

  // Arrays to hold combined data for display
  productDiscountItems: any[] = [];
  categoryDiscountItems: any[] = [];

  // Map for quick lookup of names
  discountNames: { [key: string]: string } = {};

  // Form data for new discount
  newDiscount = {
    type: 'product',
    targetId: '',
    value: 0
  };

  // UI state variables
  showAddDiscountPopup = false;
  editingId: string | null = null;
  editingValue: string = '';
  isValidValue: boolean = true;
  isAddingDiscount: boolean = false;

  // Custom modal for confirmations
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalAction!: () => void;

  constructor(private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private announcementService: AnnouncementService) {
    this.loadAnnouncements();
  }
  ngOnInit() {
    this.fetchCollections();
    this.fetchProducts(() => {
      this.fetchOrders();
      this.productService.getDiscounts().subscribe({
        next: (res) => {
          this.discounts = res.map((d: any) => ({
            ...d,
            type: d.targetType // 🔁 map targetType → type
          }));
          this.loadDiscountDetails();
        },
        error: (err) => {
          console.error('Failed to fetch discounts', err);
        }
      });
    })
    this.loadAnnouncements();
    console.log('ShowAnnouncements:', this.showAddAnnouncementPopup);
  }

  fetchDiscountRelatedItems() {
    const productDiscounts = this.discounts.filter(d => d.type === 'product');
    const categoryDiscounts = this.discounts.filter(d => d.type === 'collection');

    const productRequests = productDiscounts.map(discount =>
      this.productService.getProductById(discount.targetId).pipe(
        map(product => ({ discount, product })),
        catchError(() => of(null)) // Handle missing product
      )
    );

    const categoryRequests = categoryDiscounts.map(discount =>
      this.productService.getCollectionById(discount.targetId).pipe(
        map(collection => ({ discount, collection })),
        catchError(() => of(null)) // Handle missing collection
      )
    );

    forkJoin([
      forkJoin(productRequests),
      forkJoin(categoryRequests)
    ]).subscribe(([products, categories]) => {
      this.productDiscountItems = products.filter(item => item);
      this.categoryDiscountItems = categories.filter(item => item);
    });
  }

  allproducts: { id: string; image: string; nameEn: string; nameAr: string; tags: string[]; price: number; quantity: number; descriptionEn: string; descriptionAr: string, sku: string, instock: boolean }[] = [];
  collections: { id: string; nameEn: string; nameAr: string }[] = [];
  orders: { orderId: string; orderDate: string; urserId: string; productsIds: { id: string; quantity: string; }[]; location: string, total: number }[] = [];

  // --- Fetching Functions ---
  fetchCollections() {
    this.productService.getCollections().subscribe({
      next: (data) => {
        this.collections = data.map((collection: any) => ({
          id: collection.id,
          nameEn: collection.collectionName,
          nameAr: collection.collectionNameAr
        }));
      },
      error: (error) => {
        console.error('Error fetching collections:', error);
      }
    });
  }

  fetchProducts(callback?: () => void) {
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

        if (callback) callback(); // ✅ Call the callback once done
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
    this.productService.adminGetProductById(product.id).subscribe({
      next: (freshProduct) => {
        this.selectedProduct = {
          id: product.id,
          nameEn: freshProduct.title, // map correctly
          nameAr: freshProduct.titleAr,
          quantity: freshProduct.stock, // match displayed field
          descriptionEn: freshProduct.description,
          descriptionAr: freshProduct.descriptionAr,
          sku: freshProduct.sku,
          image: freshProduct.image,
          price: freshProduct.price,
          instock: freshProduct.stock > 0,
          tags: Array.isArray(freshProduct.tag) ? [...freshProduct.tag] : [],
        };
        console.log('Selected product for editing:', this.selectedProduct);
        console.log('Selected product ID:', this.selectedProduct.id);
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

  handleEditImageUpload(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.productService.uploadImage(file).subscribe({
      next: (res) => {
        this.selectedProduct.image = res.url;
      },
      error: (err) => {
        console.error('Image upload failed:', err);
        alert('Image upload failed.');
      }
    });
  }


  // Update the product in the array
  updateProduct() {
    if (!this.selectedProduct.id) {
      alert('Error: Product ID is missing for update.');
      return;
    }

    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated successfully:', updatedProduct);

        const index = this.products.findIndex(p => p.id === updatedProduct._id || p._id === updatedProduct._id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        // Refetch the full product list
        this.productService.getProducts().subscribe((products) => {
          this.products = products;
          this.closePopup();
        });
      },
      error: (err) => {
        console.error('Failed to update product:', err);
        alert('Failed to update product: ' + (err.error?.message || err.message));
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
    const updatedData = {
      collectionName: this.inputValuesEn[collectionId],
      collectionNameAr: this.inputValuesAr[collectionId]
    };

    this.productService.updateCollection(collectionId, updatedData).subscribe({
      next: (res) => {
        const collection = this.categories.find(c => c.id === collectionId);
        if (collection) {
          collection.nameEn = updatedData.collectionName;
          collection.nameAr = updatedData.collectionNameAr;
        }
        this.editingStates[collectionId] = false;
      },
      error: (err) => {
        console.error('Failed to update collection:', err);
        alert('Error updating collection');
      }
    });
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
      const newCollection = {
        collectionName: nameEn,
        collectionNameAr: nameAr,
        description: nameEn, // Add these if needed
        descriptionAr: nameAr,
        productIds: [],
        showCollection: true
      };

      this.productService.addCollection(newCollection).subscribe({
        next: (res) => {
          alert('Collection added!');
          this.fetchCollections(); // If you're listing them
          this.closeAddCollectionPopup();
        },
        error: (err) => {
          alert('Failed to add collection');
          console.error(err);
        }
      });
    } else {
      alert('Please enter a collection name.');
    }
  }

  deleteCollection(collectionId: string) {
    if (confirm('Are you sure you want to delete this collection?')) {
      this.productService.deleteCollection(collectionId).subscribe(
        () => {
          // Remove it from the local list
          this.collections = this.collections.filter(c => c.id !== collectionId);
        },
        (error) => {
          console.error('Error deleting collection:', error);
        }
      );
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
  onTypeChange() {
    this.newDiscount.targetId = ''; // Reset selection on type switch
  }

  handleDiscountField(field: DiscountField, event: Event) {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    const value = input.value;

    if (field === 'type') {
      this.newDiscount.type = value as 'product' | 'collection';
      this.newDiscount.targetId = ''; // reset target when type changes
    } else if (field === 'value') {
      this.newDiscount.value = parseFloat(value);
    } else if (field === 'targetId') {
      this.newDiscount.targetId = value;
    }
  }

  editingIndex: number | null = null; // To track the index of the editing discount

  loadDiscountDetails() {
    const productDiscounts = this.discounts.filter(d => d.targetType === 'product');
    const collectionDiscounts = this.discounts.filter(d => d.targetType === 'collection');
    console.log('product id type:', typeof this.allproducts[0]?.id);
    console.log('discount targetId type:', typeof productDiscounts[0]?.targetId);

    // Create a new array for product discounts with data
    this.productDiscountItems = productDiscounts.map(d => {
      const product = this.allproducts.find(p => String(p.id) === String(d.targetId));
      return {
        discount: d,
        product: product
      };
    });


    console.log('Product Discounts:', this.productDiscountItems);

    // Create a new array for collection discounts with data
    this.categoryDiscountItems = collectionDiscounts.map(d => {
      const collection = this.collections.find(c => String(c.id) === String(d.targetId));
      return {
        discount: d,
        collection: collection
      };
    });

  }

  // ngOnInit() {
  //   this.computeDiscountNames();
  // }

  // Precompute the names of products or categories
  computeDiscountNames() {
    this.discounts.forEach(d => {
      if (d.type === 'product') {
        const p = this.products.find(p => p.id === d.targetId);
        this.discountNames[d.id] = p ? `${p.nameEn} - ${p.nameAr}` : 'Unknown Product';
      } else {
        const c = this.categories.find(c => c.id === d.targetId);
        this.discountNames[d.id] = c ? `${c.nameEn} - ${c.nameAr}` : 'Unknown Category';
      }
    });
  }

  // Creates a new discount
  addDiscount() {
    if (this.isAddingDiscount) return; // Prevent double submission
    this.isAddingDiscount = true;
    const payload = {
      targetType: this.newDiscount.type,         // "product" or "collection"
      targetId: this.newDiscount.targetId,       // must be valid Mongo ID
      percentage: this.newDiscount.value         // number between 0–100
    };

    this.productService.createDiscount(payload).subscribe({
      next: () => {
        this.showAddDiscountPopup = false;
        this.fetchDiscountRelatedItems(); // refresh list
      },
      error: (err) => {
        console.error("Error creating discount:", err);
        alert("Failed to create discount.");
      },
      complete: () => {
        this.isAddingDiscount = false;
      }
    });
  }


  // Enables edit mode for a specific discount
  editDiscount(id: string) {
    this.editingId = id;
    const d = this.discounts.find(d => d.id === id);
    if (d) {
      this.editingValue = d.percentage.toString();
      this.isValidValue = true;
    }
  }

  // Saves the edited discount
  saveDiscount() {
    const newPercentage = Number(this.editingValue);
    if (isNaN(newPercentage) || newPercentage <= 0 || newPercentage > 100) {
      this.isValidValue = false;
      this.showCustomModal('Error', 'Please enter a valid discount value between 1 and 100.', () => { });
      return;
    }
    this.isValidValue = true;

    const d = this.discounts.find(dis => dis.id === this.editingId);
    if (!d) return;

    const payload = {
      ...d,
      percentage: newPercentage
    };

    if (this.editingId) {
      this.productService.updateDiscount(this.editingId, payload).subscribe({
        next: (res) => {
          // Find and update the local discount object
          const index = this.discounts.findIndex(dis => dis.id === this.editingId);
          if (index > -1) {
            this.discounts[index].percentage = res.percentage;
          }
          this.loadDiscountDetails();
          this.editingId = null;
          this.editingValue = '';
          this.showCustomModal('Success', 'Discount updated successfully!', () => { });
        },
        error: () => this.showCustomModal('Error', 'Error updating discount.', () => { })
      });
    }
  }

  // Cancels edit mode
  cancelEdit() {
    this.editingId = null;
    this.editingValue = '';
  }

  // Prepares the modal for discount deletion
  deleteDiscount(id: string) {
    this.modalTitle = 'Confirm Delete';
    this.modalMessage = 'Are you sure you want to delete this discount?';
    this.modalAction = () => this.confirmDeleteDiscount(id);
    this.showModal = true;
  }

  // Confirms and deletes the discount
  confirmDeleteDiscount(id: string) {
    this.productService.deleteDiscount(id).subscribe({
      next: () => {
        this.discounts = this.discounts.filter(d => d.id !== id);
        this.loadDiscountDetails();
        this.showModal = false;
        this.showCustomModal('Success', 'Discount deleted successfully!', () => { });
      },
      error: () => {
        this.showModal = false;
        this.showCustomModal('Error', 'Failed to delete discount.', () => { });
      }
    });
  }

  // Helper function to show a custom modal
  showCustomModal(title: string, message: string, action: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalAction = action;
    this.showModal = true;
  }

  // Closes the custom modal
  closeModal() {
    this.showModal = false;
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
      .filter(d => d.type === 'collection')
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
  announcementsEn: any[] = [];

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
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcementsEn = data;
        console.log('Announcements loaded:', data);;
      },
      error: (err) => {
        console.error('Failed to get the announcements:', err);
        alert('Failed to get the announcements.');
      }
    });
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
    console.log('ShowAnnouncements:', this.showAddAnnouncementPopup);
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
    const message = this.newAnnouncementEn.trim();
    if (!message) {
      alert('Please enter an announcement.');
      return;
    }

    this.announcementService.createAnnouncement({ message }).subscribe(newAnnouncement => {
      this.announcementsEn.push(newAnnouncement);
      this.closeAddAnnouncementPopup();
      this.newAnnouncementEn = ''; // Clear input after adding
    });
  }

  // editAnnouncementName(index: number, en: string) {
  //   this.editingAnnouncementStates[index] = true;
  //   this.AnnouncementinputValuesEn[index] = en;
  //   // this.AnnouncementinputValuesAr[index] = ar;
  // }

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

  confirmDeleteAnnouncement(index: string) {
    if (this.announcementsEn.length === 1) {
      alert('You cannot delete the last announcement.');
      return;
    }
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.deleteAnnouncement(index).subscribe(() => {
        this.loadAnnouncements();
      });
    }
  }

  Logout() {
    localStorage.removeItem('admin-token');
    this.router.navigate(['/login-admin']);
  }

}
