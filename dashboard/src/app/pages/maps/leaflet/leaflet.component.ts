import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import 'style-loader!leaflet/dist/leaflet.css';


@Component({
  selector: 'ngx-leaflet',
  styleUrls: ['./leaflet.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>Leaflet Maps</nb-card-header>
      <nb-card-body>
        <div leaflet
          [leafletOptions]="options"
          (leafletMapReady)="onMapReady($event)"
        >
        </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class LeafletComponent implements OnInit, OnDestroy {

  private componentAlive = false;

  private map: L.Map;
  private mapReady: Subject<Boolean> = new Subject();

  constructor() {}

  onMapReady(map: L.Map) {
    this.map = map;
    this.mapReady.next(true);
  }

  ngOnInit() {
    this.componentAlive = true;
    // merge(
    //   this.mapReady,
    //     this.wardsService.getAll()
    //     .pipe(takeWhile(() => this.componentAlive)),
    // )
    // .subscribe((featureCollection: FeatureCollection) => {
    //   L.geoJSON(featureCollection).addTo(this.map);
    // });
  }

  ngOnDestroy() {
    this.componentAlive = false;
  }

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 7,
    center: L.latLng({ lat: 27.700769, lng: 85.300140 }),
  };
}
