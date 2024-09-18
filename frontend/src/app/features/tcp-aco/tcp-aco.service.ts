import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlAPI } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class TcpAcoService {
  constructor(private http: HttpClient) { }

  startAlgorithm() {
    return this.http.post(`${urlAPI}/start-algorithm/`, {});
  }

  stopAlgorithm() {
    return this.http.post(`${urlAPI}/stop-algorithm/`, {});
  }
}
