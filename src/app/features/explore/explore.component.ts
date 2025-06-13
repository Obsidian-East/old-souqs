import { Component, ElementRef, OnInit, ChangeDetectorRef, HostListener , QueryList, ViewChildren  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { EventBusService } from '../../shared/event-bus.service';

@Component({
	selector: 'app-explore',
	standalone: true,
	imports: [CommonModule, SharedModule, RouterModule],
	templateUrl: './explore.component.html',
	styleUrl: './explore.component.css'
})
export class ExploreComponent {
	constructor(
		private router: Router,
		private productService: ProductService,
  		private cartService: CartService,
		public wishlistService: WishlistService,
		private cd: ChangeDetectorRef,
		private eventBus: EventBusService
	) { }

	ngOnInit(): void {
		this.fetchCollections();
		this.fetchProducts();
	}

	// categories
	categories: any[] = [];
	selectedCategory: any = null;
	selectedName: string = "";

	// Filtered Products
	originalProducts: any[] = []; // Holds the full, unfiltered list
	filteredProducts: any[] = [];
	allproducts: any[] = [];

	// Stock tracking
	totalCountInStock = 0;
	totalCountOfOutStock = 0;
	selectednumber = 0;

	// Category counts
	selectedCategoryNumber = 0;
	totalCount = 0;

	// Price
	minValue = 0;
	maxValue = 0;
	minLimit = 0;
	maxLimit = 0;

	// Availability
	selectedAvailability: any = null;

	// Selected sort
	selectedItem: string = 'Best selling';

	// --- Fetching Functions ---
	fetchCollections() {
		this.productService.getCollections().subscribe({
			next: (data) => {
				this.categories = data.map((collection: any) => ({
					id: collection.ID,
					name: collection.CollectionName,
					count: Array.isArray(collection.ProductIds) ? collection.ProductIds.length : 0,
				}));
				this.selectedCategoryNumber = this.categories.reduce((sum, c) => sum + c.count, 0);
				this.totalCount = this.selectedCategoryNumber;
			},
			error: (error) => {
				console.error('Error fetching collections:', error);
			}
		});
	}

	fetchProducts() {
		if (this.selectedCategory) {
			// Fetch by selected category
			this.fetchProductsByCollection(this.selectedCategory.id);
		} else {
			// Fetch all products
			this.productService.getProducts().subscribe({
				next: (data) => {
					this.originalProducts = data.map((product: any) => ({
						id: product.id,
						name: product.title,
						description: product.description,
						price: product.price,
						image: product.image,
						stock: product.stock,
						instock: product.stock > 0,
					}));

					this.allproducts = [...this.originalProducts];
					this.setPriceLimits();
					this.calculateStock();
					this.applyFilters();
				},
				error: (error) => {
					console.error('Error fetching products:', error);
				}
			});
		}
	}



	// --- Filtering Functions ---
	toggleCategory(collection: any) {
		if (this.selectedCategory?.id === collection.id) {
			this.selectedCategory = null; // unselect
		} else {
			this.selectedCategory = collection;
		}
		this.fetchProducts(); // single point of logic
	}


	applyFilters() {
		this.allproducts = this.originalProducts.filter(product => {
			const matchesAvailability =
				!this.selectedAvailability ||
				(this.selectedAvailability === 'instock' && product.instock) ||
				(this.selectedAvailability === 'outofstock' && !product.instock);

			const matchesPrice = product.price >= this.minValue && product.price <= this.maxValue;

			return matchesAvailability && matchesPrice;
		});

		this.selectednumber = this.allproducts.length;
		this.totalCount = this.selectednumber;
		this.sortProducts();
	}


	fetchProductsByCollection(collectionId: string) {
		this.productService.getProductsByCollection(collectionId).subscribe({
			next: (data) => {
				this.originalProducts = data.map((product: any) => ({
					id: product.ID,
					name: product.Title,
					description: product.Description,
					price: product.Price,
					image: product.Image,
					stock: product.Stock,
					instock: product.Stock > 0,
				}));
				console.log(data);
				console.log(this.originalProducts)

				this.allproducts = [...this.originalProducts];
				this.totalCount = this.allproducts.length
				this.setPriceLimits();
				this.calculateStock();
				this.applyFilters();
			}
		});
	}

	calculateStock() {
		this.totalCountInStock = 0;
		this.totalCountOfOutStock = 0;

		this.allproducts.forEach((product) => {
			if (product.instock) this.totalCountInStock++;
			else this.totalCountOfOutStock++;
		});
	}

	toggleAvailability(availibility: any) {
		this.selectedAvailability = this.selectedAvailability === availibility ? null : availibility;

		if (availibility === 'instock') this.selectednumber = this.totalCountInStock;
		if (availibility === 'outofstock') this.selectednumber = this.totalCountOfOutStock;
		if (this.selectedAvailability === null) this.selectednumber = this.totalCountInStock + this.totalCountOfOutStock;

		this.applyFilters();
	}

	// --- Price Functions ---

	setPriceLimits() {
		const prices = this.allproducts.map(p => p.price);
		this.minLimit = Math.min(...prices);
		this.maxLimit = Math.max(...prices);
		this.minValue = this.minLimit;
		this.maxValue = this.maxLimit;
	}

	updateMinValue(event: Event) {
		const value = Number((event.target as HTMLInputElement).value);
		if (value < this.maxValue) {
			this.minValue = value;
			this.applyFilters();
		}
	}

	updateMaxValue(event: Event) {
		const value = Number((event.target as HTMLInputElement).value);
		if (value > this.minValue) {
			this.maxValue = value;
			this.applyFilters();
		}
	}

	updateValues(type: 'min' | 'max', event: Event) {
		const value = Number((event.target as HTMLInputElement).value);


		if (type === 'min' && value < this.maxValue) {
			this.minValue = value;
		} else if (type === 'max' && value > this.minValue) {
			this.maxValue = value;
		}
	}

	onSelect(event: Event) {
		this.selectedItem = (event.target as HTMLSelectElement).value;
		this.sortProducts();
	}

	// function to move from trending to new arrived in our collection section
	showGridProduct: boolean = true;
	showListProduct: boolean = false;
	TabAction(index: number) {
		let buttonGrid = document.querySelector('.grid-list')
		let buttonList = document.querySelector('.ul-list')

		if (buttonGrid && buttonList) {
			if (index === 1) {
				// Grid svg clicked
				this.showGridProduct = true;
				this.showListProduct = false;
				buttonList.classList.remove("active")
				buttonGrid.classList.add("active")
			}
			else if (index === 2) {
				// List svg clicked
				this.showGridProduct = false;
				this.showListProduct = true;
				buttonGrid.classList.remove("active")
				buttonList.classList.add("active")
			}
		}
	}

	hoveredItem: any = null; // Tracks the currently hovered product

	showProductActions(product: any): void {
		this.hoveredItem = product; // Set hovered item
	}

	hideProductActions(): void {
		this.hoveredItem = null; // Reset on mouse leave
	}


	// show and hide the filter div in tablet and mobile
	toggleFilter() {
		let filter = document.getElementById('filter')

		if (filter) {
			if (filter.style.display === 'flex') {
				// to hide
				filter.style.display = 'none'
			}
			else if (filter.style.display === 'none') {
				// to show
				filter.style.display = 'flex'
			}
		}
	}

	closeFilter() {
		let filter = document.getElementById('filter')
		if (filter)
			filter.style.display = 'none'
	}

	// to send the product id to the product page when clicking on a product name

	goToProduct(id: string) {
  this.router.navigate(['/product', id]);
}


	// --- Misc ---

	get activeFilters() {
		const filters = [];
		if (this.minValue !== this.minLimit || this.maxValue !== this.maxLimit) {
			filters.push(`${this.minValue}$ - ${this.maxValue}$`);
		}
		if (this.selectedAvailability) {
			filters.push(this.selectedAvailability === 'instock' ? 'In stock' : 'Out of stock');
		}
		if (this.selectedCategory) {
			filters.push(this.selectedCategory.name);
		}
		return filters;
	}

	clearAllFilters() {
		this.selectedCategory = null;
		this.selectedAvailability = null;
		this.minValue = this.minLimit;
		this.maxValue = this.maxLimit;
		this.fetchProducts(); // Refetch all products and apply filters
	}

	clearAvailabiltyFilters() {
		this.selectedCategory = null;
		this.selectedAvailability = null;
		this.fetchProducts(); // Refetch all products and apply filters
	}

	clearMoneyFilters() {
		this.minValue = this.minLimit;
		this.maxValue = this.maxLimit;
		this.fetchProducts(); // Refetch all products and apply filters
	}

	// --Sorting--
	sortProducts() {
		if (this.selectedItem === 'Price, low to high') {
			this.allproducts.sort((a, b) => a.price - b.price);
		} else if (this.selectedItem === 'Price, high to low') {
			this.allproducts.sort((a, b) => b.price - a.price);
		}
	}

	// --- Cart Actions aligned with CartService ---
	addToCart(product: any): void {
		const item: CartItem = {
		  id: product.id,
		  title: product.name,
		  image: product.image,
		  price: product.price,
		  quantity: 1,
		  stock: product.stock
		};
		this.cartService.addToCart(item);
		this.eventBus.triggerOpenCart();
	  }

	  toggleWishlist(productId: string) {
		this.wishlistService.toggleWishlist(productId).subscribe(() => {
			this.cd.detectChanges(); // force UI refresh if needed
		});
	}

	// to adjust item name 
	@ViewChildren('nameRef') nameRefs!: QueryList<ElementRef>;

	@HostListener('window:resize')
	onResize() {
	this.adjustFontSizes();
	}

	ngAfterViewInit() {
	this.adjustFontSizes();
	}

	adjustFontSizes() {
    this.nameRefs.forEach((elRef: ElementRef) => {
      const el = elRef.nativeElement as HTMLElement;
      let fontSize = 1.1; // rem
      const maxHeight = el.clientHeight;

      el.style.fontSize = `${fontSize}rem`;

      while (el.scrollHeight > maxHeight && fontSize > 0.6) {
        fontSize -= 0.05;
        el.style.fontSize = `${fontSize}rem`;
      }
    });
  }

}

