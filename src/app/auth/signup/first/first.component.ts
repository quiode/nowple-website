import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ModalService } from '../../../shared/modal.service';
import { Gender } from '../../../shared/constants/genders';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent implements OnInit {
  readonly genders = Object.values(Gender);
  readonly initialSelectValue = 'Select your Gender';
  form = new FormGroup({
    username: new FormControl(this.signupService.signUpData.data1?.username || '', [
      Validators.required,
    ]),
    password: new FormControl(this.signupService.signUpData.data1?.password || '', [
      Validators.required,
      Validators.minLength(5),
    ]),
    profilePicture: new FormControl(this.signupService.getProfilePicture()?.name || '', [
      Validators.required,
    ]),
    gender: new FormControl(
      this.signupService.signUpData.data1?.gender || this.initialSelectValue,
      [Validators.required, Validators.pattern(`^(?!${this.initialSelectValue}$).*`)]
    ),
    latitude: new FormControl(this.signupService.signUpData.data1?.location.coordinates[0] || 0, Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')),
    longitude: new FormControl(this.signupService.signUpData.data1?.location.coordinates[1] || 0, Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')),
  });

  constructor(
    private signupService: SignupService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    if (this.signupService.signUpData.data1) {
      this.form.markAllAsTouched();
    }
  }

  next() {
    const latitude = this.form.get('latitude')?.value;
    const longitude = this.form.get('longitude')?.value;
    if (this.form.valid && typeof latitude === 'number' && typeof longitude === 'number') {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      const gender = this.form.get('gender')?.value;

      if (username && password) {
        this.signupService.set1({
          username, password, gender, location: {
            type: 'Point',
            coordinates: [latitude, longitude]
          }
        });
        this.router.navigate(['../2'], { relativeTo: this.route });
      }
    }
  }

  fileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length == 1) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 1000000) {
          this.signupService.setProfilePicture(file);
          return;
        } else {
          this.modalService.showAlert('The file is too big');
        }
      } else {
        this.modalService.showAlert('Wrong image type');
      }
    } else {
      this.modalService.showAlert('Too many files or no file selected');
    }

    target.value = '';
  }
}
