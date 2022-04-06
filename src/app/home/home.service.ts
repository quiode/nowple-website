import { Injectable, OnInit } from '@angular/core';
import { Settings } from '../settings/settings.service';
import { Interests } from '../profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom } from 'rxjs';
import { ModalService } from '../shared/modal.service';

export interface Chat { user: User, lastMessage?: Message }

export interface User {
  id: string,
  username: string,
  settings?: Settings,
  interests?: Interests,
  sentMessages?: Message[],
  receivedMessages?: Message[],
  matches?: User[],
  blocksOrDeclined?: User[]
  contacts?: User[]
}

export interface Message {
  id: number,
  message: String,
  time: Date
  sender?: User,
  receiver?: User,
}
@Injectable({
  providedIn: 'root'
})
export class HomeService implements OnInit {
  messages: Message[] = [];
  constructor(private httpClient: HttpClient, private modalService: ModalService) {
  }
  ngOnInit(): void {
  }

  async findMatch() {
    // TODO
    const response = this.httpClient.post<User>(environment.backendUrl + '/user/find', {}).pipe(
      catchError(err => {
        this.modalService.show({
          title: 'Error',
          message: err.error.message,
          type: 'alert',
          confirmText: 'Ok'
        });
        return [];
      })
    );
    const user = await firstValueFrom(response);
    return user;
  }

  async getUser(): Promise<User> {
    const response = this.httpClient.get<User>(environment.backendUrl + '/user');
    const user = await firstValueFrom(response);
    return user;
  }

  async getChats(): Promise<Chat[]> {
    const response = this.httpClient.get<Chat[]>(environment.backendUrl + '/user/chats');
    const messages = await firstValueFrom(response);
    return messages;
  }
}
