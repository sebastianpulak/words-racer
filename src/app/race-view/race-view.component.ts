import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";
import {map, Subscription, takeLast, takeWhile, timer} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import { generate } from "random-words";
import {GameStateService} from "./service/game-state.service";
import {GameScoreComponent} from "./game-score/game-score.component";
import {MatTooltipModule} from "@angular/material/tooltip";

const COUNTDOWN_TIME = 3;

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  imports: [
    MatInputModule,
    GameComponent,
    AsyncPipe,
    GameScoreComponent,
    MatTooltipModule,
    NgIf
  ],
  standalone: true
})
export class RaceViewComponent implements OnInit, OnDestroy {
  constructor(public gameState: GameStateService) {
  }
  subscription = new Subscription();
  gameInProgress = false;
  countdownStarted = false;
  showTooltip = false;
  gameCompleted = false;
  secondsRemaining$ = timer(1, 1000).pipe(
    map(n => COUNTDOWN_TIME - n),
  takeWhile(n => n >= 1)
);

  ngOnInit() {
    this.subscription.add(this.gameState.gameCompleted$.subscribe(isGameCompleted => {
        this.gameCompleted = isGameCompleted;
    }));
  }

  startGame() {
    this.showTooltip = false;
    if (this.gameInProgress) {
      this.secondsRemaining$ = timer(0, 1000).pipe(
        map(n => COUNTDOWN_TIME - n),
        takeWhile(n => n >= 1)
      );
      this.gameInProgress = false;
      this.gameState.setRandomWords(generate(10));
    }
    this.subscription.add(this.secondsRemaining$.pipe(takeLast(1)).subscribe(() => {
      this.showTooltip = false;
      this.gameInProgress = true;
      this.countdownStarted = false;
      this.gameState.startTime = new Date().getTime();
    }));
    this.countdownStarted = true;
  }

  triggerTooltip() {
    if (!this.countdownStarted) {
      this.showTooltip = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
