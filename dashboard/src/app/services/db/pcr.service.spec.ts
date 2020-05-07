import { TestBed } from '@angular/core/testing';

import { PcrService } from './pcr.service';

describe('PcrService', () => {
  let service: PcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
