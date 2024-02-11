import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { MediaPageComponent } from './pages/media-page/media-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { authenticationGuard } from './guards/authentication.guard';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: LoginPageComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent },
      ]
  },
  { path: 'user/:url', component: UserPageComponent },
  { path: 'media/:url', component: MediaPageComponent },
  { path: 'gallery/:url', component: GalleryPageComponent },
  { path: 'upload', component: UploadPageComponent, canActivate: [authenticationGuard]},
  { path: 'settings', component: SettingsPageComponent, canActivate: [authenticationGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
