import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GameStateService} from "../service/game-state.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,

  imports: [
    MatInputModule,
    FormsModule,
    CommonModule
  ]
})

export class GameComponent implements OnInit {
  constructor(public gameState: GameStateService) {
  }
  @ViewChild('currentWordInput', {static: false}) currentWordInput!: ElementRef<HTMLInputElement>;
  @Input() gameInProgress!: boolean;
  _randomWords!: Array<string>;
  currentWordValue = '';
  wordIndex = 0;
  selectedWord!: string;

  ngOnInit() {
    this.gameState.getRandomWords().subscribe((randomWords: Array<string>) => {
      this._randomWords = randomWords;
      this.wordIndex = 0;
      this.selectWord();
      this.resetState();
    })
  }

  private selectWord() {
    this.selectedWord = this._randomWords[this.wordIndex];
  }

  private resetState() {
    this.currentWordValue = '';
    this.currentWordInput.nativeElement.value = '';
  }

  onWordValueChange(value: string) {
    if (!this.gameInProgress) {
      this.resetState();
      return;
    }
    if (value === this.selectedWord) {
      this.wordIndex++;
      this.selectWord();
      this.resetState();
      this.gameState.setProgress(this.wordIndex / this._randomWords.length * 100);
    }
  }
}
