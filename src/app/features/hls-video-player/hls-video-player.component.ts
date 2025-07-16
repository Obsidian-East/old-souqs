import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import this
import Hls from 'hls.js';

@Component({
  selector: 'app-hls-video-player',
  template: `
    <video #videoPlayer controls playsinline preload="auto"></video>
  `,
  styleUrls: ['./hls-video-player.component.css']
})
export class HlsVideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  // *** CHANGE static: true to static: false ***
  @ViewChild('videoPlayer', { static: false }) videoElementRef!: ElementRef<HTMLVideoElement>;

  @Input() hlsUrl: string = '';

  private hlsInstance: Hls | null = null;
  private videoInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {} // Inject PLATFORM_ID

  ngOnInit(): void {
    if (!this.hlsUrl) {
      console.error('HLS URL is not provided.');
      return;
    }
  }

  ngAfterViewInit(): void {
    // Crucial check for SSR
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not in browser environment, skipping video initialization.');
      return;
    }

    // Now, confidently access nativeElement as we are in the browser
    if (this.videoElementRef && this.videoElementRef.nativeElement) {
      const video = this.videoElementRef.nativeElement;

      if (this.videoInitialized) {
        return; // Prevent double initialization
      }

      console.log('Video element available:', video); // Add this for debugging

      if (Hls.isSupported()) {
        this.hlsInstance = new Hls();
        this.hlsInstance.loadSource(this.hlsUrl);
        this.hlsInstance.attachMedia(video);
        this.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS Manifest parsed. Video ready to play.');
          video.play().catch(e => console.error("Error playing video:", e));
        });
        this.hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS.js error:', event, data);
          if (data.fatal) {
            // ... (HLS error recovery logic remains the same)
          }
        });
        this.videoInitialized = true;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.hlsUrl;
        video.addEventListener('loadedmetadata', () => {
          console.log('Native HLS loaded. Video ready to play.');
          video.play().catch(e => console.error("Error playing native video:", e));
        });
        this.videoInitialized = true;
      } else {
        console.error('Your browser does not support HLS playback via hls.js or natively.');
      }
    } else {
      console.error('videoElementRef or its nativeElement is still not available after view init. Check template rendering conditions.');
    }
  }

  ngOnDestroy(): void {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
    // Cleanup native event listener if added
    const video = this.videoElementRef?.nativeElement;
    if (video) {
        // If you used a named function for the event listener, remove it here
        // video.removeEventListener('loadedmetadata', this.myLoadedMetadataHandler);
    }
  }
}