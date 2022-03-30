import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { FirstComponent } from './signup/first/first.component';
import { SecondComponent } from './signup/second/second.component';
import { LastComponent } from './signup/last/last.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    SignupComponent,
    FirstComponent,
    SecondComponent,
    LastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule
  ]
})
export class AuthModule { }
