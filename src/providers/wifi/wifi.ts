import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { AlertController } from 'ionic-angular';
import { ModuleWifiPage } from '../../pages/module-wifi/module-wifi';
import { DataProvider } from '../data/data';

/*
  Generated class for the WifiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WifiProvider {

  // Chaves
  private keyWifiServer: string = "http://10.0.1.1";
  private keyWifiSsid: string = "HomeAutomation";
  private keyWifiPw: string = "12345678";

  constructor(
    public alertCtrl: AlertController,
    public dataProvider: DataProvider,
    private hotspot: Hotspot,
    public http: Http) {
    console.log("constructor WifiProvider");
  }

  // CONFIGURAR COMUNICAÇÃO COM O ATUADOR
  public settingModuleCommunication(moduleWifiPage: ModuleWifiPage): boolean {
    console.log("settingModuleNetwork WifiProvider");

    // DAVI: testar sob build. Verificar se há suporte a Wi-Fi no smartphone
    if(!this.hotspot.isWifiSupported()) {
      console.log("wifi not suported WifiProvider");
      this.alertCtrl.create({
        title: "Wi-Fi não suportado",
        subTitle: "Seu aparelho não possui suporte ao Wi-Fi. Não será possível configurar seu atuador por meio deste aplicativo.",
        buttons: ["OK"]
      }).present();
      return false;
    }

    // DAVI: testar sob build. Verificar se o Wi-Fi está disponível
    if(!this.hotspot.isWifiOn()) {
      console.log("wifi not available WifiProvider");
      this.alertCtrl.create({
        title: "Wi-Fi desativado",
        subTitle: "É preciso ativar seu Wi-Fi para configurar o atuador.",
        buttons: ["OK"]
      }).present();
      return false;
    }

    // Listar as redes Wi-Fi disponíveis
    this.hotspot.scanWifi().then((listNetwork: Array<HotspotNetwork>) => {
      console.log("listNetwork WifiProvider:", listNetwork);
      const keyWifiSsid = this.keyWifiSsid;
      
      // Buscar a rede padrão dos atuadores
      if(listNetwork) {
        let itemFind = listNetwork.find(function(element) {
          return element.SSID == keyWifiSsid;
        });

        // Atuador não encontrado
        if(!itemFind) {
          console.log("module not found WifiProvider");
          
          this.alertCtrl.create({
            title: "Não encontrado",
            subTitle: "Nenhum atuador foi encontrado durante a busca. Verifique se o atuador encontra-se ligado ou se já não está configurado.",
            buttons: ["OK"]
          }).present();
          return false;
        }
      }

      // Atuador encontrado / Conecta-se ao ponto de acesso do atuador
      console.log("connecting to the access point of the module WifiProvider");
      this.hotspot.connectToWifi(this.keyWifiSsid, this.keyWifiPw).then(
        data => {
          // Sucesso
          moduleWifiPage.communicationSucess();
        },
        error => {
          // Erro
          moduleWifiPage.communicationFailure();
        }
      );
      return true;
    });
  }

  // CONFIGURAR COMUNICAÇÃO COM O ATUADOR: Pegar endereço MAC para token
  public settingModuleGetMAC() {
    return this.hotspot.getNetConfig();
  }

  // CONFIGURAR COMUNICAÇÃO COM O ATUADOR: Listar redes Wi-Fi disponíveis ao atuador
  public settingModuleGetListWifis() {
    return this.http.get(this.keyWifiServer +"/wifijson");
  }

  // CONFIGURAR COMUNICAÇÃO DO ATUADOR: Enviar credenciais de rede Wi-Fi e servidor MQTT para o atuador
  public settingModuleSetWifi(wifi: any, password: string) {
    return this.http.get(
      this.keyWifiServer +"/wifisave?s="+ wifi.ssid +"&p="+ password +
      "&m="+ this.dataProvider.getServerAddress() + "&c=" + this.dataProvider.getUser()
    );
  }

}
