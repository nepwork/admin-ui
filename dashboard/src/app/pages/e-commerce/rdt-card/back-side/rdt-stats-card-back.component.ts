import { Component, OnDestroy } from '@angular/core';
import { StatsBarData } from '../../../../@core/data/stats-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-rdt-stats-card-back',
  styleUrls: ['./rdt-stats-card-back.component.scss'],
  templateUrl: './rdt-stats-card-back.component.html',
})
export class RdtStatsCardBackComponent implements OnDestroy {

  private alive = true;

  chartData: number[];

  constructor(private statsBarData: StatsBarData) {
    this.statsBarData.getStatsBarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.chartData = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
