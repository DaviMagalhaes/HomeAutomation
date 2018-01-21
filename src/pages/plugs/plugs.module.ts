import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlugsPage } from './plugs';

@NgModule({
  declarations: [
    PlugsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlugsPage),
  ],
})
export class PlugsPageModule {}
