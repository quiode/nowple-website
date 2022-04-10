import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  blobRequestToDataUrl(request: Observable<Blob>): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      request.subscribe({
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
        error: (err: HttpErrorResponse) => {
          const message = err.statusText || 'Could not read profile picture';
          reject(message);
        }
      });
    });
  }
}
