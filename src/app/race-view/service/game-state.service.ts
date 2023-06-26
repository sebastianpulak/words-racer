import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, scan, Subject} from 'rxjs';
import {generate} from "random-words";

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  randomWords$ = new BehaviorSubject<Array<string>>(generate(10));
  progress$ = new BehaviorSubject<number>(0);
  startTime!: number;
  wpm$ = new Subject<string | null>();

  setRandomWords(randomWords: Array<string>): void {
    this.randomWords$.next(randomWords);
    this.wpm$.next(null);
  }

  getRandomWords(): Observable<Array<string>> {
    return this.randomWords$.asObservable();
  }

  setProgress(progress: number): void {
    if (progress === 100) {
      const totalTime = new Date().getTime() - this.startTime;
      const minutesPassed = totalTime / (1000 * 60);
      this.getRandomWords().pipe(
        map((words: string[]) => words.join('')),
        map((combinedString: string) => combinedString.length),
        scan((accumulator: number, length: number) => accumulator + length, 0)
      ).subscribe(totalCharacterCount => {
        const wpm = totalCharacterCount / 5 / minutesPassed;
        this.wpm$.next(wpm.toFixed(2));
      });
    }
    this.progress$.next(progress);
  }
}
