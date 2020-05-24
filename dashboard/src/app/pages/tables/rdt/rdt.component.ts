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
  rowsReplacedByCsvFile: {}[] = [];

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
          // db headers contain _id and _rev fields as well
          if (rowData.length !== this.rdtService.headers.length - 2) throw Error('Invalid number of columns');
          const rowObj = {};
          this.rdtService.headers.forEach((header, index) => {
            rowObj[header[0]] =
              index !== 0 ?
                this.rdtTableService.xTrim(rowData[index - 1], false) :
                this.rdtTableService.prepareDocID(rowData[0], rowData[1]);
          });
          this.csvRowAndExistingRowMerger(rowObj);
          return rowObj;
        });
      }, (_: NgxCSVParserError) => {
        window.alert('Your CSV file could not be parsed, please upload a valid file');
      });
  }

  csvRowAndExistingRowMerger(rowObj: {}) {
    this.source.getAll().then((elements: []) => {
      const rowsToDelete = elements.filter(row =>
                            row['_id'] === rowObj['_id'] ||
                            this.rdtTableService
                              .prepareDocID(row['province'], row['district']) === rowObj['_id']);
      this.rowsReplacedByCsvFile = [...this.rowsReplacedByCsvFile, ...rowsToDelete];
      rowsToDelete.forEach(rowToDelete => this.source.remove(rowToDelete));
      this.source.prepend(rowObj);
    });
  }

  resetHandler($event: any) {
    $event.preventDefault();
    this.fileImportInput.nativeElement.value = '';
    this.isFileLoaded = false;
    this.rowsFromCsvFile.forEach(row => this.source.remove(row));
    this.rowsReplacedByCsvFile.forEach(row => this.source.prepend(row));
  }

  uploadDownloadHandler($event: any) {
    $event.preventDefault();
    try {
      if (!this.isFileLoaded) {
        this.rdtTableService.getCsvDataFile();
        return;
      }
      this.rdtService.addAll(this.rowsFromCsvFile.map(row => this.rdtTableService.prepareDoc(row)));
      this.isFileLoaded = false;
      this.fileImportInput.nativeElement.value = '';
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
