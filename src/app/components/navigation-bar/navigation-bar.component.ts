import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  get username(): string { return this.authService.getUserName(); };
  get loggedIn(): boolean { return this.authService.isAuthenticated(); };
  get darkTheme(): boolean { return this.themeService.darkMode; };

  constructor(private authService: AuthService, private themeService: ThemeService) {
  }

  ngOnInit() {
    
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  onLogout() {
    this.authService.logout();
  }
}
