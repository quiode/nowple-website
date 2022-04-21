import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Message } from '../../shared/classes/Message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements AfterViewInit {
  @Input() message?: Message;
  @Input() username: string = 'N/A';
  date: Date = new Date();

  constructor() {}

  ngAfterViewInit(): void {
    if (this.message) this.date = new Date(this.message?.time);
  }
}
