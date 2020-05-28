import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import 'style-loader!leaflet/dist/leaflet.css';
import { MapUtilsService } from '../../../services/components/map/map-utils.service';
import { RegionService } from '../../../services/components/map/region.service';
import {
  GovDistrictProperties,
  FeatureCollection,
  GovProvinceProperties,
  DryPortProperties,
  RoadAllProperties,
  RoadMajorProperties,
  SettlementProperties,
} from '../../../models/domain.model';


@Component({
  selector: 'ngx-leaflet',
  styleUrls: ['./nation.component.scss'],
  templateUrl: './nation.component.html',
})
export class NationComponent implements OnInit, OnDestroy {

  title = 'National Map';

  private componentAlive = false;

  loading = true;

  private map: L.Map;
  private mapReady: Subject<Boolean> = new Subject();

  layersControl: any;

  options = {
    layers: [this.mapUtilsService.openStreetMaps],
    zoom: 7,
    crs: L.CRS.EPSG3857,
    center: L.latLng({ lat: 27.700769, lng: 85.300140 }),
    zoomControl: true,
    preferCanvas: false,
  };

  constructor(private mapUtilsService: MapUtilsService, private regionService: RegionService) {}

  ngOnInit() {
    this.componentAlive = true;

    this.layersControl = { ...this.mapUtilsService.baseLayers, overlays: {}};

    this.regionService.getAndCache<FeatureCollection<GovProvinceProperties>>('gov_provinces')
      .subscribe(provinces => {
        this.layersControl.overlays['Provinces'] = L.geoJSON(provinces as any);
      });

    this.regionService.getAndCache<FeatureCollection<GovDistrictProperties>>('gov_districts')
      .subscribe(districts => {
        this.layersControl.overlays['Districts'] = L.geoJSON(districts as any);
      });

    this.regionService.getAndCache<FeatureCollection<RoadAllProperties>>('roads_all')
      .subscribe(allRoads => {
        this.layersControl.overlays['All Roads'] = L.geoJSON(allRoads as any);
      });

    this.regionService.getAndCache<FeatureCollection<RoadMajorProperties>>('roads_major')
      .subscribe(majorRoads => {
        this.layersControl.overlays['Major Roads'] = L.geoJSON(majorRoads as any);
      });

    this.regionService.getAndCache<FeatureCollection<DryPortProperties>>('dryports')
      .subscribe(dryPorts => {
        this.layersControl.overlays['Dry Ports'] = L.geoJSON(dryPorts as any);
      });
  }

  ngOnDestroy() {
    this.componentAlive = false;
    this.map.remove();
  }

  onMapReady(currentMap: L.Map) {
    this.map = currentMap;
    this.mapUtilsService.fullScreenControl.addTo(this.map);
    this.mapReady.next(true);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }
}
