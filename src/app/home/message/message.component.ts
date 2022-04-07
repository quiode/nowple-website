import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../home.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, UrlSerializer } from '@angular/router';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() chat?: Chat;
  profilePicture: SafeUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  constructor(private router: Router, private messageService: MessageService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.chat) {
      this.messageService.getPublicProfilePicture(this.chat?.user.id || '').then(url => {
        this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    }
  }

  onProfile() {
    this.router.navigate(['/profile', this.chat?.user.id]);
  }
}
