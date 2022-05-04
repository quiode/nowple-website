import { Gender } from '../constants/genders';
export interface Settings {
  id?: number;
  isDarkMode: boolean;
  discoverable: boolean;
  considerPolitics: boolean;
  considerGender: boolean;
  reversedPoliticalView: boolean;
  preferredGender: Gender[];
  maxDistance: number;
}
