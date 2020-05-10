import { TestBed } from '@angular/core/testing';

import { CovidSimTeamService } from './covidsimteam.service';

describe('CovidSimTeamService', () => {
  let service: CovidSimTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidSimTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
