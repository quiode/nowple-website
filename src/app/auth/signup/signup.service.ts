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
}

export interface FormData3 {
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signUpData: SignUpData = {};

  constructor(private authService: AuthService) {
  }

  submit() {
    if (this.signUpData.data1 && this.signUpData.data2 && this.signUpData.data3) {
      this.authService.signUp(this.signUpData);
    }
  }

  set1(data: FormData1) {
    this.signUpData = { data1: data };
  }

  set2(data: FormData2) {
    this.signUpData = { data2: data };
  }

  set3(data: FormData3) {
    this.signUpData = { data3: data };
  }
}
