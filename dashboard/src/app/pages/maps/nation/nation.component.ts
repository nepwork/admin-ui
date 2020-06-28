import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import polylabel from 'polylabel';
import { AsyncSubject, forkJoin, from, merge, Subject, BehaviorSubject } from 'rxjs';
import 'style-loader!leaflet/dist/leaflet.css';
import {
  Census2011,
  HealthStats,
  RETTupleRev,
} from '../../../models/db-response.model';
import {
  FeatureCollection,
  GovDistrictProperties,
  GovProvinceProperties,
  RoadMajorProperties,
} from '../../../models/domain.model';
import { MapUtilsService } from '../../../services/components/map/map-utils.service';
import { RegionService } from '../../../services/components/map/region.service';
import { ReturneeService } from '../../../services/db/returnee.service';

interface MapLayer {
  bucket: string;
  label: string;
}

@Component({
  selector: 'ngx-leaflet',
  styleUrls: ['./nation.component.scss'],
  templateUrl: './nation.component.html',
})
export class NationComponent implements OnInit, OnDestroy {
  title = 'National Map';

  private readonly mapLayerDistrict = {
    bucket: 'gov_districts',
    label: 'Districts',
  };
  private readonly mapLayerProvince = {
    bucket: 'gov_provinces',
    label: 'Provinces',
  };
  private readonly mapLayerRoads = {
    bucket: 'roads_major',
    label: 'Major Roads',
  };

  private districtsGeoJson: FeatureCollection<GovDistrictProperties>;
  private districtsHealthStats: HealthStats.Districts;
  private districtPopulation: Census2011.Districts;
  private returneeStats: Array<RETTupleRev>;

  private quadDataCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private featureGroup: L.FeatureGroup;
  private markerClusterGroup: L.MarkerClusterGroup;

  loading = true;

  private map: L.Map;
  private mapReady: BehaviorSubject<Boolean> = new BehaviorSubject(false);

  layersControl: any;

  options = {
    layers: [this.mapUtilsService.openStreetMaps],
    zoom: 7,
    crs: L.CRS.EPSG3857,
    center: L.latLng({ lat: 27.700769, lng: 85.30014 }),
    zoomControl: true,
    preferCanvas: false,
  };

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

  constructor(
    private mapUtilsService: MapUtilsService,
    private regionService: RegionService,
    private returneeService: ReturneeService
  ) {}

  ngOnInit() {
    this.layersControl = { ...this.mapUtilsService.baseLayers, overlays: {} };
    this.fetchLabelFeatures();
    this.receiveAndSetStats();
  }

  async fetchLabelFeatures() {
    this.setLayerFromBucket<GovDistrictProperties>(this.mapLayerDistrict);
    this.setLayerFromBucket<GovProvinceProperties>(this.mapLayerProvince);
    this.setLayerFromBucket<RoadMajorProperties>(this.mapLayerRoads);
  }

  setLayerFromBucket<T>(layer: MapLayer) {
    this.regionService
      .getAndCache<FeatureCollection<T>>(layer.bucket)
      .subscribe((featureCollection) => {
        this.layersControl.overlays[layer.label] = L.geoJSON(
          featureCollection as any
        );
        if (layer.bucket === this.mapLayerDistrict.bucket) {
          this.districtsGeoJson = (featureCollection as unknown) as FeatureCollection<
            GovDistrictProperties
          >;
          this.layersControl.overlays['Districts'] = L.geoJSON(
            featureCollection as any,
            this.geoJsonLayerOptions
          );
          this.raiseQuadDataCount();
          console.log('NationComponent -> layer', layer);
        }
      });
  }

  private raiseQuadDataCount() {
    this.quadDataCounter.next(this.quadDataCounter.getValue() + 1);
  }

  private async receiveAndSetStats() {
    merge(
      this.regionService.getCacheDistrictHealthStats(),
      this.regionService.getCacheDistrictWiseCensus(),
      from(this.returneeService.getAllWards())
    ).subscribe((stats) => {
      if (HealthStats.isDistrictHealthStats(stats)) {
        this.districtsHealthStats = stats;
        this.raiseQuadDataCount();
        console.log(
          'NationComponent -> receiveAndSetStats -> this.districtsHealthStats',
          this.districtsHealthStats
        );
      } else if (Census2011.isDistrictCensus(stats)) {
        this.districtPopulation = stats;
        this.raiseQuadDataCount();
        console.log(
          'NationComponent -> receiveAndSetStats -> this.districtPopulation',
          this.districtPopulation
        );
      } else {
        this.returneeStats = stats;
        this.raiseQuadDataCount();
        console.log(
          'NationComponent -> receiveAndSetStats -> this.returneeStats',
          this.returneeStats
        );
      }
    });

    // wait for all data to be received first
    this.quadDataCounter.subscribe((count) => {
      console.log(
        'NationComponent -> receiveAndSetStats -> count',
        count
      );
      if (count === 4) this.setStats();
    });
  }

