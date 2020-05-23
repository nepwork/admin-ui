import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { settings } from '../../../models/tabular/settings.values';
import { RdtTableService } from '../../../services/components/rdt/rdt-table.service';

@Component({
  selector: 'ngx-rdt',
  templateUrl: './rdt.component.html',
  styleUrls: ['./rdt.component.scss'],
})
export class RdtComponent implements OnInit {

  columns: {};
  settingsAndColumns = settings;

  csvUploadListener($event: any) {}

  uploadConfirmListener($event: any) {}

  source: LocalDataSource = new LocalDataSource();

  constructor(private rdtTableService: RdtTableService) {}

  ngOnInit() {
    this.rdtTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      this.settingsAndColumns = { ...this.settingsAndColumns, columns: this.columns };
    });

    this.rdtTableService.getRows().subscribe(rows => {
      this.source.load(rows);
    });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Confirm RDT test record deletion:')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
