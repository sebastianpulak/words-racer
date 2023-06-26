import { Component } from '@angular/core';
import {GameStateService} from "../service/game-state.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.scss'],
  imports: [
    AsyncPipe
  ],
  standalone: true
})
export class GameScoreComponent {
  constructor(public gameState: GameStateService) {
  }
}
