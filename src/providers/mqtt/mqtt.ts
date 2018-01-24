import { Injectable } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';
import { DataProvider } from '../data/data';
import { LightsPage } from '../../pages/lights/lights';

/*
  Generated class for the MqttProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  -------

  TOPICS: <clientId>/<lights OR plugs>/<token module>/<in OR out>
   token: MAC address;
    in:    publish;
    out:   subscribe;
  
  QoS: 1
*/
@Injectable()
export class MqttProvider {

  private client;
  private clientId: string;
  private listControls = new Array<any>();
  private listPendingSubscribe = new Array<string>();

  // Chaves de tipos de módulos
  private keyLights: string = "lights";
  private keyPlugs: string = "plugs";
  
  constructor(private dataProvider: DataProvider) {
    console.log("constructor MqttProvider");

    let serverAddress = dataProvider.getServerAddress();
    this.clientId     = dataProvider.getUser();

    this.client = new Paho.MQTT.Client(serverAddress, 8080, this.clientId);

    this.onConnectionLost();
    this.onMessage();
    this.client.connect({onSuccess: this.onConnected.bind(this)});
  }

  // Se inscrever
  public subscribe(topic: string) {
    if(this.client.isConnected()) {
      topic = this.clientId +"/"+ topic +"/out";

      console.log("subscribe MqttProvider:", topic);
      this.client.subscribe(topic);
    } else
      this.listPendingSubscribe.push(topic);
  }
  
  // Publicar mensagem
  public publish(message: string, topic: string) {
    topic = this.clientId +"/"+ topic +"/in";

    console.log("publish MqttProvider:", message, topic);

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
      let typeModule = topicArray[1];
      let token = topicArray[2];

      switch(typeModule) {
        case this.keyLights:
          this.listControls["LightsPage"]
            .updateStatus(token, (message.payloadString == "1" ? true : false));
          break;
        case this.keyPlugs:
          this.listControls["PlugsPage"]
            .updateStatus(token, (message.payloadString == "1" ? true : false));
          break;
        default: break;
      }
    };
  }

  // Conectado
  public onConnected() {
    console.log("connected successfully MqttProvider");

    // Se inscreve em tópicos pendentes
    for(let topic of this.listPendingSubscribe)
      this.subscribe(topic);
  }

  // Conexão perdida
  public onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log("connection lost MqttProvider:", JSON.stringify(responseObject));
    };
  }

  // PARA COMUNICAÇÃO EM DUAS VIAS
  public addControl(control: any) {
    console.log("addControl MqttProvider:", control.constructor.name);
    this.listControls[control.constructor.name] = control;
  }

}
