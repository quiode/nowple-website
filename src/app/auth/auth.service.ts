import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { SignUpData } from './signup/signup.service';
import { Router } from '@angular/router';
import { ModalService } from '../shared/modal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isLoggedIn = new BehaviorSubject(false);
  private refreshTokenEvent = new EventEmitter<void>();
  constructor(private httpClient: HttpClient, private jwtService: JwtHelperService, private router: Router, private modalService: ModalService) {
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
            const timeToExpire = expirationDate.getTime() - Date.now() - 5000;
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

    // automatic logout
    this._isLoggedIn.subscribe(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['']);
      }
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
    return new Promise(
      (resolve, reject) => {
        const response = this.httpClient.post(environment.backendUrl + '/auth/refresh', {}, { responseType: 'text' }).pipe(
          catchError(err => {
            reject(err);
            return '';
          })
        ).subscribe(
          (newToken: string) => {
            resolve(newToken);
          }
        );
      }
    )
  }

  logout(): void {
    this.setToken('');
    this._isLoggedIn.next(false);
  }

  async signUp(signUp: SignUpData, profilePicture: File) {
    if (signUp.data1 && signUp.data2 && signUp.data3 && profilePicture) {
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
            async (token: string) => {
              const expired = this.jwtService.isTokenExpired(token);
              if (expired) {
                reject('Token expired');
              } else {
                this.setToken(token);
                this._isLoggedIn.next(true);
                this.refreshTokenEvent.emit();
                // this.setProfilePicture(profilePicture).pipe(catchError(err => {
                //   this.modalService.show({
                //     title: 'Error',
                //     message: "Couldn't upload profile picture",
                //     type: 'alert',
                //     confirmText: 'Ok'
                //   });
                //   return '';
                // }));
                const value = await firstValueFrom(this.setProfilePicture(profilePicture))
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

  getUserId(): string {
    const token = this.getToken();
    if (token) {
      const tokenData = this.jwtService.decodeToken(token);
      return tokenData.sub;
    }
    return '';
  }

  setProfilePicture(profilePicture: File) {
    const data = new FormData();
    data.append('profilePicture', profilePicture);
    const response = this.httpClient.post(environment.backendUrl + '/user/profilePicture', data, { responseType: 'text' });
    return response;
  }
}
