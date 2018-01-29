import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MqttProvider } from '../../providers/mqtt/mqtt';

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
    private toastCtrl: ToastController,
    public dataProvider: DataProvider,
    public mqttProvider: MqttProvider) {
  }

  // Atualizar o formulário
  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");

    this.serverAddress = this.dataProvider.getServerAddress();
    this.userId        = this.dataProvider.getUser();
  }

  // Salvar/atualizar dados
  public saveSettings() {
    console.log("saveSettings SettingsPage");

    let message;

    if(this.serverAddress != "" && this.userId != "") {
      this.dataProvider.setServerAddress(this.serverAddress);
      this.dataProvider.setUser(this.userId);

      this.navCtrl.pop();
      this.mqttProvider.connectServer();

      message = "Salvo com sucesso.";
    } else
      message = "Preencha todo o formulário.";

    this.toastCtrl.create({
      message: message,
      position: "middle",
      duration: 1000
    }).present();
  }

}
