import { TestBed } from '@angular/core/testing';

import { RdtService } from './rdt.service';

describe('RdtService', () => {
  let service: RdtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
