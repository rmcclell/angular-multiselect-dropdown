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
  @Input() options: string[] | any[] = [];
  @Input() placeholder = 'Select Items';
  @Input() ariaLabel = 'Select Items';
  @Input() display: 'chip' | 'comma' = 'chip';
  @Input() emptyFilterMessage: string = 'No items found.';
  @Input() filterPlaceHolder: string = 'Enter text to filter items by';
  @Input() variant: 'outlined' | 'filled' = 'filled';
  @Input() optionLabel: string | null = null;
  @Input() optionValue: string | null = null;

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
    return this.options.filter((item) => this.getFilterValue(item).toLowerCase().includes(filter));
  });

  getFilterValue(item: any): string {
    console.log(item);
    return typeof(item) === 'object' && this.optionLabel !== null && item[this.optionLabel] ? item[this.optionLabel] : item;
  }

  // The display text is a computed signal
  public selectedItemsText = computed(() => {
    if (this.selectedItems().length === 0) {
      return this.placeholder;
    }
    return this.selectedItems().join(', ');
  });

  public selectedItemsLabel = computed(() => {
    return this.selectedItems();
  });

  public unSelectItemLabel(index: number) {
    this.selectedItems.update(arr => {
      const copy = arr.slice();
      copy.splice(index, 1);
      return copy;
    });
  }

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

  getLabel(item: any): string {
    return typeof(item) === 'object' && this.optionLabel !== null && item[this.optionLabel] ? item[this.optionLabel] : item;
  }

  getValue(item: any): string {
    return typeof(item) === 'object' && this.optionValue !== null && item[this.optionValue] ? item[this.optionValue] : item;
  }

  // --- Keyboard Event Handling ---
  @HostListener('keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent) {
    const targetElement = event.target as EventTarget as HTMLAnchorElement;
    console.log(event);
    if (!this.isOpen()) {
      return;
    }

    //event.preventDefault();
    if (targetElement?.href) {

    } else {
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