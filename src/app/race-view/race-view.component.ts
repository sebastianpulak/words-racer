import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";
import {map, takeLast, takeWhile, timer} from "rxjs";
import {AsyncPipe, CommonModule} from "@angular/common";
import { generate } from "random-words";
import {getGameStateService, WORDS_AMOUNT} from "./service/game-state.service";
import {GameScoreComponent} from "./game-score/game-score.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

const COUNTDOWN_TIME = 3;

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatInputModule,
    GameComponent,
    AsyncPipe,
    GameScoreComponent,
    MatTooltipModule,
  ],
  standalone: true
})
export class RaceViewComponent {
  gameState = getGameStateService();
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
      this.gameState.setRandomWords(generate(WORDS_AMOUNT));
    }
    this.firstRace = false;
    this.gameState.gameInProgress$.next(false);
    this.gameState.gameInProgress$.subscribe((inProgress: boolean) => {
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

}
