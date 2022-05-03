import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { Chat } from '../../shared/classes/Chat';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('top1') top1?: ElementRef<HTMLDivElement>;
  @ViewChild('top2') top2?: ElementRef<HTMLDivElement>;
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;
  // windowWidth = window.screen.availWidth;
  findingMatch = false;
  chats: Chat[] = [];
  profilePicture: SafeUrl = environment.defaultProfilePicture;
  observer?: ResizeObserver;
  displayMatches = true;
  displayOther = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.homeService.getChats().then((chats) => {
      this.chats = chats;
    });
    this.homeService.getProfilePicture().then((profilePicture) => {
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(profilePicture);
    });

    this.observer = new ResizeObserver((entries) => {
      let space = 0;
      entries.forEach((entry) => {
        space += entry.contentRect.height;
      });
      if (this.container && space > 0) {
        this.renderer.setStyle(this.container?.nativeElement, 'top', `${space}px`);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.top1 && this.top2 && this.observer) {
      this.observer.observe(this.top1.nativeElement);
      this.observer.observe(this.top2.nativeElement);
    }
  }

  onProfile() {
    this.router.navigate(['profile', this.authService.getUserId()]);
  }

  onSettings() {
    this.router.navigate(['settings']);
  }

  onFindMatch() {
    if (!this.findingMatch) {
      this.findingMatch = true;
      this.homeService.findMatch().finally(() => {
        this.findingMatch = false;
        this.homeService.getChats().then((chats) => {
          this.chats = chats;
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  changeDisplayMatches() {
    this.displayMatches = !this.displayMatches;
  }

  changeDisplayOther() {
    this.displayOther = !this.displayOther;
  }
}
