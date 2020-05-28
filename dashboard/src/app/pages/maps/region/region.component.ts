import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Subject, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { RegionService } from '../../../services/components/map/region.service';
import { FeatureCollection, Area, Feature, WardProperties } from '../../../models/domain.model';
import { takeWhile } from 'rxjs/operators';
import polylabel from 'polylabel';

const attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const attributionWM = '© <a href="https://www.openstreetmap.org/copyright">Wikimedia Map</a> contributors';
const tileLayerPng = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileLayerWMPng = 'http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';

const tileLayerOptions = {
  attribution,
  detectRetina: false,
  maxNativeZoom: 18,
  maxZoom: 18,
  minZoom: 0,
  noWrap: false,
  opacity: 1,
  subdomains: 'abc',
  tms: false,
};

const defaultAreaKey = 'kathmandu_valley';

@Component({
  selector: 'ngx-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
})
export class RegionComponent implements OnInit, OnDestroy {
  region: string;
  type: string;

  loading = true;

  private componentAlive = true;

  private map: L.Map;
  private mapReady: BehaviorSubject<Boolean> = new BehaviorSubject(false);

  // TODO move to map-utils
  openStreetMaps = L.tileLayer(tileLayerPng, tileLayerOptions);
  wikimediaMaps = L.tileLayer(tileLayerWMPng, { ...tileLayerOptions, attribution: attributionWM});

  private geoJsonLayerOptions = {
    onEachFeature: (_: any, layer: L.Layer) => {
      const thisMap = this.map;
      layer.on({
        click: (e) => {
          thisMap.fitBounds(e.target.getBounds());
        },
      });
    },
  };

  // TODO move to map-utils
  private fullscreenControl = L.control.fullscreen({
    position: 'topleft',
    title: 'Enter Fullscreen',
    titleCancel: 'Exit Fullscreen',
    content: null,
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
    fullscreenElement: false,
  });


  // TODO move to map-utils
  private defaultCircle = L.circle(
    [27.590690928375974, 85.35012329910953],
    {
      bubblingMouseEvents : true,
      color :  'green',
      dashArray : null,
      dashOffset : null,
      fill : true,
      fillColor : 'green',
      fillOpacity: 0.2,
      fillRule: 'evenodd',
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 1.0,
      radius: 50,
      stroke: true,
      weight: 3,
    });

  private stats: Area.Stats;
  private wards: FeatureCollection<WardProperties>;
  private wardDataReceived: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private featureGroup: L.FeatureGroup;
  private markerClusterGroup: L.MarkerClusterGroup;

  private isAlive = () => this.componentAlive;

  constructor(
    private route: ActivatedRoute,
    private regionService: RegionService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeWhile(this.isAlive)).subscribe((params: ParamMap) => {
      this.region = params.get('name') ? params.get('name').replace(/_/g, ' ') : 'Kathmandu Valley';
      this.type = params.get('type') || 'returnees';
      this.onRouteUpdate();
    });

