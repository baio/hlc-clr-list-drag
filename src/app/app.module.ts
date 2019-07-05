import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './planets-table.component';
import { AppComponent } from './app.component';
import { SWAPIService } from './swapi.service';
import { HttpClientModule } from '@angular/common/http';

import { ClrDatagridStateInterface } from '@clr/angular';
import {
    HlcClrTableModule,
    HLC_CLR_TABLE_DATA_PROVIDER_CONFIG,
    HLC_CLR_TABLE_PAGINATOR_ITEMS,
    PaginatorItems,
    Table,
    TableDataProviderConfig
} from '@ng-holistic/clr-list';

import { AppModels } from './app.models';

// TableDataProviderConfig provides proxy interfaces  
// between list application models and hlc-clr-list / hlc-clr-table component models.
// This proxy will be used for all tables inside the application, since app domain models must be the
// same (regarding filters, pagination, sorting; the row shape is generic) for every list inside app.
const tableDataProviderConfig: TableDataProviderConfig = {
    // Map component model to app domain model for requests.
    // When UI component recieve some user interaction (next page button clicked for example)
    // it will use this method to map component state (ClrDatagridStateInterface) to application model object
    // this object then wil be passed into `dataProvider.load` method in order to load data.
    mapState(state: ClrDatagridStateInterface): any {
        const page = state.page && state.page.from / state.page.size + 1;
        return {
            page
        } as AppModels.ListRequest;
    },
    // Map app domain response object to component model object.
    // After `dataProvider.load` load data they must be converted to component model structure
    // `Table.Data.Result` which hlc-clr-list / hlc-clr-table components know how to handle.
    mapResult(result: any): Table.Data.Result {
        const response = result as AppModels.ListResponse<any>;
        return {
            rows: response.items,
            paginator: {
                pageIndex: response.page,
                pageSize: 10,
                length: response.totalCount
            }
        };
    }
};

@NgModule({
  imports: [ BrowserModule, HttpClientModule, HlcClrTableModule.forRoot() ],
  declarations: [ AppComponent, TableComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
        SWAPIService,
        {
            provide: HLC_CLR_TABLE_DATA_PROVIDER_CONFIG,
            useValue: tableDataProviderConfig
        }
  ]
})
export class AppModule { }
