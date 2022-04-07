import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HomeService, Chat } from '../home.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // windowWidth = window.screen.availWidth;
  findingMatch = false;
  chats: Chat[] = [];
  profilePicture: SafeUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  constructor(private authService: AuthService, private router: Router, private homeService: HomeService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.homeService.getChats().then(chats => {
      this.chats = chats;
    });
    this.homeService.getProfilePicture().then(profilePicture => {
      this.profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl(profilePicture);
    });
  }


  onProfile() {
    this.router.navigate(['profile', this.authService.getUserId()]);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  onFindMatch() {
    if (!this.findingMatch) {
      this.findingMatch = true;
      this.homeService.findMatch().finally(() => {
        this.findingMatch = false;
        this.homeService.getChats().then(chats => {
          this.chats = chats;
        });
      });
    }
  }
}
