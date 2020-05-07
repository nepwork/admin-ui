import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection } from '../models/geojson/feature-collection.model';

@Injectable({
  providedIn: 'root',
})
export class WardsService {

  private allWards: FeatureCollection;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get('assets/map/nepal/NEPAL_WARDS_WGS.json');
  }
}
