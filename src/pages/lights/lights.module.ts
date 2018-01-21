import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LightsPage } from './lights';

@NgModule({
  declarations: [
    LightsPage,
  ],
  imports: [
    IonicPageModule.forChild(LightsPage),
  ],
})
export class LightsPageModule {}
