import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
//import { AppRoutingModule } from '../app.routing';
/* import { Observable } from 'rxjs'; */
import { ProveedoresService } from '../_services/proveedores.service';
import { ListProveedor } from '../_models/index';
import { ProveedoresFiltros} from '../_models/index';
import { LoadingService } from '../_services/loading.service';
declare var $;
// declare var jQuery: any;


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {


  constructor(private proveedoresService: ProveedoresService , private routera: Router, private loadingService: LoadingService/* , private activateRoute: ActivatedRoute  *//*, private appRout : AppRoutingModule */) { }

  timer: any =
  {
    filtrar:
    {
      id: null,
      ms: 700
    }
  };

  proveedores: ListProveedor[] = [];
  proveedoresFiltros = new ProveedoresFiltros();
  filtros: ProveedoresFiltros;
  filtroOculto = false;
  desactivarCheck: boolean;
    
  ngOnInit() {
    this.loadingService.showLoading(true);
    this.proveedoresService.getAllProveedores()
      .subscribe(
        data => {
          
          this.proveedores = data;
          this.montarTabla();
        },
      )
  }


  seleccionFiltro() {
    clearTimeout(this.timer.filtrar.id);
    this.timer.filtrar.id = setTimeout(() => {
      console.log(this.proveedoresFiltros.resp_preprov);
      this.filtrar();
    }, this.timer.filtrar.ms);
    
    
    this.montarEnlace();
  }

  filtrar(){
    this.proveedoresService.enviarFiltros(this.proveedoresFiltros)
      .subscribe(
        data => {
          console.log(data + ' si ' + typeof data);
          if (typeof data !== 'string') {
            console.log('correcto');
            this.proveedores = data;
            this.loadingService.showLoading(false);
            this.remontarTabla();
          }
          else{
            this.filtrar();
          }
          
        },
        error => {
          this.loadingService.showLoading(false);
          console.log(error);
        }
      );
  }


  limpiarFiltros(){
    $('#acordeon  input').prop('checked', false);
    this.proveedoresFiltros = new ProveedoresFiltros();
    this.seleccionFiltro();
    //this.remontarTabla();
  }

  ocultarFiltros() {
    this.filtroOculto = true;
    $('.filtros').css(
      {
        'position': 'absolute',
        'left': '-18%',
      }
    );
    $('.pestana-filtros').css(
      {
        'display': 'block',
      }
    );
  }

  mostrarFiltros() {
    this.filtroOculto = false;
    $('.filtros').css(
      {
        'position': 'relative',
        'left': '0',
        'display': 'block',
      }
    );
    $('.pestana-filtros').css(
      {
        'display': 'none',
      }
    );
  }

  montarTabla(){
      var table = $('#myTable').DataTable({
        serverSide: false,
        searching: true,
        info: false,
        order: [[ 0, 'desc'], [ 1, 'desc'],[ 2, 'desc'],[ 3, 'desc'],[ 4, 'desc']],
//        ordering: true,
        pageLength: 5,
        lengthChange: false,
        paging: true,
        language: {
          zeroRecords: "No se encontraron resultados",
          processing: "Lectura de datos en curso...",
          paginate: {
          previous: "&laquo;",
          next: "&raquo;"
          }
        },
        data : this.proveedores,
        columns: [
          {"title": "Código",
            "data" : "CODIGO"},
          {"title": "CIF",
            "data" : "CIF"},
          {"title": "Razón social",
            "data" : "RAZON_SOCIAL"},
          {"title": "Clasificación",
            "data" : "CLASIFICACION_TEXTO"},
          {"title": "Fecha Baja",
            "data" : "FBAJA"} ,
          {"title": "Acciones",
            "data": "ID_PROVEEDORES",
            "render": function ( data, type, row, meta ) {
              return '<img  name="detalle" title="Ver" value="'+data+'" class="img" style="width: 30px; cursor: pointer;" src="../../assets/detalle.png" alt="'+ data +'" > <img  name="editar" title="Editar" value="'+data+'" class="img" style="width: 30px; cursor: pointer;" src="../../assets/editar.png" alt="'+ data +'" >';
             
            }
          },
        ],
      }).on('page.dt', () => { this.montarEnlace()})
        .on('order.dt', () => { this.montarEnlace()});
      $('#myTable_filter').hide();
      this.montarEnlace();
  }

  montarEnlace(){
    setTimeout(() => {
      var detalles = document.getElementsByName('detalle');
      var editares = document.getElementsByName('editar');
      for (var i = 0; i < detalles.length; i++){
        detalles[i].addEventListener("click", () => {
          this.enrutardetalle(event);
        });
        editares[i].addEventListener("click", () => {
          this.enrutareditar(event);
        });
      };
    $('#myTable_filter').hide();
    }, 500);
  }

  enrutardetalle(event){
    var ID_PROVEEDOR = event.target.alt;

    this.routera.navigateByUrl('/alta-proveedores?accion=detalle&id='+ID_PROVEEDOR);

  }

  enrutareditar(event){
    var ID_PROVEEDOR = event.target.alt;

    this.routera.navigateByUrl('/alta-proveedores?accion=editar&id='+ID_PROVEEDOR);


  }
  

  remontarTabla(){
    $('#myTable').DataTable().clear();
    $('#myTable').DataTable().rows.add(this.proveedores);
    $('#myTable').DataTable().draw();
    if (this.proveedores.length < 5){
      $('.pagination').hide();
    }
  }
    
  buscar(value){
    var table = $('#myTable').DataTable();
    table.search( value ).draw();
    this.montarEnlace(); 
  } 

  menu(){
    $('.filtros').toggleClass("close-filtros");
    setTimeout(() => {
      $('.filtros').toggleClass("cierra-div"); 
    }, 200);
  }

}
