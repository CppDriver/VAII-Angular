import { Component } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from 'src/app/services/validation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupData = {
    email: '',
    username: '',
    password: '',
  };

  emailChanged = new Subject();
  emailMessage = '';
  emailError = false;

  usernameChanged = new Subject();
  usernameMessage = '';
  usernameError = false;

  passwordChanged = new Subject();
  passwordMessage = '';
  passwordError = false;

  constructor(private validationService: ValidationService, private authService: AuthService, private http: HttpClient) {
    this.emailChanged.pipe(debounceTime(700)).subscribe(() => {
      let temp = validationService.checkEmail(this.signupData.email);
      this.emailError = temp.emailError;
      this.emailMessage = temp.emailMessage;
    });

    this.usernameChanged.pipe(debounceTime(700)).subscribe(() => {
      let temp = validationService.checkUsername(this.signupData.username);
      this.usernameError = temp.usernameError;
      this.usernameMessage = temp.usernameMessage;
    });

    this.passwordChanged.pipe(debounceTime(700)).subscribe(() => {
      let temp = validationService.checkPassword(this.signupData.password);
      this.passwordError = temp.passwordError;
      this.passwordMessage = temp.passwordMessage;
    });
  }

  onSignupSubmit() {
    if (this.validationService.checkEmail(this.signupData.email, true) && this.validationService.checkUsername(this.signupData.username, true) && this.validationService.checkPassword(this.signupData.password)) {
      const signupData = new FormData();
      signupData.append('email', this.signupData.email);
      signupData.append('username', this.signupData.username);
      signupData.append('password', this.signupData.password);
      this.authService.register(signupData);
    }
    else {
    }
  }
}
