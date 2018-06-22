import { TableColumn } from '../types';
import { DataTableColumnDirective } from '../components/columns';
import { camelCase, deCamelCase } from './camel-case';
import { id } from './id';
import { getterForProp } from './column-prop-getters';

/**
 * Sets the column defaults
 */
export function setColumnDefaults(columns: TableColumn[]) {
  if (!columns) return;

  for (const column of columns) {
    if (!column.$$id) {
      column.$$id = id();
    }

    // prop can be numeric; zero is valid not a missing prop
    // translate name => prop
    if (isNullOrUndefined(column.prop) && column.name) {
      column.prop = camelCase(column.name);
    }

    if (!column.$$valueGetter) {
      column.$$valueGetter = getterForProp(column.prop);
    }

    // format props if no name passed
    if (!isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = deCamelCase(String(column.prop));
    }

    if (isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = ''; // Fixes IE and Edge displaying `null`
    }

    /*
         * the column-helper should be able to extract header name from 
         * http response
        */
    if (!isNullOrUndefined(column.header1)) {
      column.header1 = deCamelCase(String(column.header1)).toLowerCase();
    }
    if (!isNullOrUndefined(column.header2)) {
      column.header2 = deCamelCase(String(column.header2)).toLowerCase();
    }
    if (!isNullOrUndefined(column.header1Title)) {
      column.header1Title = deCamelCase(String(column.header1Title));
    }
    if (!isNullOrUndefined(column.header2Title)) {
      column.header2Title = deCamelCase(String(column.header2Title));
    }

    if(!column.hasOwnProperty('modified')) {}

    if (!column.hasOwnProperty('resizeable')) {
      column.resizeable = true;
    }

    if (!column.hasOwnProperty('sortable')) {
      column.sortable = true;
    }

    if (!column.hasOwnProperty('draggable')) {
      column.draggable = true;
    }

    if (!column.hasOwnProperty('canAutoResize')) {
      column.canAutoResize = true;
    }

    if (!column.hasOwnProperty('width')) {
      column.width = 150;
    }
  }
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Translates templates definitions to objects
 */
export function translateTemplates(templates: DataTableColumnDirective[]): any[] {
  const result: any[] = [];

  for (const temp of templates) {
    const col: any = {};

    const props = Object.getOwnPropertyNames(temp);
    for (const prop of props) {
      col[prop] = temp[prop];
    }

    if (temp.headerTemplate) {
      col.headerTemplate = temp.headerTemplate;
    }

    if (temp.cellTemplate) {
      col.cellTemplate = temp.cellTemplate;
    }

    if (temp.summaryFunc) {
      col.summaryFunc = temp.summaryFunc;
    }

    if (temp.summaryTemplate) {
      col.summaryTemplate = temp.summaryTemplate;
    }

    result.push(col);
  }

  return result;
}
