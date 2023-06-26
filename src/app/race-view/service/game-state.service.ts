import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {generate} from "random-words";

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  randomWords$ = new BehaviorSubject<Array<string>>(generate(20));
  progress$ = new BehaviorSubject<number>(0);

  setRandomWords(randomWords: Array<string>): void {
    this.randomWords$.next(randomWords);
  }

  getRandomWords(): Observable<Array<string>> {
    return this.randomWords$.asObservable();
  }

  setProgress(progress: number): void {
    this.progress$.next(progress);
  }

  getProgress(): Observable<number> {
    return this.progress$.asObservable();
  }
}
