import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule,routings } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MyvoteComponent } from './myvote/myvote.component';
import { ReversePipe } from './reverse.pipe';


const firebaseConfig = {
  apiKey: "AIzaSyAgKi1Nqo463Uuiw-DX0dxJk-SycrSEqcE",
  authDomain: "vote-b1894.firebaseapp.com",
  databaseURL: "https://vote-b1894.firebaseio.com",
  projectId: "vote-b1894",
  storageBucket: "vote-b1894.appspot.com",
  messagingSenderId: "575290196634"
};


@NgModule({
  declarations: [
    AppComponent,
    routings,
    MyvoteComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
