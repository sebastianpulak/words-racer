import { NgModule } from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'race',
    loadComponent: () => import('./race-view/race-view.component').then(m => m.RaceViewComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.component').then(m => m.RankingComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: NoPreloading,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
