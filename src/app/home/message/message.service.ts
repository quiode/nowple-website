import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, tap } from 'rxjs';
import { GeneralService } from '../../shared/general.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient, private generalService: GeneralService) {
  }

  async getPublicProfilePicture(id: string): Promise<string> {
    return this.generalService.blobRequestToDataUrl(
      this.httpClient.get(environment.backendUrl + '/user/profilePicture/' + id, { responseType: 'blob' })
    );
  }
}
