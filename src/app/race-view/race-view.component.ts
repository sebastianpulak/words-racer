import {Component, OnDestroy} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";
import {map, Subscription, takeLast, takeWhile, timer} from "rxjs";
import {AsyncPipe} from "@angular/common";
import { generate } from "random-words";
import {GameStateService} from "./service/game-state.service";
import {GameScoreComponent} from "./game-score/game-score.component";

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  imports: [
    MatInputModule,
    GameComponent,
    AsyncPipe,
    GameScoreComponent
  ],
  standalone: true
})
export class RaceViewComponent implements OnDestroy {
  constructor(private gameState: GameStateService) {
  }
  subscription = new Subscription();
  gameInProgress = false;
  countdownStarted = false;
  secondsRemaining$ = timer(1, 1000).pipe(
    map(n => 5 - n),
  takeWhile(n => n >= 1)
);

  startGame() {
    if (this.gameInProgress) {
      this.secondsRemaining$ = timer(0, 1000).pipe(
        map(n => 5 - n),
        takeWhile(n => n >= 1)
      );
      this.gameInProgress = false;
      this.gameState.setRandomWords(generate(20));
    }
    this.subscription.add(this.secondsRemaining$.pipe(takeLast(1)).subscribe(() => {
      this.gameInProgress = true;
      this.countdownStarted = false;
    }));
    this.countdownStarted = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
