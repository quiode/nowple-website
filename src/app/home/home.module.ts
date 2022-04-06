import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';



@NgModule({
  declarations: [
    HomeComponent,
    MessageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
