import { Component, HostListener, OnInit, ChangeDetectorRef, AfterViewInit, QueryList, ViewChildren, ElementRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { EventBusService } from '../../shared/event-bus.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, SharedModule, RouterModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
	trendingCollectionId = '67ea6d0cc4338e7d55573ac4';
	newArrivedCollectionId = '6877b1ba607a5079c14c6649';
	dealsCollectionId = '67eb0a7048a62338c7e31860';

	productsTrending: { id: string; name: string; price: number; image: string }[] = [];
	productsArrived: { id: string; name: string; price: number; image: string }[] = [];
	deals: { id: string; name: string; price: number; image: string }[] = [];

	//   customized img
	images: string[] = [
		'https://old-souqs.sirv.com/customized/image00018.jpeg',
		'https://old-souqs.sirv.com/customized/image00026.jpeg',
		'https://old-souqs.sirv.com/customized/image00021.jpeg',
		'https://old-souqs.sirv.com/customized/image00007.jpeg',
		'https://old-souqs.sirv.com/customized/image00015.jpeg',
		'https://old-souqs.sirv.com/customized/image00019.jpeg',
		'https://old-souqs.sirv.com/customized/image00020.jpeg'
	];
	customizedIndex: number = 0;
	intervalId: any;
	transitionStyle: string = 'transform 0.5s ease-in-out';

	constructor(private router: Router,
		private el: ElementRef,
		private productService: ProductService,
		private cartService: CartService,
		public wishlistService: WishlistService,
		private cd: ChangeDetectorRef,
		private ngZone: NgZone,
		private eventBus: EventBusService) {

		this.ngZone.runOutsideAngular(() => {
			this.intervalId = setInterval(() => {
				this.ngZone.run(() => this.showNextSlide());
			}, 5000);
		});
	}



	showNextSlide() {
		this.customizedIndex = (this.customizedIndex + 1) % this.images.length;
	}

	getTransform(): string {
		return `translateX(-${this.customizedIndex * 100}%)`;
	}

	ngOnDestroy() {
		if (this.intervalId) clearInterval(this.intervalId);
	}
	ngOnInit(): void {
		this.fetchProductsByCollection();
		setTimeout(() => {
			if (!this.subscribed) {
				this.showSubscribe = true;
			}
		}, 1000);
	}

	fetchProductsByCollection(): void {
		this.productService.getProductsByCollection(this.trendingCollectionId).subscribe({
			next: (data) => {
				console.log('Fetched trending products:', data);
				this.productsTrending = (data || []).map((product: any) => ({
					id: String(product.id),
					name: product.title,
					price: product.price,
					image: product.image,
					stock: product.stock
				}));
				// Initialize the products array with trending products
				this.products = this.productsTrending;
			},
			error: (error) => {
				console.error('Error fetching products:', error);
			}
		});
		this.productService.getProductsByCollection(this.newArrivedCollectionId).subscribe({
			next: (data) => {
				this.productsArrived = (data || []).map((product: any) => ({
					id: String(product.ID),
					name: product.title,
					price: product.price,
					image: product.image,
					stock: product.stock
				}));
			},
			error: (error) => {
				console.error('Error fetching products:', error);
			}
		});
		this.productService.getProductsByCollection(this.dealsCollectionId).subscribe({
			next: (data) => {
				this.deals = (data || []).map((product: any) => ({
					id: String(product.ID),
					name: product.title,
					price: product.price,
					image: product.image,
					stock: product.stock
				}));
			},
			error: (error) => {
				console.error('Error fetching products:', error);
			}
		});
	}

	// collection showing 
	products = this.productsTrending
	hoveredItem: any = null; // Tracks the currently hovered product
	TabAction(index: number) {

		let buttonTrending = document.querySelector('.tabs-button-trending')
		let buttonArrived = document.querySelector('.tabs-button-arrived')

		if (buttonTrending && buttonArrived) {
			if (index === 1) {
				// Trending button clicked
				buttonArrived.classList.remove("active")
				buttonTrending.classList.add("active")
				this.products = this.productsTrending
			}
			else if (index === 2) {
				// New Arrived button clicked
				buttonTrending.classList.remove("active")
				buttonArrived.classList.add("active")
				this.products = this.productsArrived
			}
		}
	}

	// using width only 2 is showing on click on a dot we got an index to translate so another item is showing
	moveCollection(index: number): void {
		let carousel = document.getElementById("collection");
		if (!carousel) { return };
		this.currentIndex = index;
		carousel.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/
		this.updateCollectionDots();// to update the color of the clicked dot
	}

	updateCollectionDots() {
		let dots = document.querySelectorAll(".dot-collection");
		dots.forEach((dot, i) => {
			if (dot) {
				if (i === this.currentIndex) {//clicked dot
					dot.classList.add("active-dot")
				}
				else {
					dot.classList.remove("active-dot")
				}
			}
		});
	}


	showProductActions(product: any): void {
		this.hoveredItem = product; // Set hovered item
	}

	hideProductActions(): void {
		this.hoveredItem = null; // Reset on mouse leave
	}

	hoveredDeal: any = null;

	hideProductActionsInDeals(): void {
		this.hoveredDeal = null;
	}
	showProductActionsInDeals(product: any): void {
		this.hoveredDeal = product; // Set hovered item
	}

	private currentIndex: number = 0;

	// using width only 2 is showing on click on a dot we got an index to translate so another item is showing
	moveToSlide(index: number): void {
		let carousel = document.getElementById("carousel");
		let carouselTablet = document.getElementById("carousel-tablet");
		if (!carousel || !carouselTablet) { return };
		this.currentIndex = index;
		carousel.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/
		carouselTablet.style.transform = `translateX(-${this.currentIndex * 50}%)`; /* use 33.33 to show 3 items*/
		this.updateDots();// to update the color of the clicked dot
	}

	updateDots() {
		let dots = document.querySelectorAll(".dot");
		dots.forEach((dot, i) => {
			if (dot) {
				if (i === this.currentIndex) {//clicked dot
					dot.classList.add("active-dot")
				}
				else {
					dot.classList.remove("active-dot")
				}
			}
		});
	}

	comments = [
		{ name: 'Julian Nyatt', starsNumber: 1, comment: ":there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable." },
		{ name: 'Claire Divas', starsNumber: 2, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable." },
		{ name: 'Lisa Rosnick', starsNumber: 3, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable." },
		{ name: 'Jack Aranda', starsNumber: 4, comment: "there are many variations of passages of lorem lpsum available, but the majority have an suffered alteration in some form, by injected humour, or randomised words which don't a look even slightly believable." }
	];
	currentCommentIndex: number = 0;
	commentName = this.comments[0].name
	commentStar = this.comments[0].starsNumber
	commentContent = this.comments[0].comment

	moveComment(index: number): void {
		this.currentCommentIndex += index;
		if (this.currentIndex === -1) this.currentCommentIndex = this.comments.length - 1
		if (this.currentCommentIndex === this.comments.length) this.currentCommentIndex = 0

		this.commentName = this.comments[this.currentCommentIndex].name
		this.commentStar = this.comments[this.currentCommentIndex].starsNumber
		this.commentContent = this.comments[this.currentCommentIndex].comment



	}

	// email subscription 
	subscribed = true;
	showSubscribe = true;
	email = '';

	closeSubscribe() {
		this.showSubscribe = false;
	}

	subscribe() {
		this.showSubscribe = false;
	}


	// to send the product id to the product page when clicking on a product name

	// constructor(private router: Router) {}
	goToProduct(id: string) {
		this.router.navigate(['/product', id]);
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


	//   customized items section

	customized = [
		{
			"id": "1",
			"name": "Engraved Copper Plate1",
			"price": 120,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "A hand-engraved copper plate featuring traditional patterns and ornate detailing."
		},
		{
			"id": "1",
			"name": "Antique Brass Teapot2",
			"price": 185,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "This vintage teapot, crafted in the early 1900s, boasts elegant curves and aged charm."
		},
		{
			"id": "1",
			"name": "Custom Calligraphy Wall Art3",
			"price": 250,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "Personalized Arabic calligraphy hand-etched onto a copper panel for a timeless wall display."
		},
		{
			"id": "1",
			"name": "Decorative Copper Lantern4",
			"price": 95,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "A traditionally styled lantern with intricate carvings, perfect for ambient lighting or decor."
		},
		{
			"id": "1",
			"name": "Custom Nameplate in Copper5",
			"price": 70,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "A bespoke copper nameplate etched with your name or message — perfect for homes or gifts."
		},
		{
			"id": "1",
			"name": "Custom Nameplate in Copper6",
			"price": 70,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "A bespoke copper nameplate etched with your name or message — perfect for homes or gifts."
		},
		{
			"id": "1",
			"name": "Custom Nameplate in Copper7",
			"price": 70,
			"image": "https://old-souqs.sirv.com/Products/1f1.jpg",
			"description": "A bespoke copper nameplate etched with your name or message — perfect for homes or gifts."
		}
	];
	private currentCustomizedIndex: number = 0;
	maxDots = this.customized.length - 3;
	maxDotsTablet = this.customized.length;

	// using width only 4 is showing on click on a dot we got an index to translate so another item is showing
	moveCustomizedToSlide(index: number): void {
		let carousel = document.getElementById("customized-carousel");
		let carouselTablet = document.getElementById("customized-carousel-tablet");
		if (!carousel || !carouselTablet) { return };
		this.currentCustomizedIndex = index;
		carousel.style.transform = `translateX(-${this.currentCustomizedIndex * 25}%)`; /* use 33.33 to show 3 items*/
		carouselTablet.style.transform = `translateX(-${this.currentCustomizedIndex * 50}%)`; /* use 33.33 to show 3 items*/
		this.updateCustomizedDots();// to update the color of the clicked dot
	}

	updateCustomizedDots() {
		let dots = document.querySelectorAll(".customized-dot");
		let dotsTablet = document.querySelectorAll(".customized-dot-tablet");
		dots.forEach((dot, i) => {
			if (dot) {
				if (i === this.currentCustomizedIndex) {//clicked dot
					dot.classList.add("customized-active-dot")
				}
				else {
					dot.classList.remove("customized-active-dot")
				}
			}
		});
		dotsTablet.forEach((dot, i) => {
			if (dot) {
				if (i === this.currentCustomizedIndex) {//clicked dot
					dot.classList.add("customized-active-dot")
				}
				else {
					dot.classList.remove("customized-active-dot")
				}
			}
		});
	}

	toggleWishlist(productId: string) {
		this.wishlistService.toggleWishlist(productId).subscribe(() => {
			this.cd.detectChanges(); // force UI refresh if needed
		});
	}

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
