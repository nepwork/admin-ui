import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { MapsRoutingModule, routedComponents } from './maps-routing.module';
import { LeafletFullscreenModule } from '../../lib/leaflet-fullscreen/public-api';


@NgModule({
  imports: [
    ThemeModule,
    GoogleMapsModule,
    LeafletModule,
    LeafletFullscreenModule,
    MapsRoutingModule,
    NgxEchartsModule,
    NbCardModule,
    NbSpinnerModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
  ],
})
export class MapsModule { }
