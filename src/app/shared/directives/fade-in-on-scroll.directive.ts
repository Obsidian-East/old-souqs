import { Directive, ElementRef, HostBinding,Input, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFadeInOnScroll]'
})
export class FadeInOnScrollDirective implements OnInit {
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '-10px 0px -20px 0px';

  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('visible');
            this.observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    );

    this.observer.observe(this.el.nativeElement);
  }
}