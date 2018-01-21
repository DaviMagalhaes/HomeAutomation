import { Injectable } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';

/*
  Generated class for the MqttProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MqttProvider {

  private client;
  
  constructor() {
    this.client = new Paho.MQTT.Client('test.mosquitto.org', 8080, 'qwerty12345');

    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});
  }

  public onConnected() {
    console.log("Connected");
    this.client.subscribe("123456");
    this.sendMessage('HelloWorld');
  }

  public sendMessage(message: string) {
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = "123456";
    this.client.send(packet);
  }

  public onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log('Message arrived : ' + message.payloadString);
    };
  }

  public onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost : ' + JSON.stringify(responseObject));
    };
  }

}
