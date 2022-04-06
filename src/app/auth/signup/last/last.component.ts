import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-last',
  templateUrl: './last.component.html',
  styleUrls: ['./last.component.scss']
})
export class LastComponent implements OnInit {
  form = new FormGroup({
    darkmode: new FormControl(this.signupService.signUpData.data3?.darkmode || false)
  });

  constructor(private router: Router, private route: ActivatedRoute, private signupService: SignupService, private modalService: ModalService) { }

  ngOnInit(): void {
    if (!this.signupService.signUpData.data2) {
      this.router.navigate(['../2'], { relativeTo: this.route });
    }
    if (this.signupService.signUpData.data3) {
      this.form.markAllAsTouched();
    }
  }

  submit() {
    if (this.form.valid && this.form.touched) {
      const darkmode = this.form.get('darkmode')?.value;

      if (darkmode != undefined) {
        this.signupService.set3({ darkmode });
        this.signupService.submit().then(
          () => {
            this.router.navigate(['']);
            this.modalService.show({
              message: 'Your account has been created!',
              title: 'Success',
              confirmText: 'Ok',
              type: 'success'
            })
          },
          err => {
            this.router.navigate(['../1'], { relativeTo: this.route });
            this.modalService.show({ message: err as string, title: 'Error', confirmText: 'Ok', type: 'alert' });
          }
        );
      }
    }
  }

  back() {
    this.router.navigate(['../2'], { relativeTo: this.route });
  }
}
