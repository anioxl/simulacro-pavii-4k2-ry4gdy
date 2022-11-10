import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    //this.resourceUrl = environment.ConexionWebApiProxy + 'Estudiantes/';
    this.resourceUrl = 'https://pavii2022.azurewebsites.net/api/estudiantes/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl, { });
  }

  post(obj: Estudiante) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

}
