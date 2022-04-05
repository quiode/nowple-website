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
    economic: new FormControl(this.signupService.signUpData.data2?.economic || 50, [Validators.min(0), Validators.max(100)]),
    diplomatic: new FormControl(this.signupService.signUpData.data2?.diplomatic || 50, [Validators.min(0), Validators.max(100)]),
    civil: new FormControl(this.signupService.signUpData.data2?.civil || 50, [Validators.min(0), Validators.max(100)]),
    society: new FormControl(this.signupService.signUpData.data2?.society || 50, [Validators.min(0), Validators.max(100)]),
  });

  constructor(private signupService: SignupService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (!this.signupService.signUpData.data1) {
      this.router.navigate(['../1'], { relativeTo: this.route });
    }
  }

  next() {
    if (this.form.valid) {
      const economic = this.form.get('economic')?.value;
      const diplomatic = this.form.get('diplomatic')?.value;
      const civil = this.form.get('civil')?.value;
      const society = this.form.get('society')?.value;


      if (economic && diplomatic && civil && society) {
        this.signupService.set2({ economic, diplomatic, civil, society });
        this.router.navigate(['../3'], { relativeTo: this.route });
      }
    }
  }

  back() {
    this.router.navigate(['../1'], { relativeTo: this.route });
  }
}
