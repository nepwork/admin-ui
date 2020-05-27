import { Injectable } from '@angular/core';
import { ReturneeService } from '../../db/returnee.service';
import { RdtService } from '../../db/rdt.service';
import { PcrService } from '../../db/pcr.service';
import { SpatialService } from '../../db/spatial.service';
import { from, ObservableInput, Observable } from 'rxjs';
import { FeatureCollection } from '../../../models/domain.model';

@Injectable({
  providedIn: 'root',
})
export class RegionService {

  constructor(
    private returneeService: ReturneeService,
    private rdtService: RdtService,
    private pcrService: PcrService,
    private spatialService: SpatialService,
    ) { }


  getEmblemAnimGeoJson(): Observable<FeatureCollection> {
    return from<ObservableInput<FeatureCollection>>(this.spatialService.get('cst_emblem_animation'));
  }

}
