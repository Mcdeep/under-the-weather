import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Weather Service ...
import  {WeatherService}  from '../../providers/weather-service';
import {Config} from '../../providers/config'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  app_name: string;
  
  constructor(
    public navCtrl: NavController, 
    public wsService: WeatherService
    ) {

    this.app_name = Config.app_name;

    wsService.fetchWeatherByCity('London').subscribe(res =>{ 
      console.log('city',res);
    });

    wsService.fetchWeatherByGeoLocation("-25.7313","28.2184").subscribe(res =>{ 
      console.log('coords',res);
    });
  }



}
