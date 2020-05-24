import { Injectable } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxCsvParser } from 'ngx-csv-parser';
import { from, Observable } from 'rxjs';
import { SCHEMA_VER } from '../../../@core/data/pschema:pcrs:v8';
import { PCRTuple, PCRTupleRev, PSchemaDoc } from '../../../models/db-response.model';
import { PcrService } from '../../db/pcr.service';
import { TabularService } from '../tabular/tabular.service';

@Injectable({
  providedIn: 'root',
})
export class PcrTableService extends TabularService {

  constructor(private pcrService: PcrService, private ngxCsvParser: NgxCsvParser) {
    super();
  }

  protected getTableHeaders(): Observable<string[][]> {
    return from(this.pcrService.getTableHeaders());
  }

  protected async getJsonData(): Promise<{}[]> {
    try {
      const tableHeaders = await this.pcrService.getTableHeaders();
      const columnsData = await this.pcrService.getAllDistricts();
      return columnsData.map((item: PCRTupleRev) => {
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

  enableDBToTableSync(source: LocalDataSource) {
    super.enableDBToTableSyncTabular(source, this.pcrService);
  }

  prepareNewTableRow(fields: PCRTuple, docRev: string) {
    return super.prepareNewTableRowTabular(fields, docRev, this.pcrService);
  }

  prepareDoc(newRow: any, removeRev = false): PSchemaDoc {
    return super.prepareDocTabular(newRow, SCHEMA_VER, this.pcrService, removeRev);
  }

  saveTableRowChanges(oldRow: any, newRow: any) {
    super.saveTableRowChangesTabular(oldRow, newRow, SCHEMA_VER, this.pcrService);
  }

  saveTableRowAddition(newRow: any) {
    super.saveTableRowAdditionTabular(newRow, SCHEMA_VER, this.pcrService);
  }

  saveTableRowDeletion(deletedRow: any) {
    super.saveTableRowDeletionTabular(deletedRow, SCHEMA_VER, this.pcrService);
  }

}
