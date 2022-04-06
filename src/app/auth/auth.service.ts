import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, Observable } from 'rxjs';
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
    return new Promise(
      (resolve, reject) => {
        this.httpClient.post(environment.backendUrl + '/auth/login', { username, password }, { responseType: 'text' }).pipe(
          catchError(
            (error) => {
              this.setToken('');
              this._isLoggedIn.next(false);
              reject(error);
              return '';
            }
          )
        ).subscribe(
          (token: string) => {
            const expired = this.jwtService.isTokenExpired(token);
            if (expired) {
              reject('Token expired');
            } else {
              this.setToken(token);
              this._isLoggedIn.next(true);
              this.refreshTokenEvent.emit();
              resolve(true);
            }
          }
        );
      }
    )
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    return token || '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  async refreshToken(token: string): Promise<string> {
    const response = this.httpClient.post<string>(environment.backendUrl + '/auth/refresh', { token })
    const result = await lastValueFrom(response);
    this.setToken(result);
    return result;
  }

  logout(): void {
    this.setToken('');
    this._isLoggedIn.next(false);
  }

  async signUp(signUp: SignUpData) {
    if (signUp.data1 && signUp.data2 && signUp.data3) {
      const backendData = {
        username: signUp.data1.username,
        password: signUp.data1.password,
        settings: {
          isDarkMode: signUp.data3.darkmode,
        },
        interests: {
          economic: signUp.data2.economic,
          diplomatic: signUp.data2.diplomatic,
          civil: signUp.data2.civil,
          society: signUp.data2.society,
        }
      }

      return new Promise(
        (resolve, reject) => {
          this.httpClient.post(environment.backendUrl + '/auth/register', backendData, { responseType: 'text' }).pipe(
            catchError(
              (error) => {
                this.setToken('');
                this._isLoggedIn.next(false);
                const errorParsed = JSON.parse(error.error);
                reject(errorParsed.message);
                return '';
              }
            )
          ).subscribe(
            (token: string) => {
              const expired = this.jwtService.isTokenExpired(token);
              if (expired) {
                reject('Token expired');
              } else {
                this.setToken(token);
                this._isLoggedIn.next(true);
                this.refreshTokenEvent.emit();
                resolve(true);
              }
            }
          );
        }
      )
    } else {
      return Promise.reject('Data not complete');
    }
  }
}
