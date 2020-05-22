import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { settings } from '../../../models/tabular/settings.values';
import { PcrTableService } from '../../../services/components/pcr/pcr-table.service';


@Component({
  selector: 'ngx-pcr',
  templateUrl: './pcr.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./pcr.component.scss'],
})
export class PcrComponent implements OnInit {

  columns: {};
  settingsAndColumns = settings;

  source: LocalDataSource = new LocalDataSource();

  constructor(private pcrTableService: PcrTableService) {}

  ngOnInit() {
    this.pcrTableService.getColumns().subscribe(cols => {
      this.columns = cols;
      this.settingsAndColumns = { ...this.settingsAndColumns, columns: this.columns };
    });

    this.pcrTableService.getRows().subscribe(rows => {
      this.source.load(rows);
    });
  }

  onDeleteConfirm(event: any): void {
    if (window.confirm('Confirm PCR test record deletion:')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
