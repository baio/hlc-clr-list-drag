
// App domain models is here
export namespace AppModels {

    export interface ListRequest {
        page?: number;
    }

    export interface ListResponse<T> {
        totalCount: number;
        page: number;
        items: T[];
    }

    export interface Planet {
        id: string;
        name: string;
        population?: number;
    }

}