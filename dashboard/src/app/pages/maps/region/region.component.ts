import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as L from 'leaflet';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { RegionService } from '../../../services/components/map/region.service';
import { FeatureCollection } from '../../../models/domain.model';
import 'leaflet-timedimension-new';
// import '../../../../../node_modules/leaflet-timedimension-new/dist/leaflet.timedimension.src.js';

const attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileLayerPng = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const tileLayerOptions = {
  attribution,
  'detectRetina': false,
  'maxNativeZoom': 18,
  'maxZoom': 18,
  'minZoom': 0,
  'noWrap': false,
  'opacity': 1,
  'subdomains': 'abc',
  'tms': false,
};

@Component({
  selector: 'ngx-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
})
export class RegionComponent implements OnInit, OnDestroy {
  region: string;
  type: string;

  private subscription: Subscription;
  private componentAlive = false;

  private map: L.Map;
  private mapReady: Subject<Boolean> = new Subject();

  openStreetMaps = L.tileLayer(tileLayerPng, tileLayerOptions);

  wikimediaMaps = L.tileLayer(tileLayerPng, tileLayerOptions);

  private timeDimensionLayer: any;

  private TimeDimensionCustom = L.Control.TimeDimension.extend({
    _getDisplayDateFormat: function(date){
        const newdate = moment(date);
        console.log(newdate);
        return newdate.format('YYYY-MM-DD HH:mm:ss');
    },
  });

  private timeDimensionControl = new this.TimeDimensionCustom({
      autoPlay: true,
      loopButton: true,
      maxSpeed: 10,
      minSpeed: 0.1,
      playerOptions: {
        loop: true,
        startOver: true,
        transitionTime: 1000,
      },
      position: 'bottomleft',
      timeSliderDragUpdate: false,
    });

  private geoJsonLayer: any;

  private geoJsonLayerAttributes = {
    pointToLayer: function (feature: any, latLong: any) {
      if (feature.properties.icon === 'marker') {
        if (feature.properties.iconstyle) {
          return new L.Marker(latLong, {
            icon: L.icon(feature.properties.iconstyle),
          });
        }
        return new L.Marker(latLong);
      }
      if (feature.properties.icon === 'circle') {
        if (feature.properties.iconstyle) {
          return L.circleMarker(latLong, feature.properties.iconstyle);
        }
        return L.circleMarker(latLong);
      }
      return new L.Marker(latLong);
    },
    style: function (feature: any) {
      return feature.properties.style;
    },
    onEachFeature: function (feature: any, layer: any) {
      if (feature.properties.popup) {
        layer.bindPopup(feature.properties.popup);
      }
    },
  };

  private fullscreenControl = L.control.fullscreen({
    position: 'topleft',
    title: 'Enter Fullscreen',
    titleCancel: 'Exit Fullscreen',
    content: null,
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
    fullscreenElement: false,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionService: RegionService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.region = params.get('name');
      this.type = params.get('type') || 'returnees';
      this.onRouteUpdate();
    });

    this.regionService
      .getEmblemAnimGeoJson()
      .subscribe((diseaseSpread: FeatureCollection) => {
        this.geoJsonLayer = L.geoJSON(diseaseSpread.features as any, this.geoJsonLayerAttributes);
        this.timeDimensionLayer = L.timeDimension.layer.geoJson(this.geoJsonLayer,
          {
            updateTimeDimension: true,
            addlastPoint: true,
            duration: 'P1D',
          });
          this.mapReady.subscribe(ready => { if (ready) this.timeDimensionLayer.addTo(this.map); });
      });
  }

  private onRouteUpdate() {
    this.componentAlive = true;
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  layersControl = {
    baseLayers: {
      'Street Maps': this.openStreetMaps,
      'Wikimedia Maps': this.wikimediaMaps,
    },
    // overlays: {
    //   'Returnees': this.returnees,
    //   'PCR Tests': this.pcrs,
    //   'RDT Tests': this.rdts,
    // },
  };

  options = {
    layers: [this.openStreetMaps],
    zoom: 13,
    crs: L.CRS.EPSG3857,
    timeDimension: true,
    center: L.latLng({ lat: 27.700769, lng: 85.30014 }),
    zoomControl: true,
    preferCanvas: false,
  };

  onMapReady(currentMap: L.Map) {
    this.map = currentMap;

    this.fullscreenControl.addTo(this.map);

    // TODO check if this works
    this.map.addControl(this.timeDimensionControl);

    this.mapReady.next(true);
  }
}
