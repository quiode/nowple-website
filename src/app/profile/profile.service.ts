import { Injectable } from '@angular/core';
import { User } from '../shared/classes/User';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { Ideology } from '../shared/constants/ideologies';
import { ModalService } from '../shared/modal.service';
import { Hobbies } from '../shared/constants/hobbies';

export interface Interests {
  economic?: number;

  diplomatic?: number;

  civil?: number;

  society?: number;

  ideology?: Ideology;

  hobbies?: Hobbies[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private modalService: ModalService
  ) { }

  async getProfile(id: string): Promise<User> {
    let url = environment.backendUrl + '/user/';
    if (id != this.authService.getUserId()) {
      url += 'public/' + id;
    }
    return new Promise<User>((resolve, reject) => {
      this.httpClient.get<User>(url).subscribe({
        next: (data: User) => {
          resolve(data);
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    });
  }

  async getProfilePicture(id: string): Promise<SafeUrl> {
    let url: string = environment.backendUrl + '/user/profilePicture';
    if (id != this.authService.getUserId()) {
      url += '/' + id;
    }
    const response = await new Promise<string>((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob' }).subscribe({
        next: (data: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = (error) => {
            reject('Error while reading profile picture');
          };
          reader.readAsDataURL(data);
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    }).catch((err) => {
      return Promise.reject(err);
    });
    return this.sanitizer.bypassSecurityTrustUrl(response);
  }

  updateInterests(interests: Interests): Promise<Interests> {
    return new Promise<Interests>((resolve, reject) => {
      this.httpClient.patch<Interests>(environment.backendUrl + '/interests', interests).subscribe({
        next: (data: Interests) => {
          resolve(data);
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    });
  }

  blockUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.modalService.show({
        title: 'Block user',
        message: 'Are you sure you want to block this user?\nThis cannot be undone.',
        confirmText: 'Block',
        cancelText: 'Cancel',
        type: 'alert',
        callBack: (eventType) => {
          switch (eventType) {
            case 'OK':
              this.httpClient.post(environment.backendUrl + '/user/block/' + id, {}).subscribe({
                next: () => {
                  resolve();
                },
                error: (err: HttpErrorResponse) => {
                  reject(err.statusText);
                },
              });
              break;
            case 'CANCEL':
              break;
          }
        },
      });
    });
  }

  updateProfile(user: User): Promise<any> {
    const interests = user.interests;

    return new Promise<User>((resolve, reject) => {
      this.httpClient.patch<User>(environment.backendUrl + '/user', user).subscribe({
        next: (data: User) => {
          if (interests) {
            this.updateInterests(interests).catch(
              (err) => {
                reject(err);
              }
            ).then(() => {
              resolve(data);
            });
          } else {
            resolve(data);
          }
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    });
  }
}
