import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";


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
  @ViewChild('currentWordInput', {static: false}) currentWordInput!: ElementRef<HTMLInputElement>;
  @Input() gameInProgress!: boolean;
  @Input() set randomWords(randomWords: Array<string>) {
    console.log(randomWords);
    this._randomWords = randomWords;
    this.wordIndex = 0;
  }
  _randomWords!: Array<string>;
  currentWordValue = '';
  wordIndex = 0;
  selectedWord!: string;

  ngOnInit() {
    this.selectedWord = this._randomWords[this.wordIndex];
  }

  onWordValueChange(value: string) {
    if (!this.gameInProgress) {
      this.currentWordValue = '';
      this.currentWordInput.nativeElement.value = '';
      return;
    }
    if (value === this.selectedWord) {
      this.wordIndex++;
      this.selectedWord = this._randomWords[this.wordIndex];
      this.currentWordValue = '';
      this.currentWordInput.nativeElement.value = '';
    }
  }
}