    this.receiveAndSetWards();
    this.receiveAndSetStats();
  }

  private receiveAndSetWards() {
    this.getWards().subscribe((wards: FeatureCollection<WardProperties>) => {
      this.wards = wards;
      this.layersControl.overlays['Wards'] = L.geoJSON(wards as any, this.geoJsonLayerOptions);
      this.wardDataReceived.next(true);
    });
  }

  private setStats() {
    this.markerClusterGroup = L.markerClusterGroup();
    this.featureGroup = L.featureGroup();
    this.featureGroup.addLayer(this.markerClusterGroup);
    this.stats.data.forEach(datum => {
      const foundFeature = this.wards.features.find(feature => datum.DDGNWW === feature.properties.DDGNWW);
      const pointOfInaccessibility = polylabel(foundFeature.geometry.coordinates) as [number, number];
      const poiLabelMarker = L.marker({ lng: pointOfInaccessibility[0], lat: pointOfInaccessibility[1] }, {
        icon: L.icon({
          iconSize: [ 26, 42 ],
          iconAnchor: [ 13, 42 ],
          iconUrl: 'assets/img/markers/marker-icon.png',
          iconRetinaUrl: 'assets/img/markers/marker-icon-2x.png',
          shadowUrl: 'assets/img/markers/marker-shadow.png',
        }),
      });
      this.setPopup(poiLabelMarker, datum, foundFeature);
      this.markerClusterGroup.addLayer(poiLabelMarker);
    });
    this.layersControl.overlays['Stats'] = this.markerClusterGroup;
    this.mapReady.subscribe(ready => {
      if (ready) {
        this.featureGroup.addTo(this.map);
        this.loading = false;
      }
    });
  }

  private receiveAndSetStats() {
    this.getStats().subscribe((stats: Area.Stats) => {
      this.stats = stats;
      this.wardDataReceived.subscribe(received => {
        if (received) this.setStats();
      });
    });
  }

  get regionKey() {
    return this.region ? this.region.trim().replace(/ /g, '_').toLowerCase() : null;
  }

  private getWards(): Observable<FeatureCollection<WardProperties>> {
    return this.regionService.getCacheAreaWards(this.regionKey || defaultAreaKey);
  }

  private getStats(): Observable<Area.Stats> {
    return this.regionService.getCacheAreaStats(this.regionKey || defaultAreaKey);
  }

  private onRouteUpdate() {
    this.componentAlive = true;
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
  }

  layersControl = {
    baseLayers: {
      'OpenStreet Maps': this.openStreetMaps,
      'Wikimedia Maps': this.wikimediaMaps,
    },
    overlays: {},
  };

  options = {
    layers: [this.openStreetMaps],
    zoom: 12,
    crs: L.CRS.EPSG3857,
    timeDimension: true,
    center: L.latLng({ lat: 27.700769, lng: 85.33014 }),
    zoomControl: true,
    preferCanvas: false,
  };

  onMapReady(currentMap: L.Map) {
    this.map = currentMap;
    this.fullscreenControl.addTo(this.map);
    this.mapReady.next(true);
  }

  // Do not use angular component to replace this
  private setPopup(poiMarker: L.Marker, datum: Area.Datum, feature: Feature<WardProperties>) {
    const popup = L.popup({ maxWidth: 100 });
    const returneeTotal = datum.Returnee.Quarantined + datum.Returnee.Not_Quarantined;
    const pcrTotal = datum.PCR.Positive + datum.PCR.Negative;
    const rdtTotal = datum.RDT.Positive + datum.RDT.Negative;

    const popupHtml = `
      <div style="width: 4vw; height: 100.0%;">
      <style type="text/css">
        .tg  {border-collapse:collapse;border-spacing:0;}
        .tg td {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, sans-serif;
          font-size:14px;
          overflow:hidden;
          padding:10px 5px;
          word-break:normal;
        }
        .tg th {
          border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
          font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;
        }
        .tg .tg-x5oc{background-color:#fe996b;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-0cjc{background-color:#67fd9a;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-266k{background-color:#9b9b9b;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-d52n{background-color:#32cb00;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-7od5{background-color:#9aff99;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-y698{background-color:#efefef;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-tw5s{background-color:#fe0000;border-color:inherit;text-align:left;vertical-align:top}
        .tg .tg-pidv{background-color:#ffce93;border-color:inherit;text-align:left;vertical-align:top}
      </style>
      <table class="tg">
        <thead><tr>
          <th class="tg-y698" colspan="2">District</th>
          <th class="tg-y698" colspan="3">${feature.properties.DISTRICT}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tg-0pky" colspan="2">Palika</td>
            <td class="tg-0pky" colspan="3">${feature.properties.GaPa_NaPa}</td>
          </tr>
          <tr>
            <td class="tg-y698" colspan="2">Ward No</td>
            <td class="tg-y698" colspan="3">${feature.properties.NEW_WARD_N}</td>
          </tr>
          <tr>
            <td class="tg-266k" colspan="2">Returnee</td>
            <td class="tg-266k">Test</td>
            <td class="tg-266k">PCR</td>
            <td class="tg-266k">RDT</td>
          </tr>
          <tr>
            <td class="tg-pidv">Self-Isolated</td>
            <td class="tg-pidv">${datum.Returnee.Not_Quarantined}</td>
            <td class="tg-x5oc">Positive</td>
            <td class="tg-x5oc">${datum.PCR.Positive}</td>
            <td class="tg-x5oc">${datum.RDT.Positive}</td>
          </tr>
          <tr>
            <td class="tg-7od5">Quarantined</td>
            <td class="tg-7od5">${datum.Returnee.Quarantined}</td>
            <td class="tg-0cjc">Negative</td>
            <td class="tg-0cjc">${datum.PCR.Negative}</td>
            <td class="tg-0cjc">${datum.RDT.Negative}</td>
          </tr>
          <tr>
            <td class="tg-y698">Total</td>
            <td class="tg-y698">${returneeTotal}</td>
            <td class="tg-y698"> </td>
            <td class="tg-y698">${pcrTotal}</td>
            <td class="tg-y698">${rdtTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>`;

    popup.setContent(popupHtml);
    poiMarker.bindPopup(popup);

  }
}
