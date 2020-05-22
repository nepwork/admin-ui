import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';

import { Column } from '../../../models/tabular/column.model';
import { settings } from '../../../models/tabular/settings.values';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit {

  columns: Column[];
  settingsAndColumns = settings;

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {}

  ngOnInit() {
    const data = this.service.getData();
    this.source.load(data);
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
