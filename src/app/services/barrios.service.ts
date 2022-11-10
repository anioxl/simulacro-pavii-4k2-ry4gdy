import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Articulo } from '../models/articulo';
import { Barrio } from '../models/barrio';


@Injectable({
  providedIn: 'root',
})
export class BarriosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    //this.resourceUrl = environment.ConexionWebApiProxy + 'Articulos/';
    this.resourceUrl = 'https://pavii2022.azurewebsites.net/api/barrios/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl, { });
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

}
