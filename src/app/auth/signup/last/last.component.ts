import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from '../signup.service';
import { ModalService } from '../../../shared/modal.service';
import { Gender } from '../../../shared/constants/genders';

@Component({
  selector: 'app-last',
  templateUrl: './last.component.html',
  styleUrls: ['./last.component.scss'],
})
export class LastComponent implements OnInit {
  readonly genders = Object.values(Gender);
  form = new FormGroup({
    darkmode: new FormControl(this.signupService.signUpData.data3?.isDarkMode != undefined ? this.signupService.signUpData.data3?.isDarkMode : false),
    discoverable: new FormControl(this.signupService.signUpData.data3?.discoverable != undefined ? this.signupService.signUpData.data3?.discoverable : true),
    considerPolitics: new FormControl(
      this.signupService.signUpData.data3?.considerPolitics != undefined ? this.signupService.signUpData.data3?.considerPolitics : true
    ),
    considerGender: new FormControl(this.signupService.signUpData.data3?.considerGender != undefined ? this.signupService.signUpData.data3?.considerGender : true),
    reversedPoliticalView: new FormControl(
      this.signupService.signUpData.data3?.reversedPoliticalView != undefined ? this.signupService.signUpData.data3?.reversedPoliticalView : false
    ),
    preferredGender: new FormControl(this.signupService.signUpData.data3?.preferredGender || 0),
    maxDistance: new FormControl(this.signupService.signUpData.data3?.maxDistance != undefined ? this.signupService.signUpData.data3?.maxDistance : 10, [Validators.min(0), Validators.max(1000)])
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private signupService: SignupService,
    private modalService: ModalService
  ) { }

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
      const considerPolitics: boolean = this.form.get('considerPolitics')?.value;
      const considerGender: boolean = this.form.get('considerGender')?.value;
      const reversedPoliticalView: boolean = this.form.get('reversedPoliticalView')?.value;
      const preferredGender: Gender[] = this.form.get('preferredGender')?.value;
      const maxDistance: number = this.form.get('maxDistance')?.value

      if (
        darkmode != undefined &&
        discoverable != undefined &&
        considerGender != undefined &&
        considerPolitics != undefined &&
        reversedPoliticalView != undefined &&
        preferredGender != undefined &&
        maxDistance != undefined
      ) {
        this.signupService.set3({
          isDarkMode: darkmode,
          discoverable,
          considerPolitics,
          considerGender,
          reversedPoliticalView,
          preferredGender,
          maxDistance,
        });
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
