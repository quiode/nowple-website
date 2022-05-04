import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Settings } from '../shared/classes/Settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private httpClient: HttpClient) { }

  async getSettings(): Promise<Settings> {
    return new Promise<Settings>((resolve, reject) => {
      this.httpClient.get<Settings>(environment.backendUrl + '/settings').subscribe({
        next: (settings) => {
          localStorage.setItem('darkmode', settings.isDarkMode ? 'true' : 'false');
          resolve(settings);
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    });
  }

  async setSettings(settings: Settings): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const { id, ...settingsBody } = settings;
      this.httpClient.patch<void>(environment.backendUrl + '/settings', settingsBody).subscribe({
        next: () => {
          resolve();
        },
        error: (err: HttpErrorResponse) => {
          reject(err.statusText);
        },
      });
    });
  }
}
