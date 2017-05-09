import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';

//App and Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//Services
import { WeatherService } from '../providers/weather-service';
import { LocationService } from '../providers/location-service';
import { TempToPipe } from '../providers/units-filter';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TempToPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    BackgroundGeolocation,
    Geolocation,
    StatusBar,
    SplashScreen,
    WeatherService,
    LocationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
