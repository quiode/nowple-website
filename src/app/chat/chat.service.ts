import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { Message, User } from '../home/home.service';

export interface Chat {
  receiver: string;
  messages: Message[];
}

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

  async sendMessage(id: string, message: string): Promise<void> {
    // TODO
    return new Promise(resolve => {
      setInterval(() => {
        resolve()
      }, 2000)
    })
  }

  async genTopic(id: string): Promise<void> {
    // TODO
    return new Promise(resolve => {
      setInterval(() => {
        resolve()
      }, 2000)
    })
  }

  getChat(id: string): Observable<Chat> {
    // TODO
    return new Observable(
      observer => {
        observer.next({
          receiver: '',
          messages: []
        });
      }
    );
  }
}
