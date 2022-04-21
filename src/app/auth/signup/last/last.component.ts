import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-last',
  templateUrl: './last.component.html',
  styleUrls: ['./last.component.scss'],
})
export class LastComponent implements OnInit {
  form = new FormGroup({
    darkmode: new FormControl(this.signupService.signUpData.data3?.isDarkMode || false),
    discoverable: new FormControl(this.signupService.signUpData.data3?.discoverable || true),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private signupService: SignupService,
    private modalService: ModalService
  ) {}

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
      const darkmode: boolean = this.form.get('darkmode')?.value;
      const discoverable: boolean = this.form.get('discoverable')?.value;

      if (darkmode != undefined && discoverable != undefined) {
        this.signupService.set3({ isDarkMode: darkmode, discoverable });
        this.signupService.submit().then(
          () => {
            this.router.navigate(['']);
          },
          (err) => {
            this.router.navigate(['../1'], { relativeTo: this.route });
            this.modalService.showAlert(err as string);
          }
        );
      }
    }
  }

  back() {
    this.router.navigate(['../2'], { relativeTo: this.route });
  }
}
