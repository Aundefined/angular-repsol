import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
//import { AppRoutingModule } from '../app.routing';
import { Observable } from 'rxjs/Observable';
import {
    ProvinciasService, EstacionDelegacionAreaService,
    SegmentoService,
    EstacionesService, TiposCaracterizacionService, CaracterizacionesService
} from '../_services/index';
import {
    RequestProvinciasByIdEmpresa, RequestEstacion,
    ResponseEstacion, TiposCaracterizacion, RequestCaracterizacionByIdTipo,
    RequestTiposCaracterizacionByTipo, RequestListaEstacionFiltros
} from '../_models/index';

// import { EstacionesService } from '../_services/msEstaciones/estaciones/estaciones.service';
import { ListProveedor } from '../_models/index';
import { ProveedoresFiltros} from '../_models/index';
import { LoadingService } from '../_services/loading.service';
import { ConsultaEstacionesViewModel } from '../_models/viewModels/estaciones/consultaEstacionesViewModel';
declare var $;
// declare var jQuery: any;


@Component({
  selector: 'app-estaciones',
  templateUrl: './estaciones.component.html',
  styleUrls: ['./estaciones.component.css']
})
export class EstacionesComponent implements OnInit {


  constructor(private estacionesService: EstacionesService , private routera: Router, private loadingService: LoadingService,/* , private activateRoute: ActivatedRoute  *//*, private appRout : AppRoutingModule */
    private provinciasService: ProvinciasService,
    private estacionDelegacionAreaService: EstacionDelegacionAreaService, private segmentoService: SegmentoService,) { }

    vm = new ConsultaEstacionesViewModel();

  proveedores: ListProveedor[] = [];
  proveedoresFiltros = new ProveedoresFiltros();
  filtroOculto = false;
    
  ngOnInit() {
    // this.loadingService.showLoading(true);
    // this.estacionesService.getAllProveedores()
    //   .subscribe(
    //     data => {
          
    //       this.proveedores = data;
    //       this.montarTabla();
    //     },
    //   )

    this.inicializarComponenteServices();
  }

  inicializarComponenteServices()
  {
      this.vm.loading = true;
    var reqProvincias = new RequestProvinciasByIdEmpresa();
    reqProvincias.Id_Empresa = 1;
    var requestEstacionesFiltros = new RequestListaEstacionFiltros();
    requestEstacionesFiltros.Empresa = 1;
    // var reqTiposCaracterizacion = new RequestTiposCaracterizacionByTipo();
    var responseEstacion = new ResponseEstacion();
    const allrequests = Observable.forkJoin(
        this.provinciasService.getByIdEmpresa(reqProvincias),        
        this.estacionDelegacionAreaService.getAll(),
        this.segmentoService.getAll(),
        this.estacionesService.GetAllByFiltros(requestEstacionesFiltros)
    );
    allrequests.subscribe(
        latestResults => {
            this.vm.rspProvincias = latestResults[0];
            this.vm.rspDelegacionArea = latestResults[1];
            this.vm.rspSegmento = latestResults[2];
            this.vm.rspEstacionFiltros = latestResults[3];

            if(this.vm.rspDelegacionArea.CodigoServicio == "OK")
            {
                this.verMasMenosDelegacionArea();
            }
            else
            {
                console.log(JSON.stringify(this.vm.rspDelegacionArea.ListaErrores));
            }
            if (this.vm.rspEstacionFiltros.CodigoServicio == "OK") {
                this.montarTabla();
            }
            else {
                console.log(JSON.stringify(responseEstacion.ListaErrores));
            }

            this.vm.loading = false;
        },
        error => {
            console.log(error);
            this.vm.loading = false;
        }
    );
  }

  getAllByFiltros() {
      //this.loadingService.showLoading(true);
      this.vm.loading = true;
      var request = new RequestListaEstacionFiltros();
      request.Empresa = 1;
      request.Filtro = "";
      this.vm.rspDelegacionArea.ListaEstacionDelegacionArea.forEach(element => {
        if(element.Selected)
            request.Delegacionarea.push(element.Id_Delegacion_Area);
      });

      this.vm.rspProvincias.ListaProvincias.forEach(element => {
        if(element.Selected)
            request.Provincia.push(element.Id);
      });
      this.vm.cantidadProvinciasSeleccionadas = request.Provincia.length;

      this.vm.rspSegmento.ListaSegmentos.forEach(element => {
        if(element.Selected)
            request.Segmento.push(element.Id_Segmento);
      });
      this.vm.cantidadSegmentosSeleccionadas = request.Segmento.length;
       
      this.estacionesService.GetAllByFiltros(request)
      .subscribe(
        data => {
          //this.loadingService.showLoading(false);
          this.vm.loading = false;
          if (typeof data !== 'string') {
            this.vm.rspEstacionFiltros = data;
            if(this.vm.rspEstacionFiltros.CodigoServicio == "OK")
                this.remontarTabla();
          }
        },
        error => {
          //this.loadingService.showLoading(false);
          this.vm.loading = false;
          console.log(error);
        }
      );
      this.montarEnlace();
  }

