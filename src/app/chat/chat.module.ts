import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { NgModel, FormsModule } from '@angular/forms';
import { TopicComponent } from './topic/topic.component';
import { MessageComponent } from './message/message.component';



@NgModule({
  declarations: [
    ChatComponent,
    TopicComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ChatModule { }
