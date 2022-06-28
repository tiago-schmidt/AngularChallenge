import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OPEN_WHEATER_API_KEY, OPEN_WHEATER_BASE_URL } from '../utils/consts';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherInformation(city: string) {
    return this.http.get(`${OPEN_WHEATER_BASE_URL}${city}&appid=${OPEN_WHEATER_API_KEY}`);
  }
}
