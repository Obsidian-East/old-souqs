import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HlsVideoPlayerComponent } from './hls-video-player.component';

describe('HlsVideoPlayerComponent', () => {
  let component: HlsVideoPlayerComponent;
  let fixture: ComponentFixture<HlsVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HlsVideoPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HlsVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
