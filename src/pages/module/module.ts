import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModuleWifiPage } from '../module-wifi/module-wifi';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ModulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-module',
  templateUrl: 'module.html',
})
export class ModulePage {

  private moduleType: string;
  private tokenSearch: string;
  private pageTitle: string;
  
  private module = {
    name: "",
    active: false,
    token: ""
  };

  // Chaves
  private keyLights: string = "lights";
  private keyPlugs: string = "plugs";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dataProvider: DataProvider) {

    this.moduleType = navParams.get("moduleType");
    this.tokenSearch = navParams.get("tokenSearch") ? navParams.get("tokenSearch") : null;

    this.pageTitle = this.tokenSearch ? "Editar " : "Adicionar ";
    this.pageTitle = this.pageTitle.concat(this.moduleType == this.keyLights ? "luz" : "tomada");
  }

  // Atualizar formulário
  ionViewDidLoad() {
    console.log("ionViewDidLoad ModulePage");

    // Editando módulo
    if(this.tokenSearch) {
      this.module = this.dataProvider.getModule(this.tokenSearch);
      if(!this.module) this.navCtrl.pop();

      console.log("editing module ModulePage:", this.module);
    }
  }

  // Salvar módulo
  public saveModule() {
    console.log("saveModule ModulePage:", this.module);

    if(this.module.name == "" || this.module.token == "") {
      this.toastCtrl.create({
        message: "Preencha todos os campos.",
        duration: 3000,
        position: "middle"
      }).present();
      return;
    }

    this.dataProvider.saveModule(this.module, this.moduleType);
    this.navCtrl.pop();
  }

  // Deletar módulo
  public deleteModule() {
    console.log("deleteModule ModulePage", this.module);

    let confirm = this.alertCtrl.create({
      title: "Excluir módulo",
      message: `Tem certeza que deseja excluir o módulo ${this.module.name}?`,
      buttons: [
        {
          text: "Cancelar"
        },
        {
          text: "Excluir",
          handler: () => {
            this.dataProvider.deleteModule(this.module, this.moduleType);
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  // Abrir configurações WI-FI do módulo
  public settingsWifi() {
    console.log("settingsWifi ModulePage");
    this.navCtrl.push(ModuleWifiPage, {callback: this.setModuleToken});
  }

  // Definir token do módulo / Callback para ModuleWifiPage
  setModuleToken = (_params) => {
    return new Promise((resolve, reject) => {
        this.module.token = _params;
        this.tokenSearch = _params;
        resolve();
    });
  }

}
