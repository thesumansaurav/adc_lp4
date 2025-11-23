import { TestBed } from '@angular/core/testing';

import { PinServiceService } from './pin-service.service';

describe('PinServiceService', () => {
  let service: PinServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
