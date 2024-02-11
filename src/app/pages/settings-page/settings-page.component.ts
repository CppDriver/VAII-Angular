import { Component, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from 'src/app/models/transfer-models/UserData';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import * as lodash from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css', '../../../styles.css'],
})
export class SettingsPageComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedTabIndex = 0;
  user: UserData;
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';
  deletePassword = '';
  profileImgUrl: string;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private httpClient: HttpClient) {
    console.log('trying to deep clone: ',authService.user);
    this.user = lodash.cloneDeep(authService.user) ?? new UserData();
    this.profileImgUrl = 'http://localhost:5080/user/getUserProfileImg/' + this.user.id + '?' + new Date().getTime();
    console.log('cloned user: ',this.user);
  }
  
  async onChangePassword() {
    if(this.newPassword !== this.repeatPassword)
    {
      this.snackBar.open('Passwords do not match', 'Close', {duration: 2000});
      return;
    }
    try {
      if(await this.authService.changePassword(this.oldPassword, this.newPassword))
        this.snackBar.open('Password changed successfully', 'Close', {duration: 3000});
    }
    catch (error) {
      this.snackBar.open('Password change failed', 'Close', {duration: 3000});
    }
    finally {
      this.oldPassword = '';
      this.newPassword = '';
      this.repeatPassword = '';
    }
  }

  async onDeleteAccount() {
    try {
      if(await this.authService.deleteAccount(this.deletePassword))
      {
        this.snackBar.open('Account deleted successfully', 'Close', {duration: 3000});
        this.authService.logout();
      }
      else
      {
      }
    }
    catch (error) {
      this.snackBar.open('Account deletion failed', 'Close', {duration: 3000});
    }
    finally {
      this.deletePassword = '';
    }
  }

  async onUpdateUser() {
    try {
      if(await this.authService.updateUser(this.user))
        this.snackBar.open('User updated successfully', 'Close', {duration: 3000});
    }
    catch (error) {
      this.snackBar.open('User update failed', 'Close', {duration: 3000});
    }
  }

  closeSidenav() {
    this.sidenav.close();
  }

  async updateProfileImg(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      if (file.type !== 'image/jpeg') {
        this.fileInput.nativeElement.value = '';
      }
      const formData: FormData = new FormData();
      formData.append('file', file);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      
      try {
        var result = await firstValueFrom(this.httpClient.request('POST', 'http://localhost:5080/user/updateProfileImg', {
          body: formData,
          headers: headers,
        }));
        this.snackBar.open('Profile image updated successfully', 'Close', {duration: 3000});
        this.profileImgUrl = 'http://localhost:5080/user/getUserProfileImg/' + this.user.id + '?' + new Date().getTime();
      }
      catch (error) {
        this.snackBar.open('Profile image update failed', 'Close', {duration: 3000});
      }
    }
  }
}
