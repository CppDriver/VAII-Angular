import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from 'src/app/services/validation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };
  
  constructor(private validationService: ValidationService, private authService: AuthService, private http: HttpClient) {}

  onLoginSubmit() {
    if (this.validationService.checkUsername(this.loginData.username, true) && this.validationService.checkPassword(this.loginData.password)) {
      const loginData = new FormData();
      loginData.append('username', this.loginData.username);
      loginData.append('password', this.loginData.password);
      this.authService.login(loginData);
    }
  }
}
