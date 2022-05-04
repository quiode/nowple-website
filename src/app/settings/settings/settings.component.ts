import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { ModalService } from '../../shared/modal.service';
import { Gender } from '../../shared/constants/genders';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  readonly genders = Object.values(Gender);
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;
  @ViewChild('top') top?: ElementRef<HTMLDivElement>;
  observer?: ResizeObserver;
  submitting = false;
  gettingSettings = true;
  settingsForm = new FormGroup({
    isDarkMode: new FormControl(false),
    discoverable: new FormControl(false),
    considerPolitics: new FormControl(true),
    considerGender: new FormControl(true),
    reversedPoliticalView: new FormControl(false),
    preferredGender: new FormControl([]),
    maxDistance: new FormControl(5, [Validators.min(0), Validators.max(1000)]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private settingsService: SettingsService,
    private modalService: ModalService
  ) { }

  ngAfterViewInit(): void {
    this.observer = new ResizeObserver((entries) => {
      if (!(this.container && this.top)) return;
      let space = 0;
      entries.forEach((entry) => {
        space += entry.borderBoxSize[0].blockSize;
      });
      this.renderer.setStyle(this.container?.nativeElement, 'top', `${space}px`);
    });

    if (this.top) {
      this.observer.observe(this.top?.nativeElement);
    }
  }

  ngOnInit(): void {
    this.settingsService.getSettings().then((settings) => {
      this.settingsForm.setValue({
        isDarkMode: settings.isDarkMode,
        discoverable: settings.discoverable,
        considerPolitics: settings.considerPolitics,
        considerGender: settings.considerGender,
        reversedPoliticalView: settings.reversedPoliticalView,
        preferredGender: settings.preferredGender,
        maxDistance: settings.maxDistance,
      });
      this.gettingSettings = false;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    const isDarkMode = this.settingsForm.get('isDarkMode');
    const discoverable = this.settingsForm.get('discoverable');
    const considerPolitics = this.settingsForm.get('considerPolitics');
    const considerGender = this.settingsForm.get('considerGender');
    const reversedPoliticalView = this.settingsForm.get('reversedPoliticalView');
    const preferredGender = this.settingsForm.get('preferredGender');
    const maxDistance = this.settingsForm.get('maxDistance');

    if (
      this.settingsForm.valid &&
      this.settingsForm.dirty &&
      isDarkMode &&
      discoverable &&
      considerPolitics &&
      considerGender &&
      reversedPoliticalView &&
      preferredGender &&
      maxDistance
    ) {
      this.submitting = true;
      this.settingsService
        .setSettings({
          isDarkMode: isDarkMode.value,
          discoverable: discoverable.value,
          considerPolitics: considerPolitics.value,
          considerGender: considerGender.value,
          reversedPoliticalView: reversedPoliticalView.value,
          preferredGender: preferredGender.value,
          maxDistance: maxDistance.value,
        })
        .catch((e) => {
          this.modalService.showAlert(e as string);
        })
        .finally(() => {
          this.submitting = false;
          this.onBack();
        });
    } else {
      this.modalService.showAlert('Please fill out all fields');
    }
  }


  darkmodeChange(e: Event) {
    // change body class
    if ((e.target as HTMLInputElement).checked) {
      document.body.classList.add('darkmode');
    } else {
      document.body.classList.remove('darkmode');
    }
  }
}
