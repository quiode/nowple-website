import { User } from './User';
import { Message } from './Message';

export interface Chat {
  user: User;
  lastMessage?: Message;
  isMatch?: boolean;
  isPending?: boolean;
}
