import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatSnackBarModule, MatCardModule, MatIconModule } from '@angular/material';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { NotesService } from './services/notes.service';
import { MessagingService } from './services/messaging.service';


/**
 * https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md
 */
const firebaseConfig: any = {
  apiKey: "AIzaSyATeY7LCw6m1ggeq1FRtE-31-NYcOoRIAw",
  authDomain: "platzinotas-bf10a.firebaseapp.com",
  databaseURL: "https://platzinotas-bf10a.firebaseio.com",
  projectId: "platzinotas-bf10a",
  storageBucket: "platzinotas-bf10a.appspot.com",
  messagingSenderId: "635273605558"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule,
    AngularFireModule.initializeApp( firebaseConfig ), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    FormsModule,
    MatIconModule
  ],
  providers: [
    NotesService,
    MessagingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }