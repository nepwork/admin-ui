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
  rowsReplacedByCsvFile: {}[] = [];

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
          // db headers contain _id and _rev fields as well
          if (rowData.length !== this.pcrService.headers.length - 2) throw Error('Invalid number of columns');
          const rowObj = {};
          this.pcrService.headers.forEach((header, index) => {
            rowObj[header[0]] =
              index !== 0 ?
                this.pcrTableService.xTrim(rowData[index - 1], false) :
                this.pcrTableService.prepareDocID(rowData[0], rowData[1]);
          });
          this.csvRowAndExistingRowMerger(rowObj);
          return rowObj;
        });
      }, (_: NgxCSVParserError) => {
        window.alert('Please upload a valid comma separated file with ');
      });
  }

  csvRowAndExistingRowMerger(rowObj: {}) {
    this.source.getAll().then((elements: []) => {
      const rowsToDelete = elements.filter(row =>
                            row['_id'] === rowObj['_id'] ||
                            this.pcrTableService
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
        this.pcrTableService.getCsvDataFile();
        return;
      }
      this.pcrService.addAll(this.rowsFromCsvFile.map(row => this.pcrTableService.prepareDoc(row)));
      this.isFileLoaded = false;
      this.fileImportInput.nativeElement.value = '';
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
