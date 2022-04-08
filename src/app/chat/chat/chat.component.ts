import { Component, OnInit } from '@angular/core';
import { Router, RouterState, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HomeService, Message } from '../../home/home.service';
import { MessageService } from '../../home/message/message.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatService } from '../chat.service';
import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-cgat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  sendingMessage = false;
  generatingTopic = false;
  message: string = '';
  uuid: string;
  userName: string = '';
  profilePicture: SafeUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, private sanitizer: DomSanitizer, private chatService: ChatService, private modalService: ModalService) {
    this.uuid = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.messageService.getPublicProfilePicture(this.uuid).then(profilePicture => {
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(profilePicture);
    });

    this.chatService.getUsername(this.uuid).then(userName => {
      this.userName = userName;
    });

    this.chatService.getChat(this.uuid).subscribe(chat => {
      this.messages.push(...chat.messages);
    });
  }

  onBack() {
    this.router.navigate(['']);
  }

  onProfile() {
    this.router.navigate(['/profile', this.uuid]);
  }

  onSend() {
    this.sendingMessage = true;
    this.chatService.sendMessage(this.uuid, this.message).catch(err => {
      this.modalService.show({ message: err.error.message, title: 'Error', confirmText: 'Ok', type: 'alert' });
      this.message = '';
      this.sendingMessage = false;
    }).finally(() => {
      this.message = '';
      this.sendingMessage = false;
    });
  }

  onNewTopic() {
    this.generatingTopic = true;
    this.chatService.genTopic(this.uuid).catch(err => {
      this.modalService.show({ message: err.error.message, title: 'Error', confirmText: 'Ok', type: 'alert' });
      this.generatingTopic = false;
    }).finally(() => {
      this.generatingTopic = false;
    });
  }
}
