import {Component} from '@angular/core';
import {getGameStateService} from "../service/game-state.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.scss'],
  imports: [
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class GameScoreComponent {
  gameState = getGameStateService();
}
