import { Injectable } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';
import { DataProvider } from '../data/data';
import { ToastController } from 'ionic-angular';
import { Toast } from 'ionic-angular/components/toast/toast';

/*
  Generated class for the MqttProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  -------

  TOPICS:
    Message input:  <MAC_address>/out
    Message output: <MAC_address>/in

  QOS:
    1
*/
@Injectable()
export class MqttProvider {

  private client;
  private listControls = new Array<any>(); // Para comunicação em duas vias
  private listPendingSubscribe = new Array<string>();
  private toast: Toast;

  // Chave
  private keyMsgSync: string = "s";
  private keyTopicIn: string = "/in";
  private keyTopicOut: string = "/out";

  private keyDColor: string = "color: aqua";
  
  constructor(
    private toastCtrl: ToastController,
    private dataProvider: DataProvider
  ) {
    console.log("constructor MqttProvider");
    this.connectServer();
  }

  // Conectar ao servidor
  public connectServer() {
    let serverAddress = this.dataProvider.getServerAddress();
    let serverPort    = this.dataProvider.getServerPort();
    let serverUser    = this.dataProvider.getServerUser();
    let serverPw      = this.dataProvider.getServerPw();

    console.log("connectServer MqttProvider");
    console.log("connecting to server:", serverAddress, serverPort, serverUser);

    let clientId = 
      (Math.floor(Math.random()*(Math.pow(10, 10)-Math.pow(10, 9)))+Math.pow(10, 9)).toString();

    this.client = new Paho.MQTT.Client(serverAddress, Number(serverPort), clientId);

    this.onConnectionLost();
    this.onMessage();
    this.client.connect({
      userName: serverUser,
      password: serverPw,
      onSuccess: this.onConnected.bind(this),
      onFailure: this.onFailure.bind(this),
      timeout: 30,
      mqttVersion: 4
    });
  }

  // Se inscrever
  // subscribe(mac_address)
  public subscribe(topic: string) {
    if(this.client.isConnected()) {
      console.log("subscribe MqttProvider:", topic);
      this.client.subscribe(topic);
    } else
      this.listPendingSubscribe.push(topic);
  }
  
  // Publicar mensagem
  // publish(text, mac_address)
  public publish(message: string, topic: string) {
    console.log("%cpublish MqttProvider:", this.keyDColor, message, topic);

    if(!this.client.isConnected()) {
      console.log("not connected MqttProvider");

      this.toast = this.toastCtrl.create({
        message: "Sem conexão com o servidor.",
        duration: 3000,
        showCloseButton: true
      });
      this.toast.present();
      return;
    }

    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = topic;
    packet.qos = 1;
    this.client.send(packet);
  }

  // TRATAR MENSAGENS RECEBIDAS
  public onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log("%cmessage arrived MqttProvider:", this.keyDColor,
        message.payloadString, message.destinationName);

      let token = message.destinationName.split("/")[0];

      if(this.listControls["LightsPage"]) {
        this.listControls["LightsPage"]
            .updateStatus(token, (message.payloadString == "1" ? true : false));
      }
      if(this.listControls["PlugsPage"]) {
        this.listControls["PlugsPage"]
            .updateStatus(token, (message.payloadString == "1" ? true : false));
      }
    };
  }

  // Atualizar/sincronizar status com os dos atuadores
  public syncStatus() {
    console.log("syncStatus MqttProvider");

    while(this.listPendingSubscribe.length > 0)
      this.subscribe(this.listPendingSubscribe.pop());

    let listLights = this.dataProvider.getListLights();
    listLights.forEach((elem) => {
      this.publish(this.keyMsgSync, elem.token + this.keyTopicIn);
    });

    let listPlugs = this.dataProvider.getListPlugs();
    listPlugs.forEach((elem) => {
      this.publish(this.keyMsgSync, elem.token + this.keyTopicIn);
    });
  }

  // Conectado
  public onConnected() {
    console.log("connected successfully MqttProvider");

    if(this.toast)
      this.toast.dismiss();
    
    this.syncStatus();
  }

  // Conexão perdida
  public onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log("connection lost MqttProvider:", responseObject);

      this.toast = this.toastCtrl.create({
        message: "Conexão perdida com o servidor.",
        duration: 5000,
        showCloseButton: true
      });
      this.toast.present();
    };
  }

  // Tentativa de conexão falhou
  public onFailure() {
    console.log("connection failed MqttProvider");

    this.toast = this.toastCtrl.create({
      message: "Não foi possível conectar ao servidor.",
      duration: 10000,
      showCloseButton: true
    });
    this.toast.present();
  }

  // PARA COMUNICAÇÃO EM DUAS VIAS
  public addControl(control: any) {
    console.log("addControl MqttProvider:", control.constructor.name);
    this.listControls[control.constructor.name] = control;
  }

}
