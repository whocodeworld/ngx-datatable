import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';


@Injectable()
export class FontChangesService {


  private fontSource = new BehaviorSubject('default font');
  private columnSource = new BehaviorSubject('default column');

  currentFont = this.fontSource.asObservable();
  currentColumn = this.columnSource.asObservable();

  constructor() { }

  changeFont(font: string, column) {
    this.columnSource.next(column);
    this.fontSource.next(font);
  }

}