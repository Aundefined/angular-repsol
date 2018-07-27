import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../_services/index";

@Component({
  selector: 'app-nuevo-password',
  templateUrl: './recordar-password.component.html',
  styleUrls: ['./recordar-password.component.css']
})
export class RecordarPasswordComponent implements OnInit {
  model: any = {};

  constructor(private alertService: AlertService) { }

  ngOnInit() {/* 
      var element = document.getElementById("sendButton");
      element.classList.remove("boton-inactivo");
      element.classList.add("boton-estandar"); */
  }

  submit(){
    console.log('submit');
  }

  

}
