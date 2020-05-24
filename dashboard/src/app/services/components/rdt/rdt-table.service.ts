import { Injectable } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxCsvParser } from 'ngx-csv-parser';
import { from, Observable } from 'rxjs';
import { SCHEMA_VER } from '../../../@core/data/pschema:rdts:v8';
import { PSchemaDoc, RDTTuple, RDTTupleRev } from '../../../models/db-response.model';
import { RdtService } from '../../db/rdt.service';
import { TabularService } from '../tabular/tabular.service';

@Injectable({
  providedIn: 'root',
})
export class RdtTableService extends TabularService {

  constructor(private rdtService: RdtService, private ngxCsvParser: NgxCsvParser) {
    super();
  }

  protected getTableHeaders(): Observable<string[][]> {
    return from(this.rdtService.getTableHeaders());
  }

  protected async getJsonData(): Promise<{}[]> {
    try {
      const tableHeaders = await this.rdtService.getTableHeaders();
      const columnsData = await this.rdtService.getAllDistricts();
      return columnsData.map((item: RDTTupleRev) => {
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

  enableDBToTableSync(source: LocalDataSource) {
    super.enableDBToTableSyncTabular(source, this.rdtService);
  }

  prepareNewTableRow(fields: RDTTuple, docRev: string) {
    return super.prepareNewTableRowTabular(fields, docRev, this.rdtService);
  }

  prepareDoc(newRow: any, removeRev = false): PSchemaDoc {
    return super.prepareDocTabular(newRow, SCHEMA_VER, this.rdtService, removeRev);
  }

  saveTableRowChanges(oldRow: any, newRow: any) {
    super.saveTableRowChangesTabular(oldRow, newRow, SCHEMA_VER, this.rdtService);
  }

  saveTableRowAddition(newRow: any) {
    super.saveTableRowAdditionTabular(newRow, SCHEMA_VER, this.rdtService);
  }

  saveTableRowDeletion(deletedRow: any) {
    super.saveTableRowDeletionTabular(deletedRow, SCHEMA_VER, this.rdtService);
  }
}
