import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnDetails, Column } from '../../../models/tabular/column.model';

export abstract class TabularService {

  constructor() { }

  protected abstract getTableHeaders(): Observable<string[][]>;
  protected abstract async getJsonData(): Promise<{}[]>;

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
}
