import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleArticulo, ReturnArticulo } from '../../_models/index';
import { ArticulosService } from '../../_services/articulos.service';
declare var $: any;


@Component({
  selector: 'app-alta-articulos',
  templateUrl: './alta-articulos.component.html',
  styleUrls: ['./alta-articulos.component.css']
})
export class AltaArticulosComponent implements OnInit {

  disab: boolean;
  detalle = new DetalleArticulo();
  consigna: string;
  modifica: string;
  paginacion:boolean;
  articulos:ReturnArticulo[] = [];
  editableBool:boolean = false;
  altaConsulta:string;

  constructor(private art: ArticulosService, private activatedRoute: ActivatedRoute) {





  }

  ngOnInit() {
    $(document).ready(function () {
      $('select').niceSelect();
    });

   

   

   

      this.montarTabla();

    this.activatedRoute.params.subscribe(params => {

      if (params['id'] != null) {
        console.log(params['id']);
        this.disab = true;
        this.altaConsulta = "Consulta";

        this.art.getDetalleArticulo(params['id'])
          .subscribe(
            data => {
              this.detalle = data;
              console.log(this.detalle);
              if (this.detalle.MODIF_PVP) {
                this.modifica = "SI"
              } else {
                this.modifica = "NO"
              }

              if (this.detalle.CONSIGNA) {
                this.consigna = "SI"
              } else {
                this.consigna = "NO"
              }
            },
            err => {

            }
          );
      } else {
        console.log(params['id']);
        this.disab = false;
        this.consigna = "Si/No";
        this.modifica = "Si/No";
        this.altaConsulta = "Alta";
      }
    });

  }

  consignaChange() {
    if (this.consigna == "NO") {
      this.consigna = "SI"
    } else if (this.consigna == "SI") {
      this.consigna = "NO"
    }
  }

  habilitar() {
    this.disab = false;
  }

  borrar() {
    this.detalle.CODIGO = '';
    this.detalle.COD_SUBFAMILIA = '';
    this.detalle.COD_GRUPO = '';
    this.detalle.COD_FAMILIA = '';
    this.detalle.EAN = '';
    this.detalle.FAMILIA = '';
    this.detalle.SUBFAMILIA = '';
    this.detalle.GRUPO = '';
  }

  montarTabla() {

    this.art.getAll()
      .subscribe(
        data => {
          this.articulos = data.Result;
          console.log(this.articulos);
          console.log(this.articulos.length);

          if (this.articulos.length < 5) {
            this.paginacion = false;
          }else{
            this.paginacion = true;
          }

        }
      );

     setTimeout(() => {
       $('.myTable').DataTable({
         searching: false,
         info: false,
         pageLength: 5,
         lengthChange: false,
         paging: this.paginacion,
         language: {
           processing: "Lectura de datos en curso...",
           paginate: {
             previous: "&laquo;",
             next: "&raquo;"
           }
         }
       });
     }, 500); 


     setTimeout(() => {
      $('.myTablePrecios').DataTable({
        searching: false,
        info: false,
        pageLength: 5,
        lengthChange: false,
        paging: this.paginacion,
        ordering: false,
        language: {
          processing: "Lectura de datos en curso...",
          paginate: {
            previous: "&laquo;",
            next: "&raquo;"
          }
        }
      });
    }, 500); 

  

  }

  editable(){
    if(this.editableBool == false){
      this.editableBool = true
    }else if(this.editableBool == true){
      this.editableBool = false;
    }
  }

}
