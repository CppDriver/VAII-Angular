import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode: boolean;
  
  constructor() {
    this.darkMode = localStorage.getItem('darkMode') === 'enabled' ? true : false ?? false;
  }

  toggleTheme() {
    if (this.darkMode) {
        document.documentElement.style.setProperty('--background-color', '#181A1B');
        document.documentElement.style.setProperty('--text-color', '#d0d0d0');
    }
    else {
        document.documentElement.style.setProperty('--background-color', '#d0d0d0');
        document.documentElement.style.setProperty('--text-color', '#000000');
    }
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode ? 'enabled' : 'disabled');
  }

  onDarkModeChange() {
    this.darkMode = !this.darkMode;
  }
}