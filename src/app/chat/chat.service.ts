import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Message } from '../shared/classes/Message';
import { User } from '../shared/classes/User';
import { SseService } from '../shared/sse.service';
import { AuthService } from '../auth/auth.service';

export interface Chat {
  receiver: string;
  messages: Message[];
  seeConnection: Observable<string>;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chats: Chat[] = [];

  constructor(
    private httpClient: HttpClient,
    private sseService: SseService,
    private authService: AuthService
  ) { }

  async getUsername(id: string): Promise<string> {
    const response = this.httpClient.get<User>(environment.backendUrl + '/user/public/' + id);

    const value = await firstValueFrom(response);

    return value.username;
  }

  async sendMessage(id: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<Message>(environment.backendUrl + '/messages/send/' + id, {
          message: message,
          date: new Date(),
        })
        .subscribe({
          next: (data) => {
            resolve();
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  async genTopic(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<Message>(environment.backendUrl + '/messages/topic/' + id, {}).subscribe({
        next: (data) => {
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  getMessages(id: string): Observable<Message[]> {
    // check if chat exists
    const chat = this.chats.find((c) => c.receiver === id);
    if (chat) {
      return new Observable<Message[]>((observer) => {
        observer.next(chat.messages);
        chat.seeConnection.subscribe((data) => {
          observer.next(this.sseStringToMessages(data));
        });
      });
    } else {
      const sse = this.sseService.observeMessages(
        environment.backendUrl +
        '/messages/conversation/stream/' +
        id +
        '/' +
        this.authService.getToken() +
        '?ngsw-bypass=true'
      );
      const chat: Chat = {
        receiver: id,
        messages: [],
        seeConnection: sse,
      };
      this.chats.push(chat);
      sse.subscribe((data) => {
        for (const message of this.sseStringToMessages(data)) {
          if (chat.messages.findIndex((m) => m.id === message.id) == -1) {
            chat.messages.push(message);
          }
        }
      });
      return this.sseConnectionToMessages(sse);
    }
  }

  private sseConnectionToMessages(sse: Observable<string>): Observable<Message[]> {
    return sse.pipe(
      map((data) => {
        return this.sseStringToMessages(data);
      })
    );
  }

  private sseStringToMessages(sse: string): Message[] {
    return JSON.parse(sse);
  }

  async checkForMatchmake(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<boolean>(environment.backendUrl + '/user/canMatchmake/' + id).subscribe({
        next: (data) => {
          resolve(true);
        },
        error: (err) => {
          resolve(false);
        },
      });
    });
  }

  async matchmake(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.backendUrl + '/user/matchmake/' + id, {}).subscribe({
        next: (data) => {
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  async block(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.backendUrl + '/user/block/' + id, {}).subscribe({
        next: (data) => {
          resolve();
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }
}
