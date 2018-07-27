import { Component, OnInit } from '@angular/core';
import { loginResponse, listMenu, Menu, Accion, listAccion, CampoAccion } from "../../_models/index";
import { isObject } from 'util';

@Component({
  selector: 'app-menu1',
  templateUrl: './menu1.component.html',
  styleUrls: ['./menu1.component.css']
})
export class Menu1Component implements OnInit {

  listaMenu: Menu[];
  listAccion: Accion[];
  listCampoAccion: CampoAccion[];
  menu: Menu;
  ALTA_BOTON: Accion;
  NOMBRE: CampoAccion;
  CODIGO: CampoAccion;
  DESCRIPCION: CampoAccion;
  PAIS: CampoAccion;
  model = {};
  

  constructor() { }

  ngOnInit() {

    this.listaMenu = JSON.parse(sessionStorage.getItem('listaMenu'));
    console.log(this.listaMenu);

    let menu = this.listaMenu.filter(menu => menu.DESCRIPCION == "ARTICULOS");
    this.menu = menu[0];
    console.log(this.menu);

    this.listAccion = this.menu.listAccion;
    console.log(this.listAccion);

    let alta_boton = this.listAccion.filter(accion => accion.ACCION_PANTALLA == "ALTA_BOTON");
    this.ALTA_BOTON = alta_boton[0];
    console.log(this.ALTA_BOTON);

    if (this.ALTA_BOTON) {

      this.listCampoAccion = this.ALTA_BOTON.listCampoAccion;
      console.log(this.listCampoAccion);

      let nombre = this.listCampoAccion.filter(campo => campo.ID == 1);
      this.NOMBRE = nombre[0];

      let codigo = this.listCampoAccion.filter(campo => campo.ID == 17);
      this.CODIGO = codigo[0];
      console.log(this.CODIGO);

      let descricpion = this.listCampoAccion.filter(campo => campo.ID == 33);
      this.DESCRIPCION = descricpion[0];
      console.log(this.DESCRIPCION);

      let pais = this.listCampoAccion.filter(campo => campo.ID == 49);
      this.PAIS = pais[0];
      console.log(this.PAIS);


    }


  }

}
