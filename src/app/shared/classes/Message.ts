export interface Message {
  id: number;
  message: String;
  time: string;
  isTopic: boolean;
  sender: { username: string; id: string };
  receiver: { username: string; id: string };
}
