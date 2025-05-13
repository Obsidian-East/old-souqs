// event-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private openCartSubject = new Subject<void>();
  openCart$ = this.openCartSubject.asObservable();

  triggerOpenCart() {
    this.openCartSubject.next();
  }
}
