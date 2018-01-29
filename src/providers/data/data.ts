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
  private keyLights: string     = "lights";
  private keyPlugs: string      = "plugs";
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
      let min = Math.pow(10, 9);
      let max = Math.pow(10, 10);
      user = (Math.floor(Math.random() * (max - min)) + min).toString();
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
  public getListLights(): any[] {
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
  public getListPlugs(): any[] {
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

  // Adicionar um módulo
  public saveModule(module: any, type: any) {
    console.log("addModule DataProvider:", module);

    let itemFind;

    switch(type) {
      case this.keyLights:
        let listLights = this.getListLights();
        itemFind = listLights.find(function(element) {
          return element.token == module.token;
        });

        if(itemFind) {
          // Editando
          let indexItem = listLights.indexOf(itemFind, 0);
          listLights[indexItem] = module;
        } else {
          // Adicionando
          listLights.push(module);
        }

        this.setListLights(listLights);
        break;

      case this.keyPlugs:
        let listPlugs = this.getListPlugs();
        itemFind = listPlugs.find(function(element) {
          return element.token == module.token;
        });

        if(itemFind) {
          // Editando
          let indexItem = listPlugs.indexOf(itemFind, 0);
          listPlugs[indexItem] = module;
        } else {
          // Adicionando
          listPlugs.push(module);
        }

        this.setListPlugs(listPlugs);
        break;

      default: break;
    }
  }

  // Remover um módulo
  public deleteModule(module: any, type: any) {
    console.log("deleteModule DataProvider:", module);
    
    let itemFind;
    let indexItem;

    switch(type) {
      case this.keyLights:
        let listLights = this.getListLights();
        itemFind = listLights.find(function(element) {
          return element.token == module.token;
        });
        if(!itemFind) return;

        indexItem  = listLights.indexOf(itemFind, 0);
        listLights.splice(indexItem, 1);

        this.setListLights(listLights);
        break;

      case this.keyPlugs:
        let listPlugs = this.getListPlugs();
        itemFind = listPlugs.find(function(element) {
          return element.token == module.token;
        });
        if(!itemFind) return;

        indexItem = listPlugs.indexOf(itemFind, 0);
        listPlugs.splice(indexItem, 1);

        this.setListPlugs(listPlugs);
        break;

      default: break;
    }
  }

  // Pegar um módulo específico
  public getModule(token: string): any {
    console.log("getModule DataProvider:", token);

    let listLights = this.getListLights();
    let listPlugs  = this.getListPlugs();

    let item;
    item = listLights.find(function(element) {
      return element.token == token;
    });
    if(item) return item;

    item = listPlugs.find(function(element) {
      return element.token == token;
    });
    return item;
  }

}
