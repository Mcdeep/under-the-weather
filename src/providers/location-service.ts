import {Injectable, NgZone} from '@angular/core';
// import {BackgroundGeolocation} from '@ionic-native/background-geolocation';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {BehaviorSubject} from 'rxjs';
import 'rxjs/add/operator/filter';

/*
	Generated class for the LocationService provider.
	Used to capture the Users current location
*/
@Injectable()
export class LocationService {

		public watch : any;
		public coords: BehaviorSubject<Geoposition> =  new BehaviorSubject(null);
		options = {
					timeout: 5000,
					frequency: 5000, 
					enableHighAccuracy: true
		};

		constructor(public zone : NgZone, public geolocation : Geolocation) {}

		//One Time Location
		getCurrentLocationCoords(){
			return this.geolocation.getCurrentPosition(this.options);
		}
		//Track device Location
		startTracking() {
				this.watch = this.geolocation.watchPosition(this.options).subscribe((position) => {
					// Run update inside of Angular's zone
					console.log(JSON.stringify(position))
					this.coords.next(position);
				}, err => {
					console.log('Error Loading')
					console.log('sssss',err)
				});
		}

		stopTracking() {
			this.watch.unsubscribe();
		}
}
