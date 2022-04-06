import { Injectable } from '@angular/core';

export interface Settings {
  id: number,
  isDarkMode: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }
}
