import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-customized',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './customized.component.html',
  styleUrl: './customized.component.css'
})
export class CustomizedComponent {
  	//   customized img
  images: string[] = [
	'https://old-souqs.sirv.com/customized/image00001.jpeg',
  'https://old-souqs.sirv.com/customized/image00002.jpeg',
  'https://old-souqs.sirv.com/customized/image00003.jpeg',
  'https://old-souqs.sirv.com/customized/image00004.jpeg',
  'https://old-souqs.sirv.com/customized/image00005.jpeg',
  'https://old-souqs.sirv.com/customized/image00006.jpeg',
  'https://old-souqs.sirv.com/customized/image00007.jpeg',
  'https://old-souqs.sirv.com/customized/image00008.jpeg',
  'https://old-souqs.sirv.com/customized/image00009.jpeg',
  'https://old-souqs.sirv.com/customized/image00010.jpeg',
  'https://old-souqs.sirv.com/customized/image00011.jpeg',
  'https://old-souqs.sirv.com/customized/image00012.jpeg',
  'https://old-souqs.sirv.com/customized/image00013.jpeg',
  'https://old-souqs.sirv.com/customized/image00014.jpeg',
  'https://old-souqs.sirv.com/customized/image00015.jpeg',
  'https://old-souqs.sirv.com/customized/image00016.jpeg',
  'https://old-souqs.sirv.com/customized/image00017.jpeg',
  'https://old-souqs.sirv.com/customized/image00018.jpeg',
  'https://old-souqs.sirv.com/customized/image00019.jpeg',
  'https://old-souqs.sirv.com/customized/image00020.jpeg',
  'https://old-souqs.sirv.com/customized/image00021.jpeg',
  'https://old-souqs.sirv.com/customized/image00022.jpeg',
  'https://old-souqs.sirv.com/customized/image00023.jpeg',
  'https://old-souqs.sirv.com/customized/image00024.jpeg',
  'https://old-souqs.sirv.com/customized/image00025.jpeg',
  'https://old-souqs.sirv.com/customized/image00026.jpeg',
  'https://old-souqs.sirv.com/customized/image00027.jpeg',
  ];

  selectedImage!: string | null;


  // to zoom the img
    @ViewChild('pinchImage') pinchImageRef!: ElementRef;
  
    scale = 1;
    lastScale = 1;
    startDistance = 0;
    startX = 0;
    startY = 0;
    translateX = 0;
    translateY = 0;
    lastTranslateX = 0;
    lastTranslateY = 0;
    isModalOpen = false;
    isHovering = false;
    isDragging = false;
  
    @ViewChild('zoomImage') zoomImageRef!: ElementRef;
    @ViewChild('zoomWrapper') zoomWrapperRef!: ElementRef;
  
    zoomStyles = {
      transform: 'scale(1) translate(0px, 0px)'
    };
  
  // for laptop
    onMouseEnter() {
      if (this.isTouchDevice()) return;
      this.isHovering = true;
    }
  
    onMouseLeave() {
      this.isHovering = false;
      this.resetZoom();
    }
  
    onMouseMove(event: MouseEvent) {
      if (!this.isHovering) return;
  
      const rect = this.zoomWrapperRef.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
  
      this.translateX = (0.5 - x) * rect.width * 0.5;
      this.translateY = (0.5 - y) * rect.height * 0.5;
      this.scale = 2;
  
      this.updateTransform();
    }
  
    updateTransform() {
      this.zoomStyles = {
        transform: `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`
      };
    }
  
    isTouchDevice(): boolean {
      return window.matchMedia('(pointer: coarse)').matches;
    }
  // for mobile and tablet
    onTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        this.startDistance = this.getDistance(event.touches[0], event.touches[1]);
      } else if (event.touches.length === 1 && this.scale > 1) {
        this.startX = event.touches[0].clientX - this.lastTranslateX;
        this.startY = event.touches[0].clientY - this.lastTranslateY;
        this.isDragging = true;
      }
    }
  
   onTouchMove(event: TouchEvent) {
  if (event.touches.length === 2) {
    // pinch zoom
    const newDistance = this.getDistance(event.touches[0], event.touches[1]);
    this.scale = Math.max(1, Math.min(this.lastScale * (newDistance / this.startDistance), 4));
    this.applyTransform();
  } else if (event.touches.length === 1 && this.scale > 1 && this.isDragging) {
    this.translateX = event.touches[0].clientX - this.startX;
    this.translateY = event.touches[0].clientY - this.startY;
    this.applyTransform();
  }

  // ✅ Prevent scroll from interfering
  event.preventDefault();
}

  
    onTouchEnd(event: TouchEvent) {
      this.lastScale = this.scale;
      this.lastTranslateX = this.translateX;
      this.lastTranslateY = this.translateY;
      this.isDragging = false;
    }
  
    getDistance(touch1: Touch, touch2: Touch): number {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    applyTransform() {
      const el = this.pinchImageRef.nativeElement;
      el.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
      el.style.transition = 'none';
    }
  
    resetZoom() {
      this.scale = 1;
      this.lastScale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.lastTranslateX = 0;
      this.lastTranslateY = 0;
      this.applyTransform();
      this.updateTransform();
    }
  
 
  closePreview(event?: Event) {
    if (event) event.stopPropagation();
    this.selectedImage = null;
    this.resetZoom();
  }
  openModal(imageUrl: string) {
  this.selectedImage = imageUrl;
  this.isModalOpen = true;
  this.resetZoom();
}
 closeModal() {
    this.isModalOpen = false;
    this.resetZoom();
  }
}
