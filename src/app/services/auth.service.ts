import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import { UserData } from '../models/transfer-models/UserData';
import * as lodash from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authStatusChanged = new Subject<boolean>();
  user: UserData | undefined = undefined;

  constructor(private router: Router, private httpClient: HttpClient, private snackBar: MatSnackBar) {
    this.fetchUser();
  }

  async fetchUser() {
    let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    let response = await firstValueFrom(this.httpClient.get('http://localhost:5080/user/getUserData?username='+this.getUserName(), { headers: headers }));
    this.user = response as UserData;
  }

  isAuthenticated(): boolean {
    let token = localStorage.getItem('token');
    if(token)
    {
      const decodedToken = jwt_decode.jwtDecode(token);
      if(decodedToken && typeof decodedToken !== 'string' && decodedToken.exp !== undefined)
      {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        if(expirationDate < new Date())
        {
          this.logout()
          return false;
        }
        else
        {
          this.authStatusChanged.next(true);
          return true;
        }
      }
    }
    this.authStatusChanged.next(false);
    return false;
  }

  getUserName(): string {
    let username = localStorage.getItem('username');
    if(username)
    {
      return username;
    }
    else
    {
      return '';
    }
  }

  async login(loginData: FormData) {
    var response = await firstValueFrom(this.httpClient.post('http://localhost:5080/Auth/Login', loginData));
      if (JSON.parse(JSON.stringify(response))?.username != null) {
        localStorage.setItem('token', JSON.parse(JSON.stringify(response)).token);
        localStorage.setItem('username', JSON.parse(JSON.stringify(response)).username);
        this.router.navigate(['/user']);
        this.authStatusChanged.next(true);
        this.fetchUser();
      }
  }
  
  async register(registerData: FormData) {
    var response = await firstValueFrom(this.httpClient.post('http://localhost:5080/Auth/Register', registerData));
    console.log(response);
    if(JSON.parse(JSON.stringify(response)).msg == 'registered')
    {
      this.router.navigate(['/auth/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authStatusChanged.next(false);
    this.user = undefined;
    this.router.navigate(['/auth/login']);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    let changePasswordData = new FormData();
    changePasswordData.append('username', this.getUserName());
    changePasswordData.append('oldPassword', oldPassword);
    changePasswordData.append('newPassword', newPassword);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    let response = await firstValueFrom(this.httpClient.post('http://localhost:5080/Auth/ChangePassword', changePasswordData, { headers: headers }));
    if(JSON.parse(JSON.stringify(response))?.msg == 'Password changed')
    {
      return true;
    }
    return false;
  }

  async deleteAccount(password: string): Promise<boolean> {
    let deleteAccountData = new FormData();
    deleteAccountData.append('username', this.getUserName());
    deleteAccountData.append('password', password);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    let response = await firstValueFrom(this.httpClient.post('http://localhost:5080/Auth/DeleteAccount', deleteAccountData, { headers: headers }));
    console.log(response);
    if(JSON.parse(JSON.stringify(response)).msg == 'Account deleted')
    {
      return true;
    }
    return false;
  }

  async updateUser(user: UserData): Promise<boolean> {
    console.log('sending a user: ',user);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    let response = await firstValueFrom(this.httpClient.put('http://localhost:5080/user/updateUserData', {
      Id: user.id,
      Username: user.username,
      Name: user.name,
      Surname: user.surname,
      Email: user.email,
      Location: user.location,
      Bio: user.bio
    }, { headers: headers }));
    if(response == true)
    {
      console.log('deep cloning', user);
      this.user = lodash.cloneDeep(user);
      console.log('cloned user: ',this.user);
      return true;
    }
    return false;
  }
}
