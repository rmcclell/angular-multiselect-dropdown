import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // For Template-Driven Forms
  public allItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  public selectedItemsTemplate: string[] = ['Item 2'];

  // For Reactive Forms
  public reactiveForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      selectedItems: [['Item 3', 'Item 5']],
    });
  }
}