import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isLoggedIn = new BehaviorSubject(false);
  constructor() { }


  /**
   * returns true if user is logged in
   */
  isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }

  /**
   * tries to log the user in and returns true if successful
   */
  async login(username: string, password: string): Promise<boolean> {
    // TODO
    return false;
  }

  getToken(): string {
    return '';
  }

  setToken(token: string): void {
    // TODO
  }
}
