import { TestBed } from '@angular/core/testing';

import { WardsService } from './wards.service';

describe('WardsService', () => {
  let service: WardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
