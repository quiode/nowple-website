import { TestBed } from '@angular/core/testing';

import { IdeologiesService } from './ideologies.service';

describe('IdeologiesService', () => {
  let service: IdeologiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeologiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
