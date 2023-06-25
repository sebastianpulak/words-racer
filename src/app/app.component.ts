import {Component, OnInit} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private swUpdate: SwUpdate) {
  }
  title = 'words-racer';

  ngOnInit() {
    this.checkForUpdates();
  }

  public checkForUpdates(): void {
    this.swUpdate.versionUpdates.
    pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        window.location.reload();
    });
  }
}
