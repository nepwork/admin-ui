import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { PCRTupleRev, PCRSPSchema } from '../../../models/db-response.model';
import { PcrService } from '../../db/pcr.service';
import { TabularService } from '../tabular/tabular.service';
import { PCRS_SCHEMA_VER } from '../../../@core/data/pschema:pcrs:v8';
import { ExistingDoc } from '../../../models/domain.model';

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


  xTrim(str: string | number) { if (str && typeof str === 'string') return str.trim().replace(/ /g, '_'); }

  preparePCRSDoc(newRow: any) {
    const pcrsDoc: PCRSPSchema = {
      _id: newRow._id,
      _rev: newRow._rev,
      pschema: PCRS_SCHEMA_VER,
      fields: [],
    };
    // newest _rev is fetched again before updating db if using PouchDBServce->update or delete method
    // but not when using PouchDBServce->create or addAll method.

    this.pcrService.headers.map(headerAndType => headerAndType[0]).forEach((header) => {
      pcrsDoc.fields.push(newRow[header]);
    });

    // TODO update this iif schema changes to not having province and district first in the row
    pcrsDoc._id = pcrsDoc.fields[0] = pcrsDoc._id
                || this.preparePCRSDocID(pcrsDoc.fields[1], pcrsDoc.fields[2]);

    if (!pcrsDoc._rev) delete pcrsDoc._rev;

    return pcrsDoc;
  }

  preparePCRSDocID(province: string, district: string) {
    return `province:${this.xTrim(province)}:district:${this.xTrim(district)}`;
  }

  saveTableRowChanges(oldRow: any, newRow: any) {
    if (oldRow.province !== newRow.province || oldRow.district !== newRow.district) {
      // delete old row data as _id is compounded using district and province
      this.pcrService.delete(this.preparePCRSDoc(oldRow) as ExistingDoc);
    }
    this.pcrService.update(this.preparePCRSDoc(newRow) as ExistingDoc);
  }

  saveTableRowAddition(newRow: any) {
    this.pcrService.create(this.preparePCRSDoc(newRow) as ExistingDoc);
  }

  saveTableRowDeletion(deletedRow: any) {
    this.pcrService.delete(this.preparePCRSDoc(deletedRow) as ExistingDoc);
  }
}
