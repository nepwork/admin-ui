import { TestBed } from '@angular/core/testing';

import { TxStateMachineStreamService } from './tx-state-machine-stream.service';

describe('TxStateMachineStreamService', () => {
  let service: TxStateMachineStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TxStateMachineStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
