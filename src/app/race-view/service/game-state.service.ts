import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, scan} from 'rxjs';
import {generate} from "random-words";

export const WORDS_AMOUNT = 20;

export const getGameStateService = () => {
  return inject(GameStateService);
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  randomWords$ = new BehaviorSubject<Array<string>>(generate(WORDS_AMOUNT));
  progress$ = new BehaviorSubject<number>(0);
  gameCompleted$ = new BehaviorSubject<boolean>(false);
  gameInProgress$ = new BehaviorSubject<boolean>(false);
  startTime!: number;
  wpm$ = new BehaviorSubject<string>('0');

  setRandomWords(randomWords: Array<string>): void {
    this.randomWords$.next(randomWords);
    this.progress$.next(0);
    this.wpm$.next('0');
    this.gameCompleted$.next(false);
  }

  setProgress(progress: number, wordIndex: number): void {
    if (progress >= 100) {
      this.gameCompleted$.next(true);
    }
    const totalTime = new Date().getTime() - this.startTime;
    const minutesPassed = totalTime / (1000 * 60);
    this.randomWords$.pipe(
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