  verMasMenosDelegacionArea()
  {
    var quantityToShow = 0;
    if(this.vm.verMasDelegacionesArea)
        quantityToShow = this.vm.rspDelegacionArea.ListaEstacionDelegacionArea.length;
    else
        quantityToShow = this.vm.cantidadDelegacionesAreaShow;

    this.vm.rspDelegacionArea.ListaEstacionDelegacionArea.forEach((element,i) => {
        if(i < quantityToShow)        
            element.Es_Visible = true;
        else
            element.Es_Visible = false;
    });
  }

  verMasDelegacionesArea()
  {
    this.vm.verMasDelegacionesArea = true;
    this.verMasMenosDelegacionArea();
  }

  verMenosDelegacionesArea()
  {
    this.vm.verMasDelegacionesArea = false;
    this.verMasMenosDelegacionArea();
  }

  limpiarFiltros(){
    $('#acordeon  input').prop('checked', false);
    this.proveedoresFiltros = new ProveedoresFiltros();
    this.getAllByFiltros();
    this.remontarTabla();
  }

  ocultarFiltros() {
    this.filtroOculto = true;
    $('.filtros').css(
      {
        'position': 'absolute',
        'left': '-18%',
        // 'display': 'none',
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
      var table = $('#tablaEstaciones').DataTable({
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
        data : this.vm.rspEstacionFiltros.EstacionesFiltro,
        columns: [
          {"title": "Código",
            "data" : "Codigo_Repsol"},
          {"title": "Nombre Comercial",
            "data" : "Nombre_Comercial"},
          {"title": "Localidad",
            "data" : "Localidad"},
          {"title": "Provincia",
            "data" : "Provincia"},
          {"title": "Margen",
            "data" : "Margen"} ,
          {"title": "Acciones",
            "data": "Id",
            "render": function ( data, type, row, meta ) {
              return '<img  name="detalle" title="Ver" value="'+data+'" class="img" style="width: 30px; cursor: pointer;" src="../../assets/icon_ver.jpg" alt="'+ data +'" > <img  name="editar" title="Editar" value="'+data+'" class="img" style="width: 30px; cursor: pointer;" src="../../assets/icon_editar.jpg" alt="'+ data +'" >';
             
            }
          },
        ],
      }).on('page.dt', () => { this.montarEnlace()})
        .on('order.dt', () => { this.montarEnlace()});
      $('#tablaEstaciones_filter').hide();
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
    $('#tablaEstaciones_filter').hide();
    }, 500);
  }

  enrutardetalle(event){
    var id = event.target.alt;

    this.routera.navigateByUrl('/alta-estaciones?accion=detalle&id='+id);

  }

  enrutareditar(event){
    var id = event.target.alt;

    this.routera.navigateByUrl('/alta-estaciones?accion=editar&id='+id);


  }
  

  remontarTabla(){
    $('#tablaEstaciones').DataTable().clear();
    $('#tablaEstaciones').DataTable().rows.add(this.vm.rspEstacionFiltros.EstacionesFiltro);
    $('#tablaEstaciones').DataTable().draw();
    if (this.vm.rspEstacionFiltros.EstacionesFiltro.length < 5){
      $('.pagination').hide();
    }
  }
    
  buscar(value){
    var table = $('#tablaEstaciones').DataTable();
    table.search(value).draw();
    this.montarEnlace(); 
  } 

  menu(){
    $('.filtros').toggleClass("close-filtros");
    setTimeout(() => {
      $('.filtros').toggleClass("cierra-div"); 
    }, 200);
  }

  selAllProvincias()
  {
    this.vm.rspProvincias.ListaProvincias.forEach(element => {
            element.Selected = this.vm.rspProvincias.SelectedAll;       
    });
  }

  selAllSegmentos()
  {
    this.vm.rspSegmento.ListaSegmentos.forEach(element => {
        element.Selected = this.vm.rspSegmento.SelectedAll;       
    });
  }

}
