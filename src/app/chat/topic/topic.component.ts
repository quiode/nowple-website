import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../home/home.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() message?: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
