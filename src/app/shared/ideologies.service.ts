import { Injectable } from '@angular/core';
import { ideologies } from './constants/ideologies';

@Injectable({
  providedIn: 'root',
})
export class IdeologiesService {
  constructor() {}

  getIdeologies() {
    return ideologies;
  }

  // ? Test this
  calculateIdeology(stats: {
    econ: number;
    dipl: number;
    govt: number;
    scty: number;
  }): string | undefined {
    return ideologies.find((ideology) => {
      return (
        ideology.stats.econ <= stats.econ &&
        ideology.stats.econ + 10 >= stats.econ &&
        ideology.stats.dipl <= stats.dipl &&
        ideology.stats.dipl + 10 >= stats.dipl &&
        ideology.stats.govt <= stats.govt &&
        ideology.stats.govt + 10 >= stats.govt &&
        ideology.stats.scty <= stats.scty &&
        ideology.stats.scty + 10 >= stats.scty
      );
    })?.name;
  }
}
