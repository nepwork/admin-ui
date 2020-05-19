import { Injectable } from '@angular/core';
import { ReturneeService } from '../db/returnee.service';
import { RdtService } from '../db/rdt.service';
import { PcrService } from '../db/pcr.service';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(
    private returneeService: ReturneeService,
    private rdtService: RdtService,
    private pcrService: PcrService,
    ) { }


}
