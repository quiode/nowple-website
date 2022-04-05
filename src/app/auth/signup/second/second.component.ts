import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss']
})
export class SecondComponent implements OnInit {
  form = new FormGroup({
  });

  constructor(private signupService: SignupService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  next() {
    // TODO

    if (this.form.valid) {
      if (false) {
        this.signupService.set2({});
        this.router.navigate(['../3'], { relativeTo: this.route });
      }
    }
  }

  back() {
    this.router.navigate(['../1'], { relativeTo: this.route });
  }
}
