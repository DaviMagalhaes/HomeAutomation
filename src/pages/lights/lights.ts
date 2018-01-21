import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttProvider } from '../../providers/mqtt/mqtt';

/**
 * Generated class for the LightsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lights',
  templateUrl: 'lights.html',
  providers: [
    MqttProvider
  ]
})
export class LightsPage {

  // Lista de módulos / Luzes
  private listLights = new Array();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mqttProvider: MqttProvider) {
  }

  // Atualiza a lista de módulos
  ionViewDidLoad() {
    let obj1 = {name:"Sala2", active:true, token:"sdgfdbgtbet"};
    let obj2 = {name:"Quarto", active:false, token:"sdgfdbgtbet"};

    this.listLights.push(obj1, obj2);
  }

  // Executa função do módulo
  private functionLight(item:any) {
    console.log(item);
  }

  // Editar definições do módulo
  private editModule(item:any) {
    console.log(item);
  }

  // Adicionar módulo
  private addModule() {
    console.log("addModule");
  }

  // Abrir configurações
  private openSettings() {
    console.log("openSettings");
  }

}
