import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticulosService } from '../_services/articulos.service';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {

  constructor(private articulosService: ArticulosService) { }

  ngOnInit() {
  }

  importarXML(){
    this.articulosService.importarXML()
    .subscribe(
      data=>{
        console.log(data);
      }
    )
  }

}
