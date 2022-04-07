import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { User } from '../home/home.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) {
  }

  async getUsername(id: string): Promise<string> {
    const response = this.httpClient.get<User>(environment.backendUrl + '/user/public/' + id);

    const value = await firstValueFrom(response);

    return value.username;
  }
}
