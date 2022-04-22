import { Settings } from './Settings';
import { Interests } from '../../profile/profile.service';
import { Message } from './Message';
import { Gender } from '../constants/genders';

export interface User {
  id: string;
  username: string;
  profilePicture: string;
  settings?: Settings;
  interests?: Interests;
  sentMessages?: Message[];
  receivedMessages?: Message[];
  matches?: User[];
  blocksOrDeclined?: User[];
  contacts?: User[];
  gender: Gender;
}
