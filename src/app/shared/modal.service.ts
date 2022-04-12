import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

export interface ModalOptions {
  title: string;
  message: string;
  confirmText: string;
  type: 'alert' | 'info' | 'success';
  centered?: boolean;
  cancelText?: string;
  callBack: (eventType: 'CANCEL' | 'OK') => void | any;
}

export interface ModalState {
  show: boolean;
  options: ModalOptions;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showModal = new EventEmitter<ModalState>();

  constructor() {}

  public getShowModal() {
    return this.showModal;
  }

  public show(options: ModalOptions): void {
    this.showModal.emit({ show: true, options });
  }

  public hide(): void {
    this.showModal.emit({
      show: false,
      options: {
        cancelText: '',
        confirmText: '',
        message: '',
        title: '',
        type: 'info',
        callBack: this.voidCallback,
      },
    });
  }

  public showAlert(
    message: string,
    title: string = 'Error',
    confirmText: string = 'Ok',
    callBack = this.voidCallback
  ): void {
    this.show({ title, message, confirmText, type: 'alert', callBack });
  }

  public showInfo(
    message: string,
    title: string = 'Info',
    confirmText: string = 'Ok',
    callBack = this.voidCallback
  ): void {
    this.show({ title, message, confirmText, type: 'info', callBack });
  }

  public showSuccess(
    message: string,
    title: string = 'Success',
    confirmText: string = 'Ok',
    callBack = this.voidCallback
  ): void {
    this.show({ title, message, confirmText, type: 'success', callBack });
  }

  private voidCallback(eventType: 'CANCEL' | 'OK'): void {}
}
