import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class FontChangesService {

  fontSource = new BehaviorSubject('default font');
  columnSource = new BehaviorSubject('default column');
  currentFont = this.fontSource.asObservable();
  currentColumn = this.columnSource.asObservable();

  changeFont(font: string, column: string) {
    this.columnSource.next(column);
    this.fontSource.next(font);
  }

}
