import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // windowWidth = window.screen.availWidth;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }


  onProfile() {
    this.router.navigate(['profile', this.authService.getUserId()]);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
