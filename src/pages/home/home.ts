import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Geoposition } from '@ionic-native/geolocation';

// Services ...
import { WeatherService } from '../../providers/weather-service';
import { LocationService } from '../../providers/location-service';
import { Config } from '../../providers/config';


@Component({selector: 'page-home', templateUrl: 'home.html'})
export class HomePage {
  app_name : string;
  loaded: boolean = false;
  loading: boolean = false;
  day : Date;
  
  location : {
    city: string,
    code: string,
    country: string
  };

  loader : any;
  loadingMessage: string = 'Fetching location and weather forecast...';

  weatherInfo:{
    curTemp: string,
    minTemp: string,
    maxTemp: string,
    humid:string,
    main: string,
    mainDesc: string,
    wind: string
  }

  fiveDays = [];

  //Initialize Screen
  constructor(
    public navCtrl : NavController, 
    public wsService : WeatherService, 
    public lcService: LocationService, 
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
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
  }

  ionViewDidLoad(){
      this.loader = this.loadingCtrl.create({
        spinner: `bubbles`,
        content: this.loadingMessage
      });

      this.loader.present();
     //Subcribe to updates of the coordinates
     this.lcService.coords.subscribe((coords:Geoposition) => {
      if(coords){
        this.getWeatherInformationCoords(coords.coords.latitude.toString(), coords.coords.longitude.toString());
        this.getWeatherFiveDaysForcast(coords.coords.latitude.toString(), coords.coords.longitude.toString());
      }
    }, err =>{
      let alert = this.alertCtrl.create({
        title: 'Location error',
        subTitle: 'Failed to get Location',
        buttons: ['OK']
      });
      alert.present();
    })
    this.lcService.startTracking();
  }

  /**
   * Get Current Weather Information
   */
  getWeatherInformationCoords(lat: string, lon: string) {
     this.loading = true;
     this.wsService
      .fetchWeatherByGeoLocation(lat,lon)
      .subscribe(res => {
        //Successful Set weather information and Query Country Details
        this.setWeatherInformation(res);
      }, error => {
        //Error 
        let alert = this.alertCtrl.create({
          title: 'Connection Error',
          subTitle: 'Failed to retrieve weather forcast',
          buttons: ['OK']
        });
        alert.present();
      });
  }

  /**
   * Get Five Days Forcast
   */
  getWeatherFiveDaysForcast(lat: string, lon: string) {
    this.wsService
      .fetchFiveDayWeatherForcast(lat,lon)
      .subscribe(res => {
        //Successful Set weather information and Query Country Details
        if(res.cod == 200){
          this.setFiveDayForcast(res.list)
        }
      }, error => {
        //Error 
        let alert = this.alertCtrl.create({
          title: 'Connection Error',
          subTitle: 'Failed to retrieve weather forcast',
          buttons: ['OK']
        });
        alert.present();
      });
  }


  /** 
   * Set Five Days Forcast Weather Data
   *  */
  setFiveDayForcast(forcastData){
    this.fiveDays = [];

    let currentDay = this.day.getFullYear().toString() + "-" + ((this.day.getMonth() < 10) ? "0":"") + (this.day.getMonth() + 1).toString() + "-" + ((this.day.getDate() < 10) ? "0":"") + this.day.getDate().toString() ;

    console.log(currentDay)
    //load Forcast Data excluding dates alreay added
    forcastData.forEach(dayForcast => {
      let day = dayForcast['dt_txt'].split(" ")[0];
      if(currentDay !== day){
        this.fiveDays.push(dayForcast);
        currentDay = day;
      }
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
      main: this.mapWeatherIcon(WeatherData.weather[0].main),  //For Mapping the Image Icon
      mainDesc: WeatherData.weather[0].description,
      wind: WeatherData.wind.speed
    }

    this.loaded = true;
    this.loader.dismiss();
    //Fetch Country Code
    this.loadingMessage = "Almost there...";
    this.wsService.fetchCountryByCode(this.location.code).subscribe((country) => {
        this.location.country = country.name;
    }, err => {
      //Handle Error;
      let alert = this.alertCtrl.create({
          title: 'Location Error',
          subTitle: 'Failed to retrieve location details',
          buttons: ['OK']
        });
        alert.present();
    });
  }

  //Maps Weather condition to Ionic Icons Whick will default to sunny
  mapWeatherIcon(mainWeather: string): string{
    let IconStr;
    switch(mainWeather){
      case 'Rain': 
        IconStr = 'rainy';
        break;
      case 'Clouds':
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
