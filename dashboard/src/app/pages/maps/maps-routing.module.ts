import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapsComponent } from './maps.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { NationComponent } from './nation/nation.component';
import { BubbleMapComponent } from './bubble/bubble-map.component';
import { SearchMapComponent } from './search-map/search-map.component';
import { MapComponent } from './search-map/map/map.component';
import { SearchComponent } from './search-map/search/search.component';
import { RegionComponent } from './region/region.component';

const routes: Routes = [{
  path: '',
  component: MapsComponent,
  children: [{
    path: 'area/:name',
    component: RegionComponent,
  },
  {
    path: 'area/:name/:type',
    component: RegionComponent,
  },
  {
    path: 'gmaps',
    component: GmapsComponent,
  },
  {
    path: 'nepal',
    component: NationComponent,
  },
  {
    path: 'bubble',
    component: BubbleMapComponent,
  },
  {
    path: 'searchmap',
    component: SearchMapComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsRoutingModule { }

export const routedComponents = [
  MapsComponent,
  GmapsComponent,
  NationComponent,
  BubbleMapComponent,
  SearchMapComponent,
  MapComponent,
  SearchComponent,
  RegionComponent,
];
