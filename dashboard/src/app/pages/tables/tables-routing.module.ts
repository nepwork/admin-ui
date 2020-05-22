import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { TreeGridComponent, FsIconComponent } from './tree-grid/tree-grid.component';
import { PcrComponent } from './pcr/pcr.component';
import { ReturneeComponent } from './returnee/returnee.component';

const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    {
      path: 'returnee-table',
      component: ReturneeComponent,
    },
    {
      path: 'pcr-table',
      component: PcrComponent,
    },
    {
      path: 'rdt-table',
      component: SmartTableComponent,
    },
    {
      path: 'tree-grid',
      component: TreeGridComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  FsIconComponent,
  ReturneeComponent,
  PcrComponent,
  TablesComponent,
  SmartTableComponent,
  TreeGridComponent,
];
