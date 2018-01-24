import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LightsPage } from '../pages/lights/lights';
import { PlugsPage } from '../pages/plugs/plugs';
import { SettingsPage } from '../pages/settings/settings';
import { ModulePage } from '../pages/module/module';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MqttProvider } from '../providers/mqtt/mqtt';
import { HttpModule } from '@angular/http';
import { LongPressModule } from 'ionic-long-press';
import { DataProvider } from '../providers/data/data';

@NgModule({
  declarations: [
    MyApp,
    LightsPage,
    PlugsPage,
    SettingsPage,
    ModulePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LongPressModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LightsPage,
    PlugsPage,
    SettingsPage,
    ModulePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MqttProvider,
    DataProvider
  ]
})
export class AppModule {}
