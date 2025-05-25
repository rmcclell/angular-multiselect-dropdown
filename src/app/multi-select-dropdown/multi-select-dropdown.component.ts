import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectDropdownComponent),
      multi: true,
    },
  ],
})
export class MultiSelectDropdownComponent implements ControlValueAccessor {
  @Input() items: string[] = [];
  @Input() placeholder = 'Select Items';

  public selectedItems: string[] = [];
  public filteredItems$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public isOpen = false;
  public filterText = '';

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.filteredItems$.next(this.items);
  }

  ngOnChanges() {
    this.filteredItems$.next(this.items);
  }

  writeValue(value: string[]): void {
    this.selectedItems = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.onTouched();
    }
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filterText = filterValue;
    this.filteredItems$.next(
      this.items.filter((item) => item.toLowerCase().includes(filterValue))
    );
  }

  toggleItem(item: string): void {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.onChange(this.selectedItems);
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  get selectedItemsText(): string {
    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }
    return this.selectedItems.join(', ');
  }
}