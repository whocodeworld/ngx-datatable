import { Component, TemplateRef, ViewChild } from '@angular/core';
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
      <ng-template #hdrTpl let-column="column" let-sort="sortFn">
        <span (click)="sort()">{{column.header1}}</span>
          <br>
        <span (click)="sort()">{{column.header2}}</span>
      </ng-template>
      <h3>
        Client-side Sorting
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="'force'"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="60">

        <ngx-datatable-column prop="customer.name" header1="customer name" header2="customer id" [headerTemplate]="hdrTpl" [cellTemplate]="cellTmpl">
        </ngx-datatable-column>
        
        <ngx-datatable-column name="company">
          <ng-template let-column="column" let-sort="sortFn" >
            <span class="mobile-hidden">{{column.name}}</span>
          </ng-template>
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            <span class="mobile-hidden">{{value}}</span>
          </ng-template>
        </ngx-datatable-column>

        <ngx-datatable-column name="Age">
        <!--
          <ng-template let-column="column" let-sort="sortFn" >
            <span class="mobile-hidden">{{column.name}}</span> 
          </ng-template>
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            <span class="mobile-hidden">{{value}}</span>
          </ng-template>
        -->
        </ngx-datatable-column>

        <ngx-datatable-column name="gender">
          <ng-template let-column="column" let-sort="sortFn" >
            <span class="mobile-hidden">{{column.name}}</span>
          </ng-template>
          <ng-template let-value="value" ngx-datatable-cell-template>
            <span class="mobile-hidden">{{value}}</span>
          </ng-template>
        </ngx-datatable-column>
    
      </ngx-datatable>
    
      

      <ng-template #cellTmpl let-row="row" let-value="value" ngx-datatable-cell-template>
        {{row.customer.name}}
        <br>
        {{row.customer.id}}
      </ng-template>
      
    </div>
  `,
  providers: []
})
export class MultipleSortComponent {
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  @ViewChild('cellTmpl') cellTmpl: TemplateRef<any>;

  rows = [];
  columns = [];
  // , pipe: this.testPipe
  // columns = [
  //   { name: 'customer', prop: 'object', header1: 'header1', header2: 'header2' },
  //   { name: 'Company' },
  //   { name: 'Name' },
  //   { name: 'Gender' }
  // ];



  constructor() {
    this.fetch((data) => {
      this.rows = data;
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
    req.open('GET', `demo/modified/objectInRow.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

}
