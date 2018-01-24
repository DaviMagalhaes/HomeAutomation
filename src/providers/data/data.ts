import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  // Chaves
  private keyUser: string       = "user";
  private keyServer: string     = "server";
  private keyListLights: string = "listLights";
  private keyListPlugs: string  = "listPlugs";

  // Valores padrões
  private defaultServer: string = "test.mosquitto.org";

  constructor() {
    console.log("constructor DataProvider");
  }

  // USUÁRIO
  public getUser() {
    let user = localStorage.getItem(this.keyUser);

    if(user == null) {
      user = (Math.floor(Math.random() * (Math.pow(10, 10) - 1)) + 1).toString();
      this.setUser(user);
    }

    console.log("getUser DataProvider:", user);
    return user;
  }
  public setUser(user: string) {
    console.log("setUser DataProvider:", user);
    localStorage.setItem(this.keyUser, user);
  }

  // SERVIDOR
  public getServerAddress() {
    let serverAddress = localStorage.getItem(this.keyServer);

    if(serverAddress == null) {
      serverAddress = this.defaultServer;
      this.setServerAddress(serverAddress);
    }

    console.log("getServerAddress DataProvider:", serverAddress);
    return serverAddress;
  }
  public setServerAddress(serverAddress: string) {
    console.log("setServerAddress DataProvider:", serverAddress);
    localStorage.setItem(this.keyServer, serverAddress);
  }

  // LISTA DE LUZES
  public getListLights() {
    let listLights = JSON.parse(localStorage.getItem(this.keyListLights));

    if(listLights == null)
      listLights = new Array();

    console.log("getListLights DataProvider:", listLights);
    return listLights;
  }
  public setListLights(listLights: any[]) {
    console.log("setListLights DataProvider:", listLights);
    localStorage.setItem(this.keyListLights, JSON.stringify(listLights));
  }

  // LISTA DE TOMADAS
  public getListPlugs() {
    let listPlugs = JSON.parse(localStorage.getItem(this.keyListPlugs));

    if(listPlugs == null)
      listPlugs = new Array();
    
    console.log("getListPlugs DataProvider:", listPlugs);
    return listPlugs;
  }
  public setListPlugs(listPlugs: any[]) {
    console.log("setListPlugs DataProvider:", listPlugs);
    localStorage.setItem(this.keyListPlugs, JSON.stringify(listPlugs));
  }

}
