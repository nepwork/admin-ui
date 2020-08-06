import { TestBed } from '@angular/core/testing';

import { ModelingService } from './modeling.service';

describe('ModelingService', () => {
  let service: ModelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
