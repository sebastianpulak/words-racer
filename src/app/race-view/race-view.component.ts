import { Component } from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";
import {map, takeLast, takeWhile, timer} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  imports: [
    MatInputModule,
    GameComponent,
    AsyncPipe
  ],
  standalone: true
})
export class RaceViewComponent {
  gameInProgress = false;
  countdownStarted = false;
  secondsRemaining$ = timer(0, 1000).pipe(
    map(n => 5 - n),
  takeWhile(n => n >= 1)
);

  startGame() {
    this.countdownStarted = true;
    this.secondsRemaining$.pipe(takeLast(1)).subscribe(() => {
      this.gameInProgress = true;
      this.countdownStarted = false;
    })
  }

}
