import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {getGameStateService} from "../service/game-state.service";
import {Subscription} from "rxjs";

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

export class GameComponent implements OnInit, OnDestroy {
  gameState = getGameStateService();
  @ViewChild('currentWordInput', {static: false}) currentWordInput!: ElementRef<HTMLInputElement>;
  @Output() showTooltip = new EventEmitter<boolean>();
  @Input() gameInProgress!: boolean;
  @Input() set countdownStarted(started: boolean) {
    if (started) {
      this.currentWordInput.nativeElement.focus();
    }
  }
  _randomWords!: Array<string>;
  currentWordValue = '';
  wordIndex = 0;
  selectedWord!: string;
  subscription = new Subscription();

  ngOnInit() {
    this.subscription =
      this.gameState.randomWords$.subscribe((randomWords: Array<string>) => {
      this._randomWords = randomWords;
      this.wordIndex = 0;
      this.selectWord();
      this.resetState();
    });
  }

  private selectWord() {
    this.selectedWord = this._randomWords[this.wordIndex];
  }

  private resetState() {
    this.currentWordValue = '';
    if (this.currentWordInput) {
      this.currentWordInput.nativeElement.value = '';
    }
  }

  onWordValueChange(value: string) {
    if (!this.gameInProgress) {
      this.resetState();
      this.showTooltip.emit();
      return;
    }
    if (value === this.selectedWord) {
      this.wordIndex++;
      this.selectWord();
      this.resetState();
      this.gameState.setProgress(this.wordIndex / this._randomWords.length * 100, this.wordIndex);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
