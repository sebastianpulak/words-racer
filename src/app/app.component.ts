import {Component, OnDestroy, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private swUpdate: SwUpdate) {
  }
  title = 'words-racer';
  updateInterval!: number;

  ngOnInit() {
    this.checkForUpdates();
  }

  public checkForUpdates(): void {
    this.checkForNewVersion();
    this.updateInterval = setInterval(() => this.checkForNewVersion(), 60 * 1000);
  }

  checkForNewVersion = async () => {
    try {
      // Check if Service Worker is supported by the Browser
      if (this.swUpdate.isEnabled) {
        // Check if new version is available
        const isNewVersion = await this.swUpdate.checkForUpdate();
        if (isNewVersion) {
          // Check if new version is activated
          const isNewVersionActivated = await this.swUpdate.activateUpdate();

          // Reload the application with new version if new version is activated
          if (isNewVersionActivated) window.location.reload();
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

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
