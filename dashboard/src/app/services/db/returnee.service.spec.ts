import { TestBed } from '@angular/core/testing';

import { ReturneeService } from './returnee.service';

describe('ReturneeService', () => {
  let service: ReturneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
