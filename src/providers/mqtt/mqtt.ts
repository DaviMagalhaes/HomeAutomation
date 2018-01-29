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
    Message to a module:
        <clientId>/<token module>/<in OR out>
        token: MAC address;
           in:    publish;
          out:   subscribe;

    Message to sync all:
        <clientId>/ALL
  QOS:
    1
*/
@Injectable()
export class MqttProvider {

  private client;
  private clientId: string;
  private listControls = new Array<any>();
  private listPendingSubscribe = new Array<string>();
  private toast: Toast;

  // Chave
  private keyTopicUpdateAll: string = "ALL";
  
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
    this.clientId     = this.dataProvider.getUser();

    console.log("connectServer MqttProvider");
    console.log("connecting to server:", serverAddress, serverPort, this.clientId);

    this.client = new Paho.MQTT.Client(serverAddress, Number(serverPort), this.clientId);

    this.onConnectionLost();
    this.onMessage();
    this.client.connect({
      userName: serverUser,
      password: serverPw,
      onSuccess: this.onConnected.bind(this),
      onFailure: this.onFailure.bind(this),
      timeout: 10,
      keepAliveInterval: 600
    });
  }

  // Se inscrever
  public subscribe(topic: string) {
    if(this.client.isConnected()) {
      topic = this.clientId +"/"+ topic;

      console.log("subscribe MqttProvider:", topic);
      this.client.subscribe(topic);
    } else
      this.listPendingSubscribe.push(topic);
  }
  
  // Publicar mensagem
  public publish(message: string, topic: string) {
    topic = this.clientId +"/"+ topic;

    console.log("publish MqttProvider:", message, topic);

    if(!this.client.isConnected()) {
      console.log("not connected MqttProvider");

      this.toast = this.toastCtrl.create({
        message: "Sem conexão com servidor.",
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
      console.log("message arrived MqttProvider:", message.payloadString, message.destinationName);

      let topicArray = message.destinationName.split("/");
      let token = topicArray[1];

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

    // <clientId>/ALL
    this.publish("1", this.keyTopicUpdateAll);
  }

  // Conectado
  public onConnected() {
    console.log("connected successfully MqttProvider");

    if(this.toast)
      this.toast.dismiss();

    // Se inscreve em tópicos pendentes
    while(this.listPendingSubscribe.length > 0)
      this.subscribe(this.listPendingSubscribe.pop());
    
    this.syncStatus();
  }

  // Conexão perdida
  public onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log("connection lost MqttProvider:", JSON.stringify(responseObject));

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
