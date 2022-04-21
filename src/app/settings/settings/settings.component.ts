import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;
  @ViewChild('top') top?: ElementRef<HTMLDivElement>;
  observer?: ResizeObserver;
  submitting = false;
  gettingSettings = true;
  settingsForm = new FormGroup({
    isDarkMode: new FormControl(false),
    discoverable: new FormControl(false),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private settingsService: SettingsService,
    private modalService: ModalService
  ) {}

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

    if (this.settingsForm.valid && this.settingsForm.dirty && isDarkMode && discoverable) {
      this.submitting = true;
      this.settingsService
        .setSettings({ isDarkMode: isDarkMode.value, discoverable: discoverable.value })
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
}
