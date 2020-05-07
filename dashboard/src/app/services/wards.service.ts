import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WardsService {

  // private allWards: FeatureCollection;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get('assets/map/nepal/NEPAL_WARDS_WGS.json');
  }
}
