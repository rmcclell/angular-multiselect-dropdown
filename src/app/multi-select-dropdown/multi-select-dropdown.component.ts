import { Component, Input, forwardRef, signal, computed, effect, HostListener, ViewChildren, QueryList, ElementRef, } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule],
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

  @ViewChildren('dropdownItem') itemElements!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChildren('filterInput') filterInput!: QueryList<ElementRef<HTMLInputElement>>;

  // Component state as signals
  public selectedItems = signal<string[]>([]);
  public isOpen = signal(false);
  public filterText = signal('');

  // --- NEW: Keyboard Accessibility State ---
  public activeIndex = signal<number>(-1);

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

  // --- NEW: Computed Signal for ARIA ---
  public activeDescendant = computed(() => {
    return this.activeIndex() >= 0 ? `ms-item-${this.activeIndex()}` : '';
  });

  // --- ControlValueAccessor Logic (from previous version) ---
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef?: ElementRef) {
    // When selectedItems changes, call the registered onChange function
    effect(() => {
      this.onChange(this.selectedItems());
    });

    // NEW: Effect to scroll the active item into view
    effect(() => {
      // only run if the dropdown is open and an item is active
      if (this.isOpen() && this.activeIndex() >= 0) {
        this.itemElements?.get(this.activeIndex())?.nativeElement.scrollIntoView({
          block: 'nearest'
        });
      }
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

  // --- Keyboard Event Handling ---
  @HostListener('keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    if (!this.isOpen()) {
      return;
    }

    event.preventDefault();

    switch (event.key) {
      case 'ArrowDown':
        this.activeIndex.update(i => (i < this.filteredItems().length - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        this.activeIndex.update(i => (i > 0 ? i - 1 : 0));
        break;
      case ' ': // Space bar
      case 'Enter':
        if (this.activeIndex() >= 0) {
          this.toggleItem(this.filteredItems()[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  // --- Component Methods ---
  toggleDropdown(): void {
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      // Focus the filter input when opening
      setTimeout(() => this.filterInput.first?.nativeElement.focus(), 0);
    } else {
      this.closeDropdown();
    }
  }
  
  closeDropdown(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.onTouched();
  }

  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterText.set(filterValue);
    this.activeIndex.set(-1); // Reset active index on filter change
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

  // Handle click outside to close dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef?.nativeElement?.contains(event.target)) {
        if(this.isOpen()){
            this.closeDropdown();
        }
    }
  }
}