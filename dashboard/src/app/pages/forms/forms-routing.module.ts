import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsComponent } from './forms.component';
import { FormMunicipalityComponent } from './form-municipality/form-municipality.component';
import { FormPOEComponent } from './form-poe/form-poe.component';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    children: [
      {
        path: 'point-of-entry',
        component: FormPOEComponent,
      },
      {
        path: 'municipality',
        component: FormMunicipalityComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {
}

