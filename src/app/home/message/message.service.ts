import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GeneralService } from '../../shared/general.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient, private generalService: GeneralService, private authService: AuthService) {
  }

  async getPublicProfilePicture(id: string): Promise<string> {
    return this.generalService.blobRequestToDataUrl(
      this.httpClient.get(environment.backendUrl + '/user/profilePicture/' + id, { responseType: 'blob' })
    );
  }
}
