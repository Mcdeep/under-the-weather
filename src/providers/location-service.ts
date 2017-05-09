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
					frequency: 3000, 
					enableHighAccuracy: true
		};

		constructor(public zone : NgZone, public geolocation : Geolocation) {}

		//Track device Location
		startTracking() {
				console.log('Watching ')
				this.watch = this.geolocation.watchPosition(this.options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
					// Run update inside of Angular's zone
					this.zone.run(() => {
						this.coords.next(position);
					});
				});
		}

		stopTracking() {
			this.watch.unsubscribe();
		}
}
