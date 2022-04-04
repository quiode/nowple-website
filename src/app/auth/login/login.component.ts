import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ModalService } from '../../shared/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private modalService: ModalService, private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    const username = this.loginForm.get('username');
    const password = this.loginForm.get('password');
    if (this.loginForm.valid && username && password && username.value && password.value) {
      this.authService.login(username.value, password.value).then((value) => {
        if (!value) {
          this.modalService.show({ title: 'Error', message: 'Invalid username or password', confirmText: 'Ok', type: 'alert' });
        } else {
          this.router.navigate(['']);
        }
      }).finally(() => {
        this.loginForm.reset();
      }).catch(
        () => { this.modalService.show({ title: 'Error', message: 'Invalid username or password', confirmText: 'Ok', type: 'alert' }) }
      );
    }
  }
}
