import {
  Component, Input, EventEmitter, Output, HostBinding, 
  HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, TemplateRef
} from '@angular/core';
import { SortDirection, SortType, SelectionType, TableColumn } from '../../types';
import { nextSortDir } from '../../utils';
import { MouseEvent } from '../../events';

import { FontChangesService } from '../../services';

@Component({
  selector: 'datatable-header-cell',
  template: `
    <div class="datatable-header-cell-template-wrap">
      <ng-template
        *ngIf="isTarget"
        [ngTemplateOutlet]="targetMarkerTemplate"
        [ngTemplateOutletContext]="targetMarkerContext">
      </ng-template>
      <label
        *ngIf="isCheckboxable"
        class="datatable-checkbox">
        <input
          type="checkbox"
          [checked]="allRowsSelected"
          (change)="select.emit(!allRowsSelected)"
        />
      </label>
      <span
        *ngIf="!column.headerTemplate && !column.modified"
        class="datatable-header-cell-wrapper">
        <span
          class="datatable-header-cell-label draggable"
          (click)="onSort()"
          [innerHTML]="name">
        </span>
      </span>
      <ng-template
        *ngIf="column.headerTemplate"
        [ngTemplateOutlet]="column.headerTemplate"
        [ngTemplateOutletContext]="cellContext">
      </ng-template>

      <span *ngIf="!column.modified"
        (click)="onSort()"
        [class]="sortClass">
      </span>

      <div class="header1Class">
        <ng-template
            *ngIf="column.header1"
            [ngTemplateOutlet]="column.header1Template"
            [ngTemplateOutletContext]="cellContext">
        </ng-template>

        <span
            *ngIf="clickedHeader === 'header1'"
            (click)="onSortHeader('header1')"
            [class]="sortClass">
        </span>
      </div>

      <div class="header2Class">
        <ng-template
          *ngIf="column.header2"
          [ngTemplateOutlet]="column.header2Template"
          [ngTemplateOutletContext]="cellContext">
        </ng-template>
        <span
          *ngIf="clickedHeader === 'header2'"
          (click)="onSortHeader('header2')"
          [class]="sortClass">
        </span>
      </div>
      
    </div>

  `,
  host: {
    class: 'datatable-header-cell'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataTableHeaderCellComponent implements OnInit {

  @Input() sortType: SortType;
  @Input() sortAscendingIcon: string;
  @Input() sortDescendingIcon: string;

  @Input() isTarget: boolean;
  @Input() targetMarkerTemplate: any;
  @Input() targetMarkerContext: any;

  _allRowsSelected: boolean;

  clickedHeader: string;
  headerFont: string;
  clickedColumn: string;
  
  @Input() set allRowsSelected(value) {
    this._allRowsSelected = value;
    this.cellContext.allRowsSelected = value;
  }
  get allRowsSelected() {
    return this._allRowsSelected;
  }
  
  @Input() selectionType: SelectionType;

  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;
    this.cd.markForCheck();
  }

  get column(): TableColumn {
    return this._column;
  }

  @HostBinding('style.height.px')
  @Input() headerHeight: number;

  @Input() set sorts(val: any[]) {
    this._sorts = val;
    this.sortDir = this.calcSortDir(val);
    this.cellContext.sortDir = this.sortDir;
    this.sortClass = this.calcSortClass(this.sortDir);
    this.cd.markForCheck();
  }

  get sorts(): any[] {
    return this._sorts;
  }

  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() columnContextmenu = new EventEmitter<{ event: MouseEvent, column: any }>(false);

  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-header-cell';

    if (this.column.sortable) cls += ' sortable';
    if (this.column.resizeable) cls += ' resizeable';
    if (this.column.headerClass) {
      if (typeof this.column.headerClass === 'string') {
        cls += ' ' + this.column.headerClass;
      } else if (typeof this.column.headerClass === 'function') {
        const res = this.column.headerClass({
          column: this.column
        });

        if (typeof res === 'string') {
          cls += res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) cls += ` ${k}`;
          }
        }
      }
    }

    const sortDir = this.sortDir;
    if (sortDir) {
      cls += ` sort-active sort-${sortDir}`;
    }

    return cls;
  }

  @HostBinding('attr.title')
  get name(): string {
    // guaranteed to have a value by setColumnDefaults() in column-helper.ts
    return this.column.headerTemplate === undefined ? this.column.name : undefined;
  }

  @HostBinding('style.minWidth.px')
  get minWidth(): number {
    return this.column.minWidth;
  }

  @HostBinding('style.maxWidth.px')
  get maxWidth(): number {
    return this.column.maxWidth;
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  get isCheckboxable(): boolean {
    return this.column.checkboxable &&
      this.column.headerCheckboxable &&
      this.selectionType === SelectionType.checkbox;
  }

  sortFn = this.onSort.bind(this);
  sortClass: string;
  sortDir: SortDirection;
  selectFn = this.select.emit.bind(this.select);

  sortHeaderFn = this.onSortHeader.bind(this);
  headerTemplate: TemplateRef<any>;

  cellContext: any = {
    column: this.column,
    sortDir: this.sortDir,
    sortFn: this.sortFn,
    sortHeaderFn: this.sortHeaderFn,
    headerTemplate: this.headerTemplate,
    allRowsSelected: this.allRowsSelected,
    selectFn: this.selectFn
  };

  private _column: TableColumn;
  private _sorts: any[];

  constructor(
    private cd: ChangeDetectorRef,
    private fontChangesService: FontChangesService
  ) { }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({ event: $event, column: this.column });
  }

  calcSortDir(sorts: any[]): any {
    if (sorts && this.column) {
      const sort = sorts.find((s: any) => {
        if(s.prop.indexOf('_') !== -1) {
          return s.prop.indexOf(this.column.prop) !== -1;
          
        }
        return s.prop === this.column.prop;
      });

      if (sort) return sort.dir;
    }
  }

  ngOnInit() {
    this.fontChangesService.currentFont.subscribe(font => this.headerFont = font);
    this.fontChangesService.currentColumn.subscribe(column => this.clickedColumn = column);
  }

  onSort(): void {
    if (!this.column.sortable) return;

    const newValue = nextSortDir(this.sortType, this.sortDir);
    this.sort.emit({
      column: this.column,
      prevValue: this.sortDir,
      newValue
    });
  }

  onSortHeader(header: string): void {
    if (!this.column.sortable) return;
    this.clickedHeader = header;
    this.column.clickedHeader = this.column[header];
    this.fontChangesService.changeFont(header, this.column.prop.toString());
    const newValue = nextSortDir(this.sortType, this.sortDir);
    this.sort.emit({
      clickedHeader: header,
      column: this.column,
      prevValue: this.sortDir,
      newValue
    });
  }
  
  calcSortClass(sortDir: SortDirection): string {
    if (sortDir === SortDirection.asc) {
      return `sort-btn sort-asc ${this.sortAscendingIcon}`;
    } else if (sortDir === SortDirection.desc) {
      return `sort-btn sort-desc ${this.sortDescendingIcon}`;
    } else {
      return `sort-btn`;
    }
  }

}
