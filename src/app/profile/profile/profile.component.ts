import { Component, OnInit } from '@angular/core';
import { User } from '../../home/home.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../../shared/modal.service';
import { GeneralService } from '../../shared/general.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile?: User;
  uuid: string;
  profilePicture: SafeUrl = environment.defaultProfilePicture;

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
        this.modalService.show({
          title: 'Error',
          message: 'User not found',
          confirmText: 'Ok',
          type: 'alert',
        });
      })
      .then((profile) => {
        if (profile) {
          this.profile = profile;
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
          this.modalService.show({
            title: 'Error',
            message: 'The file is too big',
            type: 'alert',
            confirmText: 'Ok',
          });
        }
      } else {
        this.modalService.show({
          title: 'Error',
          message: 'Wrong image type',
          type: 'alert',
          confirmText: 'Ok',
        });
      }
    } else {
      this.modalService.show({
        title: 'Error',
        message: 'Too many files or no file selected',
        type: 'alert',
        confirmText: 'Ok',
      });
    }

    target.value = '';
  }
}
