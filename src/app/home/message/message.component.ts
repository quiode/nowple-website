import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../shared/classes/Chat';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, UrlSerializer } from '@angular/router';
import { MessageService } from './message.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() chat?: Chat;
  profilePicture: SafeUrl = environment.defaultProfilePicture;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.chat) {
      this.messageService.getPublicProfilePicture(this.chat?.user.id || '').then((url) => {
        this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    }
  }

  onProfile() {
    this.router.navigate(['/profile', this.chat?.user.id]);
  }

  onChat() {
    this.router.navigate(['/chat', this.chat?.user.id]);
  }
}
