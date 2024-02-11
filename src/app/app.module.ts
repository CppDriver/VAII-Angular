import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { MediaPageComponent } from './pages/media-page/media-page.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';
import { CommentsComponent } from './components/comments/comments.component';
import { AddGalleryDialogComponent } from './components/add-gallery-dialog/add-gallery-dialog.component';
import { UploadStatusPipe } from './pipes/upload-status/upload-status.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavigationBarComponent,
    LoginPageComponent,
    LoginComponent,
    SignupComponent,
    PhotoGridComponent,
    MediaPageComponent,
    GalleryListComponent,
    SettingsPageComponent,
    UploadPageComponent,
    UserPageComponent,
    GalleryPageComponent,
    CommentsComponent,
    AddGalleryDialogComponent,
    UploadStatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
