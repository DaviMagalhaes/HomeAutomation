import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  // Chaves
  private keyServer: string     = "server";
  private keyServerPort: string = "serverPort";
  private keyServerUser: string = "serverUser";
  private keyServerPw: string   = "serverPw";
  private keyLights: string     = "lights";
  private keyPlugs: string      = "plugs";
  private keyListLights: string = "listLights";
  private keyListPlugs: string  = "listPlugs";

  // Valores padrões
  private defaultServer: string     = "broker.hivemq.com";
  private defaultServerPort: number = 8000;

  constructor() {
    console.log("constructor DataProvider");
  }

  // SERVIDOR
  public getServerAddress(): string {
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

  // PORTA DO SERVIDOR
  public getServerPort(): string {
    let serverPort = localStorage.getItem(this.keyServerPort);

    if(serverPort == null) {
      serverPort = this.defaultServerPort.toString();
      this.setServerPort(serverPort);
    }

    console.log("getServerPort DataProvider:", serverPort);
    return serverPort;
  }
  public setServerPort(serverPort: string) {
    console.log("setServerPort DataProvider:", serverPort);
    localStorage.setItem(this.keyServerPort, serverPort);
  }

  // USUÁRIO PARA SERVIDOR
  public getServerUser(): string {
    let serverUser = localStorage.getItem(this.keyServerUser);
    
      if(serverUser == null) {
        serverUser = "";
        this.setServerUser(serverUser);
      }
  
      console.log("getServerUser DataProvider:", serverUser);
      return serverUser;
  }
  public setServerUser(serverUser: string) {
    console.log("setServerUser DataProvider:", serverUser);
    localStorage.setItem(this.keyServerUser, serverUser);
  }

  // SENHA PARA SERVIDOR
  public getServerPw(): string {
    let serverPw = localStorage.getItem(this.keyServerPw);
    
      if(serverPw == null) {
        serverPw = "";
        this.setServerPw(serverPw);
      }
  
      console.log("getServerPw DataProvider:", serverPw);
      return serverPw;
  }
  public setServerPw(serverPw: string) {
    console.log("setServerPw DataProvider:", serverPw);
    localStorage.setItem(this.keyServerPw, serverPw);
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
  // module = {name, active, token}
  public saveModule(module: any, type: any) {
    console.log("saveModule DataProvider:", module);

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
