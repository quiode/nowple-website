import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

export interface ModalOptions {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type: 'alert' | 'info' | 'success';
  centered?: boolean;
}

export interface ModalState {
  show: boolean;
  options: ModalOptions;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showModal = new EventEmitter<ModalState>();

  constructor() {
  }

  public getShowModal() {
    return this.showModal;
  }

  public show(options: ModalOptions): void {
    this.showModal.emit({ show: true, options });
  }

  public hide(): void {
    this.showModal.emit({ show: true, options: { cancelText: '', confirmText: '', message: '', title: '', type: 'info' } });
  }
}
