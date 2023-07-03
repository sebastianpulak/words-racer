import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, scan} from 'rxjs';
import {generate} from "random-words";

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  randomWords$ = new BehaviorSubject<Array<string>>(generate(10));
  progress$ = new BehaviorSubject<number>(0);
  gameCompleted$ = new BehaviorSubject<boolean>(false);
  startTime!: number;
  wpm$ = new BehaviorSubject<string>('0');

  setRandomWords(randomWords: Array<string>): void {
    this.randomWords$.next(randomWords);
    this.progress$.next(0);
    this.wpm$.next('0');
    this.gameCompleted$.next(false);
  }

  getRandomWords(): Observable<Array<string>> {
    return this.randomWords$.asObservable();
  }

  setProgress(progress: number, wordIndex: number): void {
    if (progress >= 100) {
      this.gameCompleted$.next(true);
    }
    const totalTime = new Date().getTime() - this.startTime;
    const minutesPassed = totalTime / (1000 * 60);
    this.getRandomWords().pipe(
      map((words: string[]) => words.slice(0, wordIndex).join('')),
      map((combinedString: string) => combinedString.length),
      scan((accumulator: number, length: number) => accumulator + length, 0)
    ).subscribe(totalCharacterCount => {
      const wpm = totalCharacterCount / 5 / minutesPassed;
      this.wpm$.next(wpm.toFixed(2));
    });
    if (progress > 100) {
      this.progress$.next(100);
      return;
    }
    this.progress$.next(progress);

  }
}
