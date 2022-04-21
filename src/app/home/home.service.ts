import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom } from 'rxjs';
import { ModalService } from '../shared/modal.service';
import { GeneralService } from '../shared/general.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../shared/classes/User';
import { Message } from '../shared/classes/Message';
import { Chat } from '../shared/classes/Chat';

@Injectable({
  providedIn: 'root',
})
export class HomeService implements OnInit {
  messages: Message[] = [];
  constructor(
    private httpClient: HttpClient,
    private modalService: ModalService,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  async findMatch() {
    const response = this.httpClient.post<User>(environment.backendUrl + '/user/find', {}).pipe(
      catchError((err) => {
        this.modalService.showAlert(err.error.message);
        return [];
      })
    );
    const user = await firstValueFrom(response);
    if (user) {
      this.router.navigate(['/chat', user.id]);
    }
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

  async getProfilePicture(): Promise<string> {
    return this.generalService.blobRequestToDataUrl(
      this.httpClient.get(environment.backendUrl + '/user/profilePicture', { responseType: 'blob' })
    );
  }
}
