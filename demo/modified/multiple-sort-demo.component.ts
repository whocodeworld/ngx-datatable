import { Component, TemplateRef, ViewChild } from '@angular/core';
import {DatatableComponent} from '../../src/components/datatable.component';

// import { TestPipe } from './../pipes/testPipe';

/*
[rows]="rows"
[columns]="columns"

        [sortType]="'multi'"
*/
@Component({
  selector: 'multiple-sort-demo',

  template: `
    <div>
      
      <ng-template #cellTmpl let-column="column" let-row="row" let-value="value" ngx-datatable-cell-template>
        <span *ngIf="column.header1">
        {{row.customer.name}}
        </span>
        <br>
        <span *ngIf="column.header2">
        {{row.customer.id}}
        </span>
      </ng-template>

      <h3>
        Client-side Sorting
      </h3>

      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="'force'"
        [headerHeight]="80"
        [footerHeight]="50"
        [rowHeight]="120">

        <ngx-datatable-column name="customerName" [width]="500">
        <!--  
        <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            <span class="thick">{{value}}</span>
          </ng-template>
          -->
        </ngx-datatable-column>
    
      </ngx-datatable>

      
    </div>

    <ng-template #cell1Tmpl 
          let-row="row" 
          let-column="column" 
          >
            {{(row[column.prop])[column.header1]}}
        </ng-template>

        <ng-template #cell2Tmpl 
          let-row="row" 
          let-column="column"         
          >
            {{(row[column.prop])[column.header2]}}
        </ng-template>

        <ng-template #subHdr1Tpl
          let-column="column"
          let-sortHeaderFn="sortHeaderFn"
          >
          <span (click)="sortHeaderFn('header1')">{{column.header1Title}}</span>  
        </ng-template>

        <ng-template #subHdr2Tpl
          let-column="column"
          let-sortHeaderFn="sortHeaderFn"
          >
          <span (click)="sortHeaderFn('header2')">{{column.header2Title}}</span>  
        </ng-template>

        <!--
        <ngx-datatable-column prop="customer" 
                              modified="true"
                              header1="name" 
                              header2="customerId" 
                              header1Title="Name"
                              header2Title="Nummer"
                              [header1Template]="subHdr1Tpl"
                              [header2Template]="subHdr2Tpl"
                              [cell1Template]="cell1Tmpl" 
                              [cell2Template]="cell2Tmpl">
        </ngx-datatable-column>

        <ngx-datatable-column prop="company"
          modified="true"
          header1="name" 
          header1Title="Firma" 
          [header1Template]="subHdr1Tpl" 
          [cell1Template]="cell1Tmpl"
          [draggable]="false">
          
        </ngx-datatable-column>

        <ngx-datatable-column prop="name" 
                              modified="true"
                              header1="first" 
                              header2="last" 
                              header1Title="Vorname"
                              header2Title="Nachname"
                              [header1Template]="subHdr1Tpl"
                              [header2Template]="subHdr2Tpl"
                              [cell1Template]="cell1Tmpl" 
                              [cell2Template]="cell2Tmpl">
        </ngx-datatable-column>
        -->
  `,
  styles: [
    '.bold {font-weight: bold;}'
  ],
  providers: []
})
export class MultipleSortComponent {

  rows = [];
  temp = [];
  columns = [];
  // , pipe: this.testPipe
  // columns = [
  //   { name: 'customer', prop: 'object', header1: 'header1', header2: 'header2' },
  //   { name: 'Company' },
  //   { name: 'Name' },
  //   { name: 'Gender' }
  // ];

  
  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor() {
    this.fetch((data) => {
      this.rows = data;

      this.temp = [...data];
      console.log(data);
    });
  }


  ngOnInit() {
    // this.columns = [{
    //   // cellTemplate: this.editTmpl,
    //   // cellTemplate: this.cellTmpl,
    //   // headerTemplate: this.hdrTpl,
    //   name: 'Customer',
    //   // id: 'Customer Id'
    // },
    // {
    //   name: 'Company'
    // }];
  }


  fetch(cb) {
    const req = new XMLHttpRequest();
    // req.open('GET', `assets/data/company.json`);
    req.open('GET', `demo/modified/flatRow.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

  updateFilter(event, path) {
    const val = event.target.value.toLowerCase();
    // filter our data
    console.log(path);

    // const temp = this.temp.find( function(x) {
    //   console.log(path);
    //   let split = path.split(".");
    //   console.log(x[split[0]]);
    //   console.log(x[split[0]][split[1]]);
    //   let targ = x[split[0]][split[1]];
    //   return targ.toLowerCase().indexOf(val) !== -1 || !val;
    // });
    const temp = this.temp.filter(function(d) {
      console.log(path);
      let split = path.split('.');
      let targ = String(d[split[0]][split[1]]).toLowerCase();
      return targ.indexOf(val) !== -1
      // return d.path.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
