import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly TOKEN_KEY = 'auth-token';
  private readonly SECRET_KEY = 'financiera-oh'; // Podrías hacerlo más seguro

  constructor() {}

  private encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this.SECRET_KEY).toString();
  }

  private decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private getUsers(): any[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  register(email: string, password: string): boolean {
    const users = this.getUsers();
    const exists = users.some((u) => u.email === email);

    if (exists) return false;

    const encryptedPassword = this.encrypt(password);
    users.push({ email, password: encryptedPassword });
    this.saveUsers(users);
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();

    const user = users.find((u) => u.email === email);
    if (!user) return false;

    const decryptedPassword = this.decrypt(user.password);
    if (decryptedPassword !== password) return false;

    // Genera token simulado con duración de 5 minutos
    const expires = new Date(Date.now() + 5 * 60 * 1000).toUTCString();
    document.cookie = `${this.TOKEN_KEY}=some_token; expires=${expires}; path=/`;
    return true;
  }

  logout(): void {
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  isAuthenticated(): boolean {
    return document.cookie.includes(this.TOKEN_KEY);
  }
}