  findByNameFromReturneeStats(districtName: string): RETTupleRev {
    return this.returneeStats.find((stat) =>
      districtName.toLowerCase().startsWith(stat[2].toLowerCase())
    );
  }

  findByNameFromCensusStats(districtName: string): Census2011.District {
    return this.districtPopulation.values.find((value) =>
      districtName.toLowerCase().startsWith(value.district.toLowerCase())
    );
  }

  private setStats() {
    this.markerClusterGroup = L.markerClusterGroup();

    this.featureGroup = L.featureGroup();
    this.featureGroup.addLayer(this.markerClusterGroup);

    this.districtsHealthStats.values.forEach((stats) => {
      const foundDistrict = this.districtsGeoJson.features.find((feature) =>
        stats.district.toUpperCase().startsWith(feature.properties.FIRST_DIST)
      ); // TODO change to DDGN comparison

      if (!foundDistrict) return;

      const pointOfInaccessibility = polylabel(
        foundDistrict.geometry.coordinates
      ) as [number, number];

      const poiLabelMarker = this.mapUtilsService.getDefaultMarker(
        pointOfInaccessibility
      );

      this.setPopup(poiLabelMarker, stats);
      this.markerClusterGroup.addLayer(poiLabelMarker);
    });

    this.layersControl.overlays['Stats'] = this.markerClusterGroup;

    this.mapReady.subscribe((ready) => {
      if (ready) {
        this.featureGroup.addTo(this.map);
        this.loading = false;
      }
    });
  }

  private setPopup(poiMarker: L.Marker, datum: HealthStats.District) {
    const returneeInfo = this.findByNameFromReturneeStats(datum.district);
    const censusInfo = this.findByNameFromCensusStats(datum.district);

    const returneeTotal = returneeInfo ? returneeInfo[5] : 0;
    const populationTotal = censusInfo ? censusInfo.total : 100_000;

    const pcrTotal = datum.total_swab_collection;
    const rdtTotal = datum.total_rdt_tests;

    const pcrNegatives = datum.negatives;
    const rdtNegatives = datum.negatives_1;

    const returneeOverPop = (returneeTotal / populationTotal).toFixed(4);
    const pcrCoverageOverPop = (pcrTotal / populationTotal).toFixed(4);
    const pcrPositiveOverTests = ((pcrTotal - pcrNegatives) / pcrTotal).toFixed(4);
    const rdtCoverageOverPop = (rdtTotal / populationTotal).toFixed(4);
    const rdtPositiveOverTests = ((rdtTotal - rdtNegatives) / rdtTotal).toFixed(4);

    const postiveSeroPrevalence = ((pcrTotal - pcrNegatives) / populationTotal).toFixed(4);

    const popup = L.popup({ maxWidth: 100 });
    const popupHtml = `
      <div>
      <style type="text/css">
        .tg  {border-collapse:collapse;border-spacing:0;}
        .tg td {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, sans-serif;
          font-size:12px;
          overflow:hidden;
          padding:10px 8px;
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
        <thead>
          <tr>
            <th class="tg-y698" colspan="2">District</th>
            <th class="tg-y698" colspan="3">${datum.district}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="tg-0pky" colspan="2">+ve Sero Prev.</td>
            <td class="tg-0pky" colspan="3">${postiveSeroPrevalence}</td>
          </tr>
          <tr>
            <td class="tg-y698" colspan="2">PCR coverage</td>
            <td class="tg-y698" colspan="3">${pcrCoverageOverPop}</td>
          </tr>
          <tr>
            <td class="tg-0pky" colspan="2">PCR +ve ratio</td>
            <td class="tg-0pky" colspan="3">${pcrPositiveOverTests}</td>
          </tr>
          <tr>
            <td class="tg-y698" colspan="2">RDT coverage</td>
            <td class="tg-y698" colspan="3">${rdtCoverageOverPop}</td>
          </tr>
          <tr>
            <td class="tg-0pky" colspan="2">RDT +ve ratio</td>
            <td class="tg-0pky" colspan="3">${rdtPositiveOverTests}</td>
          </tr>
          <tr>
            <td class="tg-0pky" colspan="2">Returnee ratio</td>
            <td class="tg-0pky" colspan="3">${returneeOverPop}</td>
          </tr>
          <tr>
            <td class="tg-266k" colspan="2">Returnee</td>
            <td class="tg-266k">Test</td>
            <td class="tg-266k">PCR</td>
            <td class="tg-266k">RDT</td>
          </tr>
          <tr>
            <td class="tg-pidv">Isolated</td>
            <td class="tg-pidv">${datum.isolated_total}</td>
            <td class="tg-x5oc">Positive</td>
            <td class="tg-x5oc">${datum.total_positives}</td>
            <td class="tg-x5oc">${datum.positives}</td>
          </tr>
          <tr>
            <td class="tg-pidv">Quarantined</td>
            <td class="tg-pidv">${datum.quarantined_total}</td>
            <td class="tg-0cjc">Negative</td>
            <td class="tg-0cjc">${pcrNegatives}</td>
            <td class="tg-0cjc">${rdtNegatives}</td>
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

  ngOnDestroy() {
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
