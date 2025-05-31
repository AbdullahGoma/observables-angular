import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000); // Observables have no initial value
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });
  interval = signal(0);
  doubleInterval = computed(() => this.interval() * 2);
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error();
      if (timesExecuted >= 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting New Value...');   
      subscriber.next({ message: 'New Value', value: 1 });
      timesExecuted++;
    }, 2000);
  });

  constructor() {
    // effect(() => {
    //   console.log(`Clicked Button ${this.clickCount()} times`);
    // });
  }

  ngOnInit() {
    // Siganl(Values in a container): Greate for manage app state
    setInterval(() => {
      // update some signal
      this.interval.update((prevVal) => prevVal + 1);
    }, 1000);

    // Observable(values over time) is pipeline of values that emited over time
    // Observable must subscribe
    // Great for manage events and streamed data
    // const subsctiption = interval(1000).pipe(
    //   map((val) => val * 2)
    // ).subscribe({
    //   next: (val) => console.log(val)
    // });

    // this.destroyRef.onDestroy(() => subsctiption.unsubscribe());

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('Completed!'),
      error: (error) => console.log(error)      
    });

    const subsctiption = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked Button ${this.clickCount()} times`),
    });

    this.destroyRef.onDestroy(() => subsctiption.unsubscribe());
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
