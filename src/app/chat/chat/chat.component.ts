import { Component, OnInit } from '@angular/core';
import { Router, RouterState, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HomeService } from '../../home/home.service';
import { MessageService } from '../../home/message/message.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-cgat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: string = '';
  uuid: string;
  userName: string = '';
  profilePicture: SafeUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, private sanitizer: DomSanitizer, private chatService: ChatService) {
    this.uuid = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.messageService.getPublicProfilePicture(this.uuid).then(profilePicture => {
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(profilePicture);
    });

    this.chatService.getUsername(this.uuid).then(userName => {
      this.userName = userName;
    });
  }

  onBack() {
    this.router.navigate(['']);
  }

  onProfile() {
    this.router.navigate(['/profile', this.uuid]);
  }

  onSend() {
    alert(this.message)
  }
}
