import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  // Atributos
  private serverAddress: string;
  private userId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider) {
  }

  // Atualizar o formulário
  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");

    this.serverAddress = this.dataProvider.getServerAddress();
    this.userId        = this.dataProvider.getUser();
  }

}
