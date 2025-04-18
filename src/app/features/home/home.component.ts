import { Component, HostListener, Inject, PLATFORM_ID, ElementRef, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, SharedModule, RouterModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})

export class HomeComponent {
	trendingCollectionId = '67ea6d0cc4338e7d55573ac4';
	newArrivedCollectionId = '67eb079f48a62338c7e3185c';
	dealsCollectionId = '67eb0a7048a62338c7e31860';

	productsTrending: { id: string; name: string; price: number; image: string }[] = [];
	productsArrived: { id: string; name: string; price: number; image: string }[] = [];
	deals: { id: string; name: string; price: number; image: string }[] = [];

	constructor(private router: Router,
		private el: ElementRef,
		private productService: ProductService) { }

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
				this.productsTrending = data.map((product: any) => ({
					id: String(product.ID),
					name: product.Title,
					price: product.Price,
					image: product.Image
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
				this.productsArrived = data.map((product: any) => ({
					id: String(product.ID),
					name: product.Title,
					price: product.Price,
					image: product.Image
				}));
			},
			error: (error) => {
				console.error('Error fetching products:', error);
			}
		});
		this.productService.getProductsByCollection(this.dealsCollectionId).subscribe({
			next: (data) => {
				this.deals = data.map((product: any) => ({
					id: String(product.ID),
					name: product.Title,
					price: product.Price,
					image: product.Image
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
		this.router.navigate(['/product'], { state: { productId: id } });
	}

}

