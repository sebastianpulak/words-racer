import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  swUpdate = inject(SwUpdate);
  title = 'words-racer';
  updateInterval$ = interval(30 * 1000).pipe(takeUntilDestroyed());

  ngOnInit() {
    this.checkForUpdates();
  }

  public checkForUpdates(): void {
    this.checkForNewVersion();
    this.updateInterval$.subscribe(() => {
      this.checkForNewVersion();
    })
  }

  checkForNewVersion = async () => {
    try {
      if (this.swUpdate.isEnabled) {
        const isNewVersion = await this.swUpdate.checkForUpdate();
        if (isNewVersion) {
          const isNewVersionActivated = await this.swUpdate.activateUpdate();
          if (isNewVersionActivated) {
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.log(
        `Service Worker - Error when checking for new version of the application: `,
        error
      );
      window.location.reload();
    }
  };

}
