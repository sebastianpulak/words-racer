import {ChangeDetectionStrategy, Component, DestroyRef, inject, ViewEncapsulation} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";
import {map, take, takeLast, takeWhile, timer} from "rxjs";
import {AsyncPipe, CommonModule} from "@angular/common";
import {generate} from "random-words";
import {getGameStateService, WORDS_AMOUNT, WORDS_AMOUNT_ARRAY} from "./service/game-state.service";
import {GameScoreComponent} from "./game-score/game-score.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";

const COUNTDOWN_TIME = 3;

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatInputModule,
    GameComponent,
    AsyncPipe,
    GameScoreComponent,
    MatTooltipModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule
  ],
  standalone: true
})
export class RaceViewComponent {
  gameState = getGameStateService();
  wordsAmountArray = [...WORDS_AMOUNT_ARRAY];
  countdownStarted = false;
  showTooltip = false;
  firstRace = true;
  destroyRef = inject(DestroyRef);
  secondsRemaining$ = timer(1, 1000).pipe(
    map(n => COUNTDOWN_TIME - n),
    takeWhile(n => n >= 1)
);


  startGame() {
    this.showTooltip = false;
    if (!this.firstRace) {
      this.gameState.wordsAmount$.pipe(
        take(1)
      ).subscribe((wordsAmount: number) => {
        this.gameState.setRandomWords(generate(wordsAmount));
      })
    }
    this.firstRace = false;
    this.gameState.gameInProgress$.next(false);
    this.gameState.gameInProgress$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((inProgress: boolean) => {
      if (inProgress) {
        this.secondsRemaining$ = timer(0, 1000).pipe(
          map(n => COUNTDOWN_TIME - n),
          takeWhile(n => n >= 1)
        );
      }
    });
    this.secondsRemaining$.pipe(
      takeLast(1),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.showTooltip = false;
      this.gameState.gameInProgress$.next(true);
      this.countdownStarted = false;
      this.gameState.startTime = new Date().getTime();
    });

    this.countdownStarted = true;
  }

  triggerTooltip() {
    if (!this.countdownStarted) {
      this.showTooltip = true;
    }
  }

  changeWordsAmount(amount: MatSelectChange) {
    const wordsAmount = amount.value;
    this.gameState.wordsAmount$.next(wordsAmount);
    this.gameState.setRandomWords(generate(wordsAmount));
    this.gameState.gameInProgress$.next(false);
    this.secondsRemaining$ = timer(1, 1000).pipe(
      map(n => COUNTDOWN_TIME - n),
      takeWhile(n => n >= 1)
    );
    this.firstRace = true;
  }

}
