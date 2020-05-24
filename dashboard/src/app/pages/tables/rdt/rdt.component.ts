import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { settings } from '../../../models/tabular/settings.values';
import { RdtTableService } from '../../../services/components/rdt/rdt-table.service';
import { RdtService } from '../../../services/db/rdt.service';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';

@Component({
  selector: 'ngx-rdt',
  templateUrl: './rdt.component.html',
  styleUrls: ['./rdt.component.scss'],
})
export class RdtComponent implements OnInit {

  columns: {};
  settingsAndColumns = settings;

  isFileLoaded = false;

  source: LocalDataSource = new LocalDataSource();

  rowsFromCsvFile: {}[] = [];

  @ViewChild('fileImportInput') fileImportInput: ElementRef;

  constructor(
    private rdtTableService: RdtTableService,
    private rdtService: RdtService,
    private ngxCsvParser: NgxCsvParser,
  ) {}

  ngOnInit() {
    this.initializeHeadersAndSettings();

    // table contents init
    this.rdtTableService.getRows().subscribe(rows => {
      this.source.load(rows);
    });

    this.rdtTableService.enableDBToTableSync(this.source);
  }

  private initializeHeadersAndSettings() {
    this.rdtTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      const colsWithoutIdRev = { ...cols };
      delete colsWithoutIdRev['_id'];
      delete colsWithoutIdRev['_rev'];
      if (cols['province']) {
        cols['province']['editor'] = cols['province']['filter'] = this.rdtTableService.prepareProvinceDropdown();
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
          this.rdtService.headers.forEach((header, index) => {
            rowObj[header[0]] =
              index !== 0 ?
                this.rdtTableService.xTrim(rowData[index]) :
                this.rdtTableService.prepareDocID(rowData[0], rowData[1]);
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
      this.rdtService.addAll(this.rowsFromCsvFile);
    } catch (error) {
      // TODO report the docs that failed to insert as a list under the file upload card
    }
  }

  onAddConfirm(event: any) {
    try {
      this.rdtTableService.saveTableRowAddition(event.newData);
      event.confirm.resolve();
    } catch (error) {
      event.confirm.reject();
    }
  }

  onEditConfirm(event: any) {
    try {
      this.rdtTableService.saveTableRowChanges(event.data, event.newData);
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

  onDeleteConfirm(event: any): void {
    if (window.confirm('Confirm RDT test record deletion:')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
