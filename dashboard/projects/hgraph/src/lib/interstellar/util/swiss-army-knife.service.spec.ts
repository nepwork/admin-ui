import { TestBed } from '@angular/core/testing';

import { SwissArmyKnifeService } from './swiss-army-knife.service';

describe('SwissArmyKnifeService', () => {
  let service: SwissArmyKnifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwissArmyKnifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
