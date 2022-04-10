import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
        error: err => {
          reject(err);
        }
      });
    });
  }
}