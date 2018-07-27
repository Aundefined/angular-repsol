import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu7',
  templateUrl: './menu7.component.html',
  styleUrls: ['./menu7.component.css']
})
export class Menu7Component implements OnInit {

  listaMenu: any[] = [];

  constructor() {
    this.listaMenu = JSON.parse(sessionStorage.getItem('listaMenu'));
   }

  ngOnInit() {
  }

}
