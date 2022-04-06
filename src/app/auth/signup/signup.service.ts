import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

export interface SignUpData {
  data1?: FormData1;
  data2?: FormData2;
  data3?: FormData3;
};

export interface FormData1 {
  username: string;
  password: string;
}

export interface FormData2 {
  economic: number;
  diplomatic: number;
  civil: number;
  society: number;
}

export interface FormData3 {
  darkmode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signUpData: SignUpData = {};

  constructor(private authService: AuthService) {
  }

  async submit() {
    if (this.signUpData.data1 && this.signUpData.data2 && this.signUpData.data3) {
      return this.authService.signUp(this.signUpData);
    } else {
      return Promise.reject('Data not complete');
    }
  }

  set1(data: FormData1) {
    this.signUpData = { ...this.signUpData, data1: data };
  }

  set2(data: FormData2) {
    this.signUpData = { ...this.signUpData, data2: data };
  }

  set3(data: FormData3) {
    this.signUpData = { ...this.signUpData, data3: data };
  }
}
