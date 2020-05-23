import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { settings } from '../../../models/tabular/settings.values';
import { PcrTableService } from '../../../services/components/pcr/pcr-table.service';
import { PcrService } from '../../../services/db/pcr.service';
import { PCRTuple } from '../../../models/db-response.model';


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

    // TODO add autocomplete for province and district names
    // https://akveo.github.io/ng2-smart-table/#/documentation editor.config.completer.data

    this.enableDBToTableSync();
  }

  private initializeHeadersAndSettings() {
    this.pcrTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      const colsWithoutIdRev = { ...cols };
      delete colsWithoutIdRev['_id'];
      delete colsWithoutIdRev['_rev'];
      this.settingsAndColumns = { ...this.settingsAndColumns, columns: colsWithoutIdRev };
    });
  }

  private enableDBToTableSync() {
    this.pcrService.getChangeListener().subscribe((emitted: any) => {
      if (emitted && emitted.change && emitted.change.docs) {
        emitted.change.docs.forEach((doc: any) => {
          if (doc._deleted) {
            this.findAndRemoveFromTable(doc._id);
          } else {
            const newRow = this.prepareNewTableRow(doc.fields, doc._rev);
            this.findAndRemoveFromTable(doc._id);
            this.source.prepend(newRow);
          }
        });
      }
    });
  }

  private prepareNewTableRow(fields: PCRTuple, docRev: string) {
    const newDoc = {};
    this.pcrService.headers
      .map(headerAndTypeArr => headerAndTypeArr[0])
      .forEach((header, index) => {
        newDoc[header] = index < fields.length ? fields[index] : docRev;
      });
    return newDoc;
  }

  private findAndRemoveFromTable(docId: string) {
    this.source.getAll().then((elems: []) => {
      // FIXME this will not scale well for large table sizes, not expected for current use cases
      const rowToDelete = elems.filter(row => row['_id'] === docId ||
                                  this.pcrTableService.preparePCRSDocID(row['province'], row['district']) === docId)[0];
      this.source.remove(rowToDelete);
    })
    .catch(err => {

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
                this.pcrTableService.preparePCRSDocID(rowData[0], rowData[1]);
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
      console.error('PcrComponent -> onAddConfirm -> error', error);
      event.confirm.reject();
    }
  }

  onEditConfirm(event: any) {
    try {
      this.pcrTableService.saveTableRowChanges(event.data, event.newData);
      event.confirm.resolve();
    } catch (error) {
      console.error('PcrComponent -> onEditConfirm -> error', error);
      event.confirm.reject();
    }
  }

  onDeleteConfirm(event: any) {
    if (window.confirm('Confirm PCR test record deletion:')) {
      this.pcrTableService.saveTableRowDeletion(event.data);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
