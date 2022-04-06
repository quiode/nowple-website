import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home/home.component';
import { HomeComponent as AuthHomeComponent } from './auth/home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FirstComponent } from './auth/signup/first/first.component';
import { SecondComponent } from './auth/signup/second/second.component';
import { LastComponent } from './auth/signup/last/last.component';
import { ChatComponent } from './chat/chat/chat.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';

const routes: Routes = [
  { path: '', component: AuthHomeComponent, pathMatch: 'full', canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'signup', component: SignupComponent, canActivate: [LoginGuard], children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: '1', component: FirstComponent },
      { path: '2', component: SecondComponent },
      { path: '3', component: LastComponent },
    ]
  },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
