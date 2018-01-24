import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttProvider } from '../../providers/mqtt/mqtt';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the PlugsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plugs',
  templateUrl: 'plugs.html'
})
export class PlugsPage {

  // Lista de módulos / Tomadas
  private listPlugs = new Array();
  
  // Chave
  private keyPlugs: string = "plugs";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public mqttProvider: MqttProvider) {
      mqttProvider.addControl(this);
  }

  // Atualizar a lista de módulos e comunicação com o servidor
  ionViewDidLoad() {
    console.log("ionViewDidLoad PlugsPage");

    this.listPlugs = this.dataProvider.getListPlugs();
    this.serverSubscribe();
  }

  // Inscrever-se no servidor
  private serverSubscribe() {
    if(this.listPlugs.length > 0)
      this.mqttProvider.subscribe(this.keyPlugs +"/+");
  }

  // Executar função de módulo
  private functionPlug(item: any) {
    console.log("functionPlug PlugsPage:", item);

    let topic = this.keyPlugs +"/"+ item.token;
    this.mqttProvider.publish(item.active ? "1" : "0", topic);
  }

  // Atualizar status de módulo
  public updateStatus(token: string, active: boolean) {
    let item = this.listPlugs.find(function(element) {
      return element.token == token;
    });

    console.log("updateStatus PlugsPage:", token, active);

    if(item)
      item.active = active;
  }

  // Adicionar módulo
  private addModule() {
    console.log("addModule");
  }

  // Remover módulo
  private rmModule() {
    console.log("rmModule");

  }

  // Editar definições de módulo
  private editModule(item: any) {
    console.log("editModule");
  }

  // Abrir configurações do usuário
  private openSettings() {
    console.log("openSettings");
  }

}
