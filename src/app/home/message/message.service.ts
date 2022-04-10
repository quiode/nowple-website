import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient) {
  }

  async getPublicProfilePicture(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get(environment.backendUrl + '/user/profilePicture/' + id, { responseType: 'blob' }).subscribe({
        next: response => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            resolve(reader.result as string);
          }
          reader.onerror = () => {
            reject('Could not read profile picture');
          }
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

}
