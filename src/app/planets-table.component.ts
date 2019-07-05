import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Table, TableDescription, HlcClrTableComponent } from '@ng-holistic/clr-list';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SWAPIService } from './swapi.service';
import * as R from 'ramda';

// Provide table UI definition in js object
const table: TableDescription = {
  cols: [
    {
      id: 'name',
      title: 'Name',
      sort: true
    },
    {
      id: 'population',
      title: 'Population',
      sort: false
    }
  ]
};

@Component({
  selector: 'my-planets-table',
  template: '<hlc-clr-table [dragEnabled]="true" (drop)="onDrop($event)" [table]="table" [dataProvider]="dataProvider"></hlc-clr-table>',
  styleUrls: ['./palnets-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TableComponent {
  readonly table = table;
  readonly dataProvider: Table.Data.DataProvider;

  @ViewChild(HlcClrTableComponent, { static: true }) tableComponent: HlcClrTableComponent;

  constructor(swapi: SWAPIService) {
    this.dataProvider = {
      load(state: any) {
        return swapi.planets(state).pipe(
          tap(console.log),
          catchError(err => {
            return throwError('SWAPI return error');
          })
        );
      }
    };
  }

  onDrop(dropEvent: Table.DropEvent) {
    // after row drop you must update rows in the table manually
    const rows = this.tableComponent.rows;
    const dragRow = rows[dropEvent.previousIndex];
    const updRows: Table.Row[] = R.pipe(
      R.remove(dropEvent.previousIndex, 1),
      R.insert(dropEvent.currentIndex, dragRow as any)
    )(rows) as any;
    this.tableComponent.rows = updRows;
  }
}
