import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as L from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import { RegionService } from '../../../services/components/map/region.service';

@Component({
  selector: 'ngx-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit, OnDestroy {

  region: string;
  type: string;

  private subscription: Subscription;
  private componentAlive = false;

  private map: L.Map;
  private mapReady: Subject<Boolean> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionService: RegionService,
    ) { }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(((params: ParamMap) => {
      this.region = params.get('name');
      this.type = params.get('type') || 'returnees';
      this.onRouteUpdate();
    }));
  }

  private onRouteUpdate() {
    this.componentAlive = true;
  }

  onMapReady(currentMap: L.Map) {
    this.map = currentMap;
    this.mapReady.next(true);
  }

  ngOnDestroy(): void {
    this.componentAlive = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fullscreenEntered() {
    // console.log('Fullscreen mode entered !');
  }

  fullscreenExited() {
    // console.log('Fullscreen mode exited !');
  }

  fullscreenControlReady() {
    // console.log('Fullscreen control ready !');
  }


  // baseLayers = {
  //   center: [27.700769, 85.30014],
  //   crs: L.CRS.EPSG3857,
  //   zoom: 11,
  //   zoomControl: true,
  //   preferCanvas: false,
  // };

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
        detectRetina: false,
        maxNativeZoom: 18,
        minZoom: 0,
        noWrap: false,
        opacity: 1,
        subdomains: 'abc',
        tms: false,
      }),
    ],
    zoom: 7,
    center: L.latLng({ lat: 27.700769, lng: 85.300140 }),
  };

}
