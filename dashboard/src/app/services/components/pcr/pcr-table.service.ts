import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PCRTuple } from '../../../models/db-response.model';
import { Column, ColumnDetails } from '../../../models/tabular/column.model';
import { PcrService } from '../../db/pcr.service';

@Injectable({
  providedIn: 'root',
})
export class PcrTableService {
  constructor(private pcrService: PcrService) {}

  getRows(): Observable<{}[]> {
    return from(this.getJsonData());
  }

  getColumns(): Observable<{}> {
    return this.getTableHeaders().pipe(
      map((headers: string[][]) => {
        return headers.map((header: string[]) => {
          const tableHeaderDetails: ColumnDetails = {
            type: header[1],
            title: header[0].toUpperCase(),
          };
          return { [header[0]]: tableHeaderDetails };
        });
      }),
      map((headerObjArr: Column[]) => {
        const tempCols = {};
        headerObjArr.forEach((col) => {
          const key = Object.keys(col)[0];
          const val = Object.values(col)[0];
          tempCols[key] = val;
        });
        return tempCols;
      }),
    );
  }

  private getTableHeaders(): Observable<string[][]> {
    return from(this.pcrService.getTableHeaders());
  }

  private async getJsonData(): Promise<{}[]> {
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
