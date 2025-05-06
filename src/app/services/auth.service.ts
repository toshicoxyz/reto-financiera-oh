import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth-token';

  constructor() { }

  login(email: string, password: string): boolean {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
      // Guardamos un token en cookies con duración de 5 min
      const expires = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
      document.cookie = `${this.tokenKey}=some_token; expires=${expires}; path=/`;
      return true;
    }

    return false;
  }

  register(email: string, password: string): boolean {
    if (localStorage.getItem('email') === email) return false;

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    return true;
  }

  logout() {
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  isAuthenticated(): boolean {
    return document.cookie.includes(this.tokenKey);
  }
}
