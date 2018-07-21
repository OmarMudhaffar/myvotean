import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyvoteComponent } from './myvote/myvote.component';

const routes: Routes = [

  {path:"",component:HomeComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"myvote",component:MyvoteComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routings = [HomeComponent,DashboardComponent,MyvoteComponent]