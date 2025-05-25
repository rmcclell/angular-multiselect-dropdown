import { Component, Input, forwardRef, signal, computed, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for directives like *ngFor
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectDropdownComponent),
      multi: true,
    },
  ],
})
export class MultiSelectDropdownComponent implements ControlValueAccessor {
  // Use signal-based inputs
  @Input() items: string[] = [];
  @Input() placeholder = 'Select Items';

  // Component state as signals
  public selectedItems = signal<string[]>([]);
  public isOpen = signal(false);
  public filterText = signal('');

  // The list of items to display is now a computed signal
  public filteredItems = computed(() => {
    const filter = this.filterText().toLowerCase();
    return this.items.filter((item) => item.toLowerCase().includes(filter));
  });

  // The display text is a computed signal
  public selectedItemsText = computed(() => {
    if (this.selectedItems().length === 0) {
      return this.placeholder;
    }
    return this.selectedItems().join(', ');
  });

  // ControlValueAccessor functions remain the same
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // When selectedItems changes, call the registered onChange function
    effect(() => {
      this.onChange(this.selectedItems());
    });
  }

  writeValue(value: string[]): void {
    // Set the signal's value when the form control is updated
    this.selectedItems.set(value || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterText.set(filterValue);
  }

  toggleItem(item: string): void {
    this.selectedItems.update(currentSelected => {
      const index = currentSelected.indexOf(item);
      if (index > -1) {
        return [...currentSelected.slice(0, index), ...currentSelected.slice(index + 1)];
      } else {
        return [...currentSelected, item];
      }
    });
  }

  isSelected(item: string): boolean {
    return this.selectedItems().includes(item);
  }
}