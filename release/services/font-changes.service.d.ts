import { Observable, BehaviorSubject } from 'rxjs';
export declare class FontChangesService {
    fontSource: BehaviorSubject<string>;
    columnSource: BehaviorSubject<string>;
    currentFont: Observable<string>;
    currentColumn: Observable<string>;
    changeFont(font: string, column: string): void;
}
