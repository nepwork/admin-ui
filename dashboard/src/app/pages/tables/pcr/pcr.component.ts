import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { settings } from '../../../models/tabular/settings.values';
import { PcrTableService } from '../../../services/components/pcr/pcr-table.service';
import { PcrService } from '../../../services/db/pcr.service';

@Component({
  selector: 'ngx-pcr',
  templateUrl: './pcr.component.html',
  styleUrls: ['./pcr.component.scss'],
})
export class PcrComponent implements OnInit {

  columns: {};
  settingsAndColumns = settings;

  isFileLoaded = false;

  source: LocalDataSource = new LocalDataSource();

  rowsFromCsvFile: {}[] = [];

  @ViewChild('fileImportInput') fileImportInput: ElementRef;

  constructor(
    private pcrTableService: PcrTableService,
    private pcrService: PcrService,
    private ngxCsvParser: NgxCsvParser,
    ) {}

  ngOnInit() {

    this.initializeHeadersAndSettings();

    // table contents init
    this.pcrTableService.getRows().subscribe(rows => {
      this.source.load(rows);
    });

    this.pcrTableService.enableDBToTableSync(this.source);
  }

  private initializeHeadersAndSettings() {
    this.pcrTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      const colsWithoutIdRev = { ...cols };
      delete colsWithoutIdRev['_id'];
      delete colsWithoutIdRev['_rev'];
      if (cols['province']) {
        cols['province']['editor'] = cols['province']['filter'] = this.pcrTableService.prepareProvinceDropdown();
      }
      this.settingsAndColumns = { ...this.settingsAndColumns, columns: colsWithoutIdRev };
    });
  }

  csvUploadListener(event: any) {
    const files = event.srcElement.files;
    this.isFileLoaded = files ? true : false;
    this.ngxCsvParser.parse(files[0], { header: false, delimiter: ',' })
      .subscribe((result: Array<any>) => {
        this.rowsFromCsvFile = result.slice(1).map(rowData => {
          const rowObj = {};
          this.pcrService.headers.forEach((header, index) => {
            rowObj[header[0]] =
              index !== 0 ?
                this.pcrTableService.xTrim(rowData[index]) :
                this.pcrTableService.prepareDocID(rowData[0], rowData[1]);
          });
          this.source.prepend(rowObj);
          return rowObj;
        });
      }, (_: NgxCSVParserError) => {
        window.alert('Your CSV file could not be parsed, please upload a valid file');
      });
  }

  resetHandler($event: any) {
    $event.preventDefault();
    this.fileImportInput.nativeElement.value = '';
    this.isFileLoaded = false;
    this.rowsFromCsvFile.forEach(row => { this.source.remove(row); });
  }

  uploadConfirmListener($event: any) {
    $event.preventDefault();
    try {
      this.pcrService.addAll(this.rowsFromCsvFile);
    } catch (error) {
      // TODO report the docs that failed to insert as a list under the file upload card
    }
  }

  onAddConfirm(event: any) {
    try {
      this.pcrTableService.saveTableRowAddition(event.newData);
      event.confirm.resolve();
    } catch (error) {
      event.confirm.reject();
    }
  }

  onEditConfirm(event: any) {
    try {
      this.pcrTableService.saveTableRowChanges(event.data, event.newData);
      event.confirm.resolve();
    } catch (error) {
      event.confirm.reject();
    }
  }

  // Potential use for floating map component showing district preview
  // (userRowSelect)="onUserRowSelect($event)"
  // onUserRowSelect(event: any) {
  //   console.log('user row select', event);
  // }

  onDeleteConfirm(event: any) {
    if (window.confirm('Confirm PCR test record deletion:')) {
      this.pcrTableService.saveTableRowDeletion(event.data);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
