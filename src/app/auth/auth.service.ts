import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { SignUpData } from './signup/signup.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isLoggedIn = new BehaviorSubject(false);
  private refreshTokenEvent = new EventEmitter<void>();
  constructor(private httpClient: HttpClient, private jwtService: JwtHelperService) {
    const token = this.getToken();
    const expired = this.jwtService.isTokenExpired(token);
    if (!expired) {
      this._isLoggedIn.next(true);
    } else {
      this.setToken('');
      this._isLoggedIn.next(false);
    }

    // automatic refresh
    this.refreshTokenEvent.subscribe(() => {
      this.refreshToken(this.getToken()).then(token => {
        if (!jwtService.isTokenExpired(token)) {
          this.setToken(token);
          this._isLoggedIn.next(true);
          const expirationDate = this.jwtService.getTokenExpirationDate(token);
          if (expirationDate) {
            const timeToExpire = expirationDate.getTime() - Date.now();
            setTimeout(() => {
              this.refreshTokenEvent.emit();
            }, timeToExpire);
            return;
          }
        }
        this.setToken('');
        this._isLoggedIn.next(false);
      }
      );
    });
  }


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
    const response = this.httpClient.post(environment.backendUrl + '/auth/login', { username, password }, { responseType: 'text' });
    const result = await lastValueFrom(response);
    const expired = this.jwtService.isTokenExpired(result);
    if (expired) {
      return false;
    } else {
      this.setToken(result);
      this._isLoggedIn.next(true);
      return true;
    }
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    return token || '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  async refreshToken(token: string): Promise<string> {
    const response = this.httpClient.post<string>('/api/refresh', { token })
    const result = await lastValueFrom(response);
    this.setToken(result);
    return result;
  }

  logout(): void {
    this.setToken('');
    this._isLoggedIn.next(false);
  }

  async signUp(signUp: SignUpData) {
    // TODO
  }
}
