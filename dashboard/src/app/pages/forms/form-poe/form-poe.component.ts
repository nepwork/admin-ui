import { Component, OnInit, ViewChild } from '@angular/core';
import { NbCheckboxComponent } from '@nebular/theme';
import { COUNTRIES, NEARBY_COUNTRIES } from '../../../@core/data/countries.geo';
import { PROVINCES } from '../../../@core/data/province-districts.geo';

class TestRecord {
  date: Date;
  result: boolean;
  lab: string;
}

@Component({
  selector: 'ngx-form-poe',
  styleUrls: ['./form-poe.component.scss'],
  templateUrl: './form-poe.component.html',
})
export class FormPOEComponent implements OnInit {

  countries: string[];
  nearbyCountries: string[];

  provinces: string[];
  districts = { destinationOpts: [], addressOpts: []};

  permanentAddrProvince: string = null;
  finalDestProvince: string = null;

  addTransitCountries = false;

  pcrRecords: Array<TestRecord> = [];
  rdtRecords: Array<TestRecord> = [];

  relationName = 'Father';

  ngOnInit() {
    this.countries = COUNTRIES;
    this.nearbyCountries = NEARBY_COUNTRIES;
    this.provinces = PROVINCES.map(province => province.name);
  }

  changeAddrProvince(event: string) {
    this.permanentAddrProvince = event;
    this.districts.addressOpts = PROVINCES.find(province => province.name === this.permanentAddrProvince).districts;
  }

  changeDestProvince(event: string) {
    this.finalDestProvince = event;
    this.districts.destinationOpts = PROVINCES.find(province => province.name === this.finalDestProvince).districts;
  }

  changeRelationship(event: string) {
    this.relationName = event;
  }

  addPCRRecord(_: boolean) {
    this.pcrRecords = [ ...this.pcrRecords, new TestRecord()];
  }

  addRDTRecord(_: boolean) {
    this.rdtRecords = [ ...this.rdtRecords, new TestRecord()];
  }
}
