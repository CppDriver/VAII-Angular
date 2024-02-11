import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient) { }

  checkEmail(email: string, syntaxOnly = false) {
    let recipient = email.substr(0, email.lastIndexOf('@'));
    let domain = email.substr(email.lastIndexOf('@') + 1, email.lastIndexOf('.') - email.lastIndexOf('@') - 1);
    let tld = email.substr(email.lastIndexOf('.') + 1);
    let recipientRegex = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+$/;
    let domainRegex = /^[a-zA-Z0-9.-]+$/;
    let tldRegex = /^[a-zA-Z]+$/;
    if(recipientRegex.test(recipient) && domainRegex.test(domain) && tldRegex.test(tld) && recipient.length <= 64 && domain.length <= 255 && tld.length <= 63)
    {
      if (!syntaxOnly)
      {
        this.http.post('http://localhost:5080/CheckEmail', {email: email}).subscribe(response => {
          if(response)  
          {
            return { emailError: true, emailMessage : 'Email already in use' };
          }
          else
          {
            return { emailError: false, emailMessage : '' };
          }
        });
      }
      return { emailError: false, emailMessage : '' };
    }
    else
    {
      return { emailError: true, emailMessage : 'Invalid email address' };
    }
  }

  checkUsername(username: string, syntaxOnly = false) {
    let usernameRegex = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+$/;
    if(usernameRegex.test(username) && username.length <= 64)
    {
      if (!syntaxOnly)
      {
        this.http.post('http://localhost:5080/CheckUsername', {username: username}).subscribe(response => {
          if(response)
          {
            return { usernameError: true, usernameMessage : 'Username already in use' };
          }
          else
          {
            return { usernameError: false, usernameMessage : 'Username available' };
          }
        });
      }
      return { usernameError: false, usernameMessage : '' };
    }
    else
    {
      return { usernameError: true, usernameMessage : 'Invalid username' };
    }
  }

  checkPassword(password: string) {
    let passwordRegex = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+$/;
    if(passwordRegex.test(password) && password.length >= 8 && password.length <= 64)
    {
      return { passwordError: false, passwordMessage : '' };
    }
    else
    {
      if(password.length < 8)
      {
        return { passwordError: true, passwordMessage : 'Password must be at least 8 characters' };
      }
      else if(password.length > 64)
      {
        return { passwordError: true, passwordMessage : 'Password is too long' };
      }
      else
      {
        return { passwordError: true, passwordMessage : 'Invalid password' };
      }
    }
  }
}
