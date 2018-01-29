import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { WifiProvider } from '../../providers/wifi/wifi';

/**
 * Generated class for the ModuleWifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-module-wifi',
  templateUrl: 'module-wifi.html',
})
export class ModuleWifiPage {

  private uiStart = true;
  private loadingNotif;
  private callbackFunction;

  private listWifis = new Array();
  private moduleMacAddress;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public wifiProvider: WifiProvider) {
      this.callbackFunction = this.navParams.get("callback");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModuleWifiPage");
  }

  // Estabelecer comunicação com o atuador
  public settingCommunication() {
    console.log("settingNetwork ModuleWifiPage");

    this.loadingNotif = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    this.loadingNotif.present();

    if(!this.wifiProvider.settingModuleCommunication(this))
      this.loadingNotif.dismiss();
  }

  // Comunicação estabelecida com sucesso
  public communicationSucess() {
    console.log("communicationSucess ModuleWifiPage");

    // Requisitar lista de redes Wi-Fi disponíveis ao atuador
    this.wifiProvider.settingModuleGetListWifis().subscribe(
      data => {
        this.uiStart = false;
        const response = (data as any)._body;
        this.listWifis = JSON.parse(response);

        // Requisitar endereço MAC
        this.wifiProvider.settingModuleGetMAC().then(
          data => {
            this.moduleMacAddress = data.gatewayMacAddress.toUpperCase();
          },
          error => {
            this.moduleMacAddress = "";
          }
        );
      },
      error => {
        this.loadingNotif.dismiss();
        this.msgFailure();
      }
    );
  }

  // Comunicação com o atuador falhou
  public communicationFailure() {
    console.log("communicationFailure ModuleWifiPage");
    this.loadingNotif.dismiss();
    this.msgFailure();
  }

  // Mensagem de falha na comunicação
  private msgFailure() {
    this.alertCtrl.create({
      title: "Falha na configuração",
      subTitle: "Não foi possível comunicar-se com o atuador.",
      buttons: ["Ok"]
    }).present();
  }

  // Solicitar senha de rede Wi-Fi indicada para o atuador
  public getPasswordToWifi(wifi: any) {
    this.alertCtrl.create({
      title: wifi.ssid,
      subTitle: "Preencha a senha de acesso a rede Wi-Fi para o atuador.",
      inputs: [
        {
          // DAVI: campos de texto começarem com letra minúscula
          name: "password",
          placeholder: "Digite a senha"
        },
        {
          name: "passwordCheck",
          placeholder: "Digite novamente a senha"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: data => {
            return;
          }
        },
        {
          text: "Salvar",
          handler: data => {
            if(data.password != data.passwordCheck) {
              this.toastCtrl.create({
                message: "A senha deve ser confirmada.",
                duration: 5000,
                position: "middle"
              }).present();
              return;
            }
            this.sendPasswordToWifi(wifi, data.password);
          }
        }
      ]
    }).present();
  }

  // Enviar credenciais da rede Wi-Fi indicada para o atuador
  private sendPasswordToWifi(wifi: any, password: string) {
    this.wifiProvider.settingModuleSetWifi(wifi, password).subscribe(
      data => {
        this.toastCtrl.create({
          message: "Preencha um nome.",
          duration: 3000,
          position: "middle"
        }).present();

        // Callback para a página ModulePage
        this.callbackFunction(this.moduleMacAddress).then(() => {
          this.navCtrl.pop();
        });
      },
      error => {
        this.msgFailure();
      }
    );
  }
}