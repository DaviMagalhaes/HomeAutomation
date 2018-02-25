import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttProvider } from '../../providers/mqtt/mqtt';
import { DataProvider } from '../../providers/data/data';
import { SettingsPage } from '../settings/settings';
import { ModulePage } from '../module/module';

/**
 * Generated class for the LightsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lights',
  templateUrl: 'lights.html'
})
export class LightsPage {

  // Lista de módulos / Luzes
  private listLights = new Array();

  // Chave
  private keyLights: string = "lights";
  private keyTopicIn: string = "/in";
  private keyTopicOut: string = "/out";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public mqttProvider: MqttProvider) {
      mqttProvider.addControl(this);
  }

  // Atualizar a lista de módulos e comunicação com o servidor
  ionViewDidLoad() {
    console.log("ionViewDidLoad LightsPage");

    this.listLights = this.dataProvider.getListLights();
    this.serverSubscribe();
  }

  // Atualizar a lista de módulos
  ionViewWillEnter() {
    console.log("ionViewWillEnter LightsPage");
    this.listLights = this.dataProvider.getListLights();
  }

  // Inscrever-se no servidor
  private serverSubscribe() {
    if(this.listLights.length > 0) {
      this.listLights.forEach((elem) => {
        this.mqttProvider.subscribe(elem.token + this.keyTopicOut);
      });
    }
  }

  // Executar função de módulo
  private functionLight(item: any) {
    console.log("functionLight LightsPage:", item);
    this.mqttProvider.publish(item.active ? "1" : "0", item.token + this.keyTopicIn);
  }

  // Atualizar status de módulo
  public updateStatus(token: string, active: boolean) {
    let item = this.listLights.find(function(element) {
      return element.token == token;
    });

    if(item) {
      item.active = active;
      console.log("updateStatus LightsPage:", item);
      this.dataProvider.saveModule(item, this.keyLights);
    }
  }

  // Adicionar módulo
  private addModule() {
    this.navCtrl.push(ModulePage, {moduleType: this.keyLights, callback: this.addModuleComm});
  }

  // Comunicar-se com novo módulo
  addModuleComm = (_params) => {
    return new Promise((resolve, reject) => {
        let moduleAdded = _params;
        this.mqttProvider.subscribe(moduleAdded.token + this.keyTopicOut);
        resolve();
    });
  }

  // Editar definições de módulo
  private editModule(item: any) {
    this.navCtrl.push(ModulePage, {moduleType: this.keyLights, tokenSearch: item.token});
  }

  // Abrir configurações do usuário
  private openSettings() {
    this.navCtrl.push(SettingsPage);
  }

}
