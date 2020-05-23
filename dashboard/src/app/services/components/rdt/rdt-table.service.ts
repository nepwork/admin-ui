import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { RdtService } from '../../db/rdt.service';
import { TabularService } from '../tabular/tabular.service';
import { RDTTuple } from '../../../models/db-response.model';

@Injectable({
  providedIn: 'root',
})
export class RdtTableService extends TabularService {

  constructor(private rdtService: RdtService) {
    super();
  }

  protected getTableHeaders(): Observable<string[][]> {
    return from(this.rdtService.getTableHeaders());
  }

  protected async getJsonData(): Promise<{}[]> {
    try {
      const tableHeaders = await this.rdtService.getTableHeaders();
      const columnsData = await this.rdtService.getAllDistricts();
      return columnsData.map((item: RDTTuple) => {
        const columnObj = {};
        tableHeaders.forEach((header, index) => {
          columnObj[header[0]] = item[index];
        });
        return columnObj;
      });
    } catch (error) {
      throw Error('Unable to fetch RDT tests data');
    }
  }
}
