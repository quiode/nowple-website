import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewRef } from '@angular/core';
import { ModalService, ModalOptions, ModalState } from './shared/modal.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nowple';
  modalOptions: ModalState = { show: false, options: { cancelText: '', confirmText: '', message: '', title: '', type: 'info' } };
  @ViewChild('modalButton') modalButton?: ElementRef<HTMLButtonElement>;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.getShowModal().subscribe(state => {
      this.modalOptions = state;
      if (this.modalButton && state.show) {
        this.modalButton.nativeElement.click()
      }
    });
  }
}
