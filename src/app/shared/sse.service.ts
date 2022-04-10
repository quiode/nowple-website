import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private authService: AuthService) { }

  observeMessages(url: string): Observable<string> {
    return new Observable(observer => {
      const eventSource = new EventSource(url, { withCredentials: false });
      eventSource.addEventListener('message', (event) => {
        observer.next(event.data);
      });
      eventSource.addEventListener('error', (event) => {
        observer.error(event);
      });
      // return () => eventSource.close();
    });
  }
}
