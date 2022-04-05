import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private signupService: SignupService) { }

  ngOnInit(): void {
  }

  next() {
    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;

      if (username && password) {
        this.signupService.set1({ username, password });
      }
    }
  }

}
