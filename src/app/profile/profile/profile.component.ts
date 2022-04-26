import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/classes/User';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ProfileService, Interests } from '../profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../../shared/modal.service';
import { GeneralService } from '../../shared/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Gender } from '../../shared/constants/genders';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  readonly genders = Object.values(Gender);
  readonly initialSelectValue = 'Select your Gender';
  profile?: User;
  uuid: string;
  editingPolitics = false;
  editingPersonal = false;
  profilePicture: SafeUrl = environment.defaultProfilePicture;
  politicsForm = new FormGroup({
    economic: new FormControl(0, [
      Validators.min(1),
      Validators.max(100),
    ]),
    diplomatic: new FormControl(0, [
      Validators.min(1),
      Validators.max(100),
    ]),
    civil: new FormControl(0, [
      Validators.min(1),
      Validators.max(100),
    ]),
    society: new FormControl(0, [
      Validators.min(1),
      Validators.max(100),
    ]),
  });
  personalForm = new FormGroup({
    gender: new FormControl(this.initialSelectValue, [
      Validators.required,
      Validators.pattern(`^(?!${this.initialSelectValue}$).*`),
    ]),
  });

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService,
    private generalService: GeneralService,
    private sanitizer: DomSanitizer
  ) {
    this.uuid = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.profileService.getProfilePicture(this.uuid).then((profile) => {
      this.profilePicture = profile;
    });

    this.profileService
      .getProfile(this.uuid)
      .catch((err) => {
        this.router.navigate(['']);
        this.modalService.showAlert('User not found');
      })
      .then((profile) => {
        if (profile) {
          this.profile = profile;
          if (this.profile && this.profile.interests) {
            if (this.profile.interests.civil) {
              this.politicsForm.patchValue({ civil: this.profile.interests.civil });
            }
            if (this.profile.interests.diplomatic) {
              this.politicsForm.patchValue({ diplomatic: this.profile.interests.diplomatic });
            }
            if (this.profile.interests.economic) {
              this.politicsForm.patchValue({ economic: this.profile.interests.economic });
            }
            if (this.profile.interests.society) {
              this.politicsForm.patchValue({ society: this.profile.interests.society });
            }
          }
          if (this.profile.gender) {
            this.personalForm.patchValue({ gender: this.profile.gender });
          }
        }
      });
  }

  isPublicProfile(): boolean {
    return this.uuid !== this.authService.getUserId();
  }

  isPrivateProfile(): boolean {
    return this.uuid === this.authService.getUserId();
  }

  onBack(): void {
    this.router.navigate(['']);
  }

  fileSelectFunction(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length == 1) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 1000000) {
          this.generalService.setProfilePicture(file).subscribe((res) => {
            this.profileService.getProfilePicture(this.uuid).then((profile) => {
              this.profilePicture = profile;
            });
          });
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

  submitPolitics() {
    if (this.politicsForm.invalid) {
      this.modalService.showAlert('Form is invalid');
      return;
    }

    this.editingPolitics = false;

    const updatetInterests: Interests = {
      ...this.profile?.interests,
      civil: this.politicsForm.get('civil')?.value || this.profile?.interests?.civil,
      diplomatic: this.politicsForm.get('diplomatic')?.value || this.profile?.interests?.diplomatic,
      economic: this.politicsForm.get('economic')?.value || this.profile?.interests?.economic,
      society: this.politicsForm.get('society')?.value || this.profile?.interests?.society,
    };

    this.profileService
      .updateInterests(updatetInterests)
      .catch((err: string) => {
        this.modalService.showAlert(err);
      })
      .then(() => {
        this.router.navigate([''], { relativeTo: this.route });
      });
  }

  submitPersonal() {
    if (this.personalForm.invalid) {
      this.modalService.showAlert('Form is invalid');
      return;
    }

    if (!this.profile) {
      this.modalService.showAlert('Profile not found');
      return;
    }

    this.editingPersonal = false;

    const updateProfile: User = {
      ...this.profile,
      gender: this.personalForm.get('gender')?.value || this.profile.gender,
    };

    this.profileService.updateProfile(updateProfile).then(
      (user) => {
        this.router.navigate([''], { relativeTo: this.route });
      },
      (err: string) => {
        this.modalService.showAlert(err);
      }
    );
  }

  blockUser() {
    this.profileService.blockUser(this.uuid).then(
      () => {
        this.router.navigate(['']);
      },
      (err: string) => {
        this.modalService.showAlert(err);
      }
    );
  }
}
