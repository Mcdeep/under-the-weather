import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController,Platform } from 'ionic-angular';

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
		private alertCtrl: AlertController,
		private plartform: Platform) {
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

	/**
	 * Show Loading
	*/
	showLoading (message: string){
		this.loader = this.loadingCtrl.create( {
			spinner:'crescent',
			content: message
		});
		this.loader.present();
	}

	showErrorMessage (message: string){
		let alert = this.alertCtrl.create({
			title: 'Connection Error',
			subTitle: message,
			enableBackdropDismiss: false,
			buttons: [
				{
					text: 'Try again',
					handler: () => {
						this.searchCity()	
					}
				}
				,{
					text: 'Quit',
					handler: () => {
						this.plartform.exitApp()	
					}
				}]
		});
		this.loader.dismiss();
		alert.present();
	}

	ionViewDidLoad(){
		 //Subcribe to updates of the coordinates
		this.showLoading("Fetching location and weather forecast...");

		this.lcService.getCurrentLocationCoords().then( ({coords}) => {
			 this.getWeatherInformationCoords(coords.latitude.toString(), coords.longitude.toString());
			 this.getWeatherFiveDaysForcast(coords.latitude.toString(), coords.longitude.toString());
		 }).catch(err => {
			 this.loader.dismiss()
			 let alert = this.alertCtrl.create({
					title: 'Location error',
					subTitle: 'Failed to get your location',
					enableBackdropDismiss:false,
					buttons: [
						{
							text: 'Enter city name',
							handler: () => {
								let cityAlert = this.alertCtrl.create({
									title: 'Search by city name',
									inputs:[{
										name: 'city',
										placeholder:'Enter City',
									}],
									buttons: [{
										text:'Search',
										handler: data => {
											this.getWeatherInformationCity(data.city);
										}
									}]
								})
								cityAlert.present();	
							}
						},
						{
							text: 'Quit',
							handler: () => {
								this.plartform.exitApp()	
							}
						}	
					]
				});
			alert.present();
		 })

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
				this.showErrorMessage("Failed to find city by coordinates");
			});
	}

	/**
	 * Get Current Weather Information Using City
	 */
	getWeatherInformationCity(city:string) {
		this.showLoading("Fetching Location by City");
		 this.loading = true;
		 this.wsService
			.fetchWeatherByCity(city)
			.subscribe(res => {
				//Successful Set weather information and Query Country Details
				this.setWeatherInformation(res);
				this.getWeatherFiveDaysForcastByCity(city);
			}, error => {
				//Error 
				this.showErrorMessage("Could not find the City");
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
				this.showErrorMessage("Failed to get five day forecast");
			});
	}
	/**
	 * Get Five Days Forcast
	 */
	getWeatherFiveDaysForcastByCity(city: string) {
		this.wsService
			.fetchFiveDayWeatherForcastByCity(city)
			.subscribe(res => {
				//Successful Set weather information and Query Country Details
				if(res.cod == 200){
					this.setFiveDayForcast(res.list)
				}
			}, error => {
				//Error 
				this.showErrorMessage("Failed to get five day forecast");
			});
	}




	/** 
	 * Set Five Days Forcast Weather Data
	 *  */
	setFiveDayForcast(forcastData){
		this.fiveDays = [];
		let currentDay = this.day.getFullYear().toString() + "-" + ((this.day.getMonth() < 10) ? "0":"") + (this.day.getMonth() + 1).toString() + "-" + ((this.day.getDate() < 10) ? "0":"") + this.day.getDate().toString() ;
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
		
		//Fetch Country Code
		this.wsService.fetchCountryByCode(this.location.code).subscribe((country) => {
				this.loader.dismiss();
				this.location.country = country.name;
		}, err => {
			//Handle Error;
			this.showErrorMessage("Failed to get county by code");
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


	retryFetch (){
		this.ionViewDidLoad();
	}

	searchCity (){
		let cityAlert = this.alertCtrl.create({
			title: 'Search by city name',
			inputs:[{
				name: 'city',
				placeholder:'Enter City',
			}],
			buttons: [{
				text:'Search',
				handler: data => {
					this.getWeatherInformationCity(data.city);
				}
			}]
		})
		cityAlert.present();
	}
}
