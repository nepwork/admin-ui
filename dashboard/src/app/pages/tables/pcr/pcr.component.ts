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
    this.pcrTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      delete cols['id'];
      this.settingsAndColumns = { ...this.settingsAndColumns, columns: cols };
    });

    this.pcrTableService.getRows().subscribe(rows => {
      this.source.load(rows);
    });
  }

  private xTrim(str: string | number) { if (str && typeof str === 'string') return str.trim(); }

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
                this.xTrim(rowData[index]) :
                `province:${this.xTrim(rowData[0])}:district:${this.xTrim(rowData[1])}`;
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
    // TODO remove table rows added by the file upload
  }

  uploadConfirmListener($event: any) {
    $event.preventDefault();
    // TODO send the current uploaded file's rows to the db using this.rowsFromCsvFile
    // It remains in sync with the changes in the table i.e. this.source
    // because of passing of the of the copy of the same reference as value
  }

  saveAllListener($event) {
    $event.preventDefault();
    // TODO send the entire table content i.e. this.source.getAll() as a bulk insert to remote directly
    // TODO also enable the event listeners to update the data in the local db
    // so that it syncs with remote in the background
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Confirm PCR test record deletion:')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
