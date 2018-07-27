import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.component.html',
  styleUrls: ['./menu2.component.css']
})
export class Menu2Component implements OnInit {

  productos = [

    {
      nombre : "coca cola",
      id : 1
    },
    {
      nombre: "kinder bueno",
      id: 2
    },
    {
      nombre: "pipas G",
      id: 3
    },
    {
      nombre: "patatas fritas",
      id: 4
    }
  ]

  constructor(private router :Router) { }


  ngOnInit() {

    let hashedPass = Md5.hashStr('Repsol01');
    console.log(hashedPass);

  }

  verDetalle(idx: number) {
    this.router.navigate(['/detalle-articulos', idx]);
  }






}
