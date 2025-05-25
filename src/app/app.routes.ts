import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';

export const routes: Routes = [
      { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: MultiSelectDropdownComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


