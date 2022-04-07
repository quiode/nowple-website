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
    const response = this.httpClient.get(environment.backendUrl + '/user/profilePicture/' + id, { responseType: 'blob' });
    const data = await firstValueFrom(response);

    return URL.createObjectURL(data);
  }

}
