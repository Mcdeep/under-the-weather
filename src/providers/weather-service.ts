import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config'
import 'rxjs/add/operator/map';


/*
	Weather App Service for making external http calls and Geo Locations
*/
@Injectable()
export class WeatherService {

	constructor(public http: Http) {}

	fetchWeatherByCity(cityName: string){
		return this.fetchData(this.buildURI('CITY', cityName));
	}

	fetchWeatherByCityId(cityId: string){
		return this.fetchData(this.buildURI('CID', cityId));
	}

	fetchWeatherByGeoLocation(lat: string,lon: string){
		let info = `lat=${lat}&lon=${lon}`;
		return this.fetchData(this.buildURI('GEO', info));
	}

	//Fetch Country Details by Code EG ZA
	fetchCountryByCode(countryCode: string){
		let country_uri = Config.country_api_uri + countryCode;
		return this.fetchData(country_uri);
	}

	fetchData(url:string){
		return this.http.get(url).map(res => res.json())
	}

	getDeviceGeoLocation(){

	}

	/*Method will default to Geo Location*/
	buildURI(type: string, info) : string{
		let uri = Config.weather_api_uri;
		switch(type){
			case 'CITY':
			 	uri += '?q='
				break;
			case 'CID':
			 	uri += '?id='
				break;
			 default:
				uri += '?'
		}
		//Setting Weather Application Key and return url
		return uri += info + `&appid=${Config.weather_api_key}`;
	}
}
