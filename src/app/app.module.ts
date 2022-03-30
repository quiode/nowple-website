import { SettingsModule } from './settings/settings.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ChatModule,
    HomeModule,
    ProfileModule,
    SettingsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
