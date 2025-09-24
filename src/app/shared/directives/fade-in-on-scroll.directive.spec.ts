import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FadeInOnScrollDirective } from './fade-in-on-scroll.directive';

// 1. Create a simple test component to "host" the directive
@Component({
  template: `<div appFadeInOnScroll>I am fading in!</div>`,
  standalone: true,
  imports: [FadeInOnScrollDirective], // Import the standalone directive
})
class TestHostComponent {}

describe('FadeInOnScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let elementWithDirective: DebugElement;

  beforeEach(async () => {
    // 2. Configure the testing module
    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // Import the host component
    }).compileComponents();

    // 3. Create the component, which in turn creates the directive
    fixture = TestBed.createComponent(TestHostComponent);
    elementWithDirective = fixture.debugElement.query(By.directive(FadeInOnScrollDirective));
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create an instance of the directive', () => {
    // 4. Check if the directive was successfully applied to the element
    expect(elementWithDirective).not.toBeNull();
  });
});