import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../_services/index";

@Component({
  selector: 'app-nuevo-password',
  templateUrl: './nuevo-password.component.html',
  styleUrls: ['./nuevo-password.component.css']
})
export class NuevoPasswordComponent implements OnInit {
  model: any = {};
  
  constructor(private alertService:AlertService) { }

  ngOnInit() {
  }

  verify(){
    if(this.model.password != this.model.rePassword){
      this.alertService.error("Las contraseñas no coinciden",true);
    }
  }

}
