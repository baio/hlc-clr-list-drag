import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppModels } from './app.models';

// This is dto response model common for all lists
interface ListResponseDTO {
    count: number;
    previous: string;
    next: string;
    results: any[];
}

// Request: Map app domain model to dto model
const mapRequestDto = (appRequest: AppModels.ListRequest) => ({
    page: appRequest.page ? appRequest.page.toString() : '1'
});

// Response: Map dto model to app domain model
const mapResponseDto = <T>(mapItem: (item: any) => T) => (response: ListResponseDTO): AppModels.ListResponse<T> => ({
    totalCount: response.count,
    page: response.next ? parseInt(response.next.split('=')[1]) - 1 : parseInt(response.previous.split('=')[1]) + 1,
    items: response.results.map(mapItem)
});

const mapPlanet = (dto: any): AppModels.Planet => ({
    id: dto.created,
    name: dto.name,
    population: parseInt(dto.population) || undefined
});

// Just regular rest service, publically expose API which works only with App Domain objects
// this is not requirement of ng-holistic library itself but it is good for any application architecture
@Injectable()
export class SWAPIService {
    constructor(private readonly httpClient: HttpClient) {}

    planets(request: AppModels.ListRequest) {
        // convert request app domain model to dto request model
        const requestDto = mapRequestDto(request);
        return this.httpClient
            .get('https://swapi.co/api/planets', {
                params: requestDto
            })
            .pipe(map(mapResponseDto(mapPlanet)));
    }
}
