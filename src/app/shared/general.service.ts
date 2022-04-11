import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private httpClient: HttpClient) {}

  blobRequestToDataUrl(request: Observable<Blob>): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      request.subscribe({
        next: (response) => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            reject('Could not read profile picture');
          };
        },
        error: (err: HttpErrorResponse) => {
          const message = err.statusText || 'Could not read profile picture';
          reject(message);
        },
      });
    });
  }

  setProfilePicture(profilePicture: File) {
    const data = new FormData();
    data.append('profilePicture', profilePicture);
    const response = this.httpClient.post(environment.backendUrl + '/user/profilePicture', data, {
      responseType: 'text',
    });
    return response;
  }
}
