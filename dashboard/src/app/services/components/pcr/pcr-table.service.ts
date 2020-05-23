import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PCRTuple } from '../../../models/db-response.model';
import { Column, ColumnDetails } from '../../../models/tabular/column.model';
import { PcrService } from '../../db/pcr.service';
import { TabularService } from '../tabular/tabular.service';

@Injectable({
  providedIn: 'root',
})
export class PcrTableService extends TabularService {

  constructor(private pcrService: PcrService) {
    super();
  }

  protected getTableHeaders(): Observable<string[][]> {
    return from(this.pcrService.getTableHeaders());
  }

  protected async getJsonData(): Promise<{}[]> {
    try {
      const tableHeaders = await this.pcrService.getTableHeaders();
      const columnsData = await this.pcrService.getAllDistricts();
      return columnsData.map((item: PCRTuple) => {
        const columnObj = {};
        tableHeaders.forEach((header, index) => {
          columnObj[header[0]] = item[index];
        });
        return columnObj;
      });
    } catch (error) {
      throw Error('Unable to fetch PCR tests data');
    }
  }
}
