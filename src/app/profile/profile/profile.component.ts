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
import * as haversine from 'haversine';
import { Hobbies } from '../../shared/constants/hobbies';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  readonly genders = Object.values(Gender);
  readonly hobbiesValues: number[] = Object.values(Hobbies).filter((hobby) => typeof hobby === 'number') as number[];
  readonly hobbies = Hobbies;
  readonly initialSelectValue = 'Select your Gender';
  profile?: User;
  uuid: string;
  editingPolitics = false;
  editingPersonal = false;
  editingHobbies = false;
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
    locationX: new FormControl(0),
    locationY: new FormControl(0),
  });
  hobbiesForm = new FormGroup({
    hobbies: new FormControl([]),
  })
  distance?: number;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService,
    private generalService: GeneralService,
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
          if (this.profile.location) {
            this.personalForm.patchValue({
              locationX: this.profile.location.coordinates[0],
              locationY: this.profile.location.coordinates[1],
            });
            this.calcDistance().then((distance) => {
              if (distance) {
                this.distance = Math.round(distance * 100) / 100;
              }
            });
          }
          if (this.profile.interests?.hobbies) {
            this.hobbiesForm.patchValue({ hobbies: this.profile.interests.hobbies });
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

    let newLocation = this.profile.location;

    if (typeof this.personalForm.get('locationX')?.value === 'number' && typeof this.personalForm.get('locationY')?.value === 'number') {
      newLocation = {
        type: 'Point',
        coordinates: [this.personalForm.get('locationX')?.value, this.personalForm.get('locationY')?.value],
      };
    }

    const updateProfile: User = {
      ...this.profile,
      gender: this.personalForm.get('gender')?.value || this.profile.gender,
      location: newLocation
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

  submitHobbies() {
    if (this.hobbiesForm.invalid) {
      this.modalService.showAlert('Form is invalid');
      return;
    }

    if (!this.profile) {
      this.modalService.showAlert('Profile not found');
      return;
    }

    this.editingHobbies = false;

    const updateProfile: User = {
      ...this.profile,
      interests: {
        ...this.profile.interests,
        hobbies: this.hobbiesForm.get('hobbies')?.value || this.profile.interests?.hobbies,
      },
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

  openMap() {
    window.open(`https://www.openstreetmap.org/directions?from=${this.profile?.location?.coordinates[0]},${this.profile?.location?.coordinates[1]}`, '_blank');
  }

  async calcDistance(): Promise<number | undefined> {
    const position: GeolocationPosition | undefined = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, (err) => {
        resolve(undefined);
      });
    });
    if (position == undefined) {
      return undefined;
    }
    if (this.profile?.location?.coordinates[0] == undefined || this.profile?.location?.coordinates[1] == undefined) {
      return undefined;
    }
    const start: haversine.CoordinateLongitudeLatitude = { latitude: position.coords.latitude, longitude: position.coords.longitude };
    const end: haversine.CoordinateLongitudeLatitude = { latitude: this.profile?.location?.coordinates[0], longitude: this.profile?.location?.coordinates[1] };
    return haversine(start, end)
  }

  getCords(): number[] {
    const x = this.profile?.location?.coordinates[0] || 0;
    const y = this.profile?.location?.coordinates[1] || 0;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }

  // get value from hobbies enum
  getHobbies(hobbies: Hobbies[]): string[] {
    return hobbies.map((hobby) => {
      return Hobbies[hobby];
    });
  }
}
