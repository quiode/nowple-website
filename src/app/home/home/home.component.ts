import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HomeService, Chat } from '../home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // windowWidth = window.screen.availWidth;
  findingMatch = false;
  chats: Chat[] = [];

  constructor(private authService: AuthService, private router: Router, private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getChats().then(chats => {
      this.chats = chats;
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
