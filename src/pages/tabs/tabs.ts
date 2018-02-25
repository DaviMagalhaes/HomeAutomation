import { Component } from '@angular/core';

import { LightsPage } from '../lights/lights';
import { PlugsPage } from '../plugs/plugs';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LightsPage;
  tab2Root = PlugsPage;

  constructor() {
    
  }
}
