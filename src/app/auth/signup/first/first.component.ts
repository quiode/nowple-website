import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl(this.signupService.signUpData.data1?.username || '', [Validators.required]),
    password: new FormControl(this.signupService.signUpData.data1?.password || '', [Validators.required, Validators.minLength(5)])
  });

  constructor(private signupService: SignupService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  next() {
    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;

      if (username && password) {
        this.signupService.set1({ username, password });
        this.router.navigate(['../2'], { relativeTo: this.route });
      }
    }
  }
}
