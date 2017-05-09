import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

//Weather Service ...
import {WeatherService} from '../../providers/weather-service';
import {Config} from '../../providers/config'

@Component({selector: 'page-home', templateUrl: 'home.html'})
export class HomePage {
  app_name : string;
  day : Date;
  
  location : {
    city: string,
    code: string,
    country: string
  };

  weatherInfo:{
    curTemp: string,
    minTemp: string,
    maxTemp: string,
    humid:string,
    main: string,
    mainDesc: string,
    wind: string
  }

  //Initialize Screen
  constructor(public navCtrl : NavController, public wsService : WeatherService) {
    this.app_name = Config.app_name;
    this.day = new Date();
    this.location = {
      city: '',
      code:'',
      country: ''
    }
    this.weatherInfo = {
      curTemp: '', minTemp: '', main: '', mainDesc: '', maxTemp: '', humid:'', wind:''
    };
    this.getWeatherInformation();
  }


  /**
   * Get Current Weather Information
   */
  getWeatherInformation() {
    this.wsService
      .fetchWeatherByGeoLocation("-25.7313", "28.2184")
      .subscribe(res => {
        //Successful Set weather information and Query Country Details
        this.setWeatherInformation(res);
      }, error => {
        //Error 
      });
  }

  /**
   * Sets the weather information given the response
   */
  setWeatherInformation(WeatherData : any) {
    this.location = {
      city:  WeatherData.name,
      code: WeatherData.sys.country,
      country: ''
    }
  
    this.weatherInfo = {
      curTemp: WeatherData.main.temp,
      humid: WeatherData.main.humidity,
      minTemp: WeatherData.main.temp_min, 
      maxTemp: WeatherData.main.temp_max,
      main: this.mapWeatherIcon(WeatherData.weather[0].main),  //For Image
      mainDesc: WeatherData.weather[0].description,
      wind: WeatherData.wind.speed
    }

    //Fetch Country Code
    this.wsService.fetchCountryByCode(this.location.code).subscribe((country) => {
      this.location.country = country.name;
    }, err => {
      //Handle Error;
    })
  }


  //Maps Weather condition to Ionic Icons Whick will default to sunny
  mapWeatherIcon(mainWeather: string): string{
    let IconStr;
    switch(mainWeather){
      case 'Rain': 
        IconStr = 'rainy';
        break;
      case 'Cloud':
        IconStr = 'cloudy';
        break;
      case 'Snow':
        IconStr = 'snow';
        break;
      case 'Extreme':
        IconStr = 'thunderstorm';
        break;
      case 'Mist':
        IconStr = 'eye-off';
       break;
      default:
        IconStr = 'sunny';
        break;
    }
    return IconStr;
  }
}
