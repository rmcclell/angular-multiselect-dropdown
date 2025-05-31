import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

// Import your standalone component
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';

interface City {
    name: string,
    code: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  // Import all dependencies directly into the component
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MultiSelectDropdownComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public allItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  public cities: City[] = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];

  public selectedCities: City[] = [];

  // For Template-Driven Forms
  public selectedItemsTemplate: string[] = ['Item 2'];

  // For Reactive Forms
  public reactiveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      selectedItems: [['Item 3', 'Item 5']],
    });
  }
}