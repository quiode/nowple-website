import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-last',
  templateUrl: './last.component.html',
  styleUrls: ['./last.component.scss']
})
export class LastComponent implements OnInit {
  form = new FormGroup({});

  constructor(private router: Router, private route: ActivatedRoute, private signupService: SignupService) { }

  ngOnInit(): void {
    if (!this.signupService.signUpData.data2) {
      this.router.navigate(['../2'], { relativeTo: this.route });
    }
  }

  submit() {
    // TODO
  }

  back() {
    this.router.navigate(['../2'], { relativeTo: this.route });
  }
}
