import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom, Observable, catchError } from 'rxjs';
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
    return new Promise((resolve, reject) => {
      this.httpClient.post<Message>(environment.backendUrl + '/messages/send/' + id, { message: message, date: new Date() }).subscribe(
        {
          next: (data) => {
            console.log('data2', data);
            resolve();
          },
          error: (err) => {
            reject(err);
          }
        }
      );
    })
  }

  async genTopic(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Message>(environment.backendUrl + '/messages/topic/' + id, {}).subscribe(
        {
          next: (data) => {
            console.log('data2', data);
            resolve();
          },
          error: (err) => {
            reject(err);
          }
        }
      );
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
