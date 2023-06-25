import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { generate } from "random-words";

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

export class GameComponent {
  @ViewChild('currentWordInput', {static: false}) currentWordInput!: ElementRef<HTMLInputElement>;
  @Input() gameInProgress!: boolean;
  currentWordValue = '';
  randomWords: Array<string> = generate(20);
  wordIndex = 0;
  selectedWord = this.randomWords[this.wordIndex];

  onWordValueChange(value: string) {
    if (!this.gameInProgress) {
      this.currentWordValue = '';
      this.currentWordInput.nativeElement.value = '';
      return;
    }
    if (value === this.selectedWord) {
      this.wordIndex++;
      this.selectedWord = this.randomWords[this.wordIndex];
      this.currentWordValue = '';
      this.currentWordInput.nativeElement.value = '';
    }
  }
}
