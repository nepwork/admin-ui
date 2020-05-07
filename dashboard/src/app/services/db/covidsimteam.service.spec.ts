import { TestBed } from '@angular/core/testing';

import { CovidsimteamService } from './covidsimteam.service';

describe('CovidsimteamService', () => {
  let service: CovidsimteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidsimteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
