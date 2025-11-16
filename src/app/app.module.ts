import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';

@NgModule({
  declarations: [],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MultiSelectDropdownComponent],
  providers: [],
})
export class AppModule {}