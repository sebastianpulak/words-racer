import { Component } from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {GameComponent} from "./game/game.component";

@Component({
  selector: 'app-race-view',
  templateUrl: './race-view.component.html',
  styleUrls: ['./race-view.component.scss'],
  imports: [
    MatInputModule,
    GameComponent
  ],
  standalone: true
})
export class RaceViewComponent {
  currentWordValue = '';

}
