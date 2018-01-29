import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModuleWifiPage } from './module-wifi';

@NgModule({
  declarations: [
    ModuleWifiPage,
  ],
  imports: [
    IonicPageModule.forChild(ModuleWifiPage),
  ],
})
export class ModuleWifiPageModule {}
