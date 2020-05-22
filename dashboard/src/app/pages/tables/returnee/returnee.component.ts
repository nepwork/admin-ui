import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';

import { Column } from '../../../models/tabular/column.model';
import { settings } from '../../../models/tabular/settings.values';


@Component({
  selector: 'ngx-returnee',
  templateUrl: './returnee.component.html',
  styleUrls: ['./returnee.component.scss'],
})
export class ReturneeComponent implements OnInit {

  columns: Column[];
  columnsAndSetting = settings;

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {}

  ngOnInit(): void {
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
