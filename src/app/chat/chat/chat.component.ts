import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, Input } from '@angular/core';
import { Router, RouterState, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HomeService, Message } from '../../home/home.service';
import { MessageService } from '../../home/message/message.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatService } from '../chat.service';
import { ModalService } from '../../shared/modal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cgat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('top') top?: ElementRef<HTMLDivElement>;
  @ViewChild('bottom') bottom?: ElementRef<HTMLDivElement>;
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;
  @Input() uuid: string;
  messages: Message[] = [];
  sendingMessage = false;
  generatingTopic = false;
  message: string = '';
  userName: string = '';
  profilePicture: SafeUrl = environment.defaultProfilePicture;
  observer?: ResizeObserver;
  bottomObserver?: ResizeObserver;

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, private sanitizer: DomSanitizer, private chatService: ChatService, private modalService: ModalService, private renderer: Renderer2) {
    this.uuid = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.messageService.getPublicProfilePicture(this.uuid).then(profilePicture => {
      this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(profilePicture);
    });

    this.chatService.getUsername(this.uuid).then(userName => {
      this.userName = userName;
    });

    this.chatService.getMessages(this.uuid).subscribe(messages => {
      let newMessage = false;
      for (let message of messages) {
        if (this.messages.findIndex(m => m.id == message.id) == -1) {
          this.messages.push(message);
          newMessage = true;
        }
      }
      if (newMessage) {
        this.scrollToBottom();
      }
      this.messages = this.messages.sort((a, b) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime());
    });

    this.observer = new ResizeObserver((entries) => {
      if (this.container && this.bottom && this.top) {
        this.renderer.setStyle(this.container?.nativeElement, 'height', `${window.innerHeight - this.bottom.nativeElement.offsetHeight - this.top.nativeElement.offsetHeight}px`);
      }
      this.scrollToBottom();
    })

    this.bottomObserver = new ResizeObserver((entries) => {
      let space = 0;
      entries.forEach((entry) => {
        space += entry.borderBoxSize[0].blockSize;
      })
      if (this.container && space > 0) {
        this.renderer.setStyle(this.container?.nativeElement, 'bottom', `${space}px`);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.top && this.bottom && this.observer) {
      this.observer.observe(this.bottom.nativeElement);
      this.observer.observe(this.top.nativeElement);
    }

    if (this.bottom && this.bottomObserver) {
      this.bottomObserver.observe(this.bottom.nativeElement);
    }

    if (this.container && this.bottom && this.top) {
      this.renderer.setStyle(this.container?.nativeElement, 'height', `${window.innerHeight - this.top.nativeElement.offsetHeight - this.bottom.nativeElement.offsetHeight}px`);
      this.renderer.setStyle(this.container?.nativeElement, 'bottom', `${this.bottom.nativeElement.offsetHeight}px`);
    }

    this.scrollToBottom();
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

  scrollToBottom(): void {
    if (this.container) {
      this.container.nativeElement.scrollTo(0, this.container.nativeElement.scrollHeight);
    }
  }
}
