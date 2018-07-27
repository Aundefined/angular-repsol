import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Promotions, Categorias, FamiliasPadre, Familias, Proveedores,
  ArticulosGruposOfertasFiltro, PromotionsArticle, PromotionsByIdFiltro, Paginacion, Fechas
} from '../../../_models/index';
import {
  CategoriasService, FamiliasService, FamiliasPadreService, PromotionsArticuloService,
  PromotionsService, ProveedoresPromoService, CommonService
} from '../../../_services/index';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { Alert } from 'selenium-webdriver';
import { DecimalPipe } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isUndefined, isNumber, isNull, isNullOrUndefined } from 'util';
import { PaginacionHelper } from '../../../_helpers/index';

@Component({
  selector: 'app-promocion-articulo',
  templateUrl: './promocion-articulo.component.html',
  styleUrls: ['./promocion-articulo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PromocionArticuloComponent implements OnInit, OnDestroy {

  @Input() mPromotions = new Promotions();
  @Input() mPromotionsById = new PromotionsByIdFiltro();
  @Output() volverForm = new EventEmitter();
  @Output() desahabilitarTipo = new EventEmitter();
  cambio: boolean;
  public loading = false;
  mCategorias: Categorias[];
  mFamiliasPadre: FamiliasPadre[];
  mFamilias: Familias[];
  filtroArticulosPromotions = new ArticulosGruposOfertasFiltro();
  articulosDisponibles: PromotionsArticle[];
  mPromotionsTemp = new Promotions();
  mProveedores: Proveedores[];
  tipoAsignacion: number;
  cantTipoAsignacion: any;
  //nroArticuloMin:number;
  valor: any;
  isdisabled: Boolean = false;
  public showModal: boolean;
  statusCode: number;
  public textoModal: string;
  //trackByIdx:any;
  estadoArtDisp: boolean;
  estadoArtAgr: boolean;
  closeResult: string;
  resul: string;
  cant_Min: number;
  mensajeError = "";
  proveedorFiltroNombre: string;


  public totalItemsGO: number = 0;
  public numeroPaginasGO: number = 0;


  constructor(private categoriasService: CategoriasService, private familiasPadreService: FamiliasPadreService,
    private familiasService: FamiliasService, private promotionsArticuloService: PromotionsArticuloService,
    private promotionsService: PromotionsService, private router: Router, private modalService: NgbModal,
    private commonService: CommonService, private proveedoresService: ProveedoresPromoService, private _paginacionHelper: PaginacionHelper) {
    this.cambio = true;
    //this.nroArticuloMin = 1;
    this.cantTipoAsignacion = "0.00";
    this.tipoAsignacion = 3;
    this.estadoArtDisp = false;
    this.estadoArtAgr = false;
    this.resul = "";
    this.cant_Min = 0;
    this.mensajeError = "";
  }

  ngOnInit() {
    this.cambio = true;
    this.inicializarServicios(1);
    this.estadoArtDisp = false;
    this.estadoArtAgr = false;
    //this.getCategorias(); 
    //this.getArticulosDisponibles(1);
    this.articulosDisponibles = [];
  }

  obtenerFechaDesde() {

    var fecha = "";

    if (!isNullOrUndefined(this.mPromotions.fecha_desde) && !isNullOrUndefined(this.mPromotions.fecha_desde.day)) {

      var dia = this.mPromotions.fecha_desde.day.toString();
      var mes = this.mPromotions.fecha_desde.month.toString();
      var annio = this.mPromotions.fecha_desde.year.toString();
      if (dia.length == 1)
        dia = "0" + dia;
      if (mes.length == 1)
        mes = "0" + mes;

      fecha = annio + "/" + mes + "/" + dia;
    }

    return fecha;

  }
  obtenerFechaHasta() {

    var fecha = "";
    if (!isNullOrUndefined(this.mPromotions.fecha_hasta) && !isNullOrUndefined(this.mPromotions.fecha_hasta.day)) {

      var dia = this.mPromotions.fecha_hasta.day.toString();
      var mes = this.mPromotions.fecha_hasta.month.toString();
      var annio = this.mPromotions.fecha_hasta.year.toString();
      if (dia.length == 1)
        dia = "0" + dia;
      if (mes.length == 1)
        mes = "0" + mes;

      fecha = annio + "/" + mes + "/" + dia;
    }

    return fecha;

  }


  inicializarServicios(numeroPagina: number) {
    this.loading = true;
    const allrequests = Observable.forkJoin(
      this.categoriasService.getAll(),
      this.proveedoresService.getAll(),
    );
    allrequests.subscribe(latestResults => {
      this.mCategorias = latestResults[0];
      this.mProveedores = latestResults[1];
      this.filtroArticulosPromotions.categoriaFiltro = latestResults[0].map(c => c.id_Categoria);
      this.loading = false;

      this.obtenerFamiliasEnCascada();
    });

  }

  getCategorias() {
    this.loading = true;
    this.categoriasService.getAll()
      .subscribe(
        result => {
          this.mCategorias = result;
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  categoriaClick() {
    this.loading = true;

    this.filtroArticulosPromotions.familiaFiltro = [];
    this.filtroArticulosPromotions.subFamiliaFiltro = [];
    this.mFamiliasPadre = [];
    this.mFamilias = [];
    this.obtenerFamiliasEnCascada();
  }

  familiaClick() {
    this.loading = true;
    this.familiasService.getAll(this.filtroArticulosPromotions)
      .subscribe(
        result => {
          this.mFamilias = result;
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }

  obtenerFamiliasEnCascada() {
    this.familiasPadreService.getAll(this.filtroArticulosPromotions)
      .subscribe(
        result => {
          this.mFamiliasPadre = result;
          this.filtroArticulosPromotions.familiaFiltro = result.map(fp => fp.id_Familias_Padre);
          this.familiasService.getAll(this.filtroArticulosPromotions)
            .subscribe(
              result => {
                this.mFamilias = result;
                this.filtroArticulosPromotions.subFamiliaFiltro = result.map(s => s.id_Familias);
                this.loading = false;
              },
              error => {
                console.log(error);
                this.loading = false;
              }
            );
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  getArticulosDisponibles() {
    this.loading = true;
    this.promotionsArticuloService.getAllPromoArt(this.filtroArticulosPromotions)
      .subscribe(
        result => {

          this.addSoloArticulosDisponibles(result);
          console.log(JSON.stringify(this.articulosDisponibles));
          this.loading = false;
          this.calcularPaginacionGO(result);
          this.estadoArtDisp = true;


        },
        error => {
          console.log(error);

        }
      );
  }

  volverFormCrear(event) {
    this.volverForm.emit({ cambio: this.cambio });

  }

  validarEntradaPvpPromDesc() {

    var valido = true;

    if (this.tipoAsignacion == 1) {

      if (isNull(this.cantTipoAsignacion)) {
        this.mensajeError = "El campo PVP Promocional no puede tener valor nulo.";
        valido = false;
      }
      else {
        if (this.cantTipoAsignacion < 0) {

          this.mensajeError = "El campo PVP Promocional no puede ser negativo.";
          valido = false;
        }
        else {
          this.mensajeError = "";
          valido = true;
        }
      }

    }

    if (this.tipoAsignacion == 2) {

      if (this.cantTipoAsignacion <= 0 || this.cantTipoAsignacion > 100) {

        this.mensajeError = "El campo % DTO tiene que ser mayor que 0 y menor o igual que 100.";
        valido = false;
      }
      else {

        if (isNull(this.cantTipoAsignacion)) {
          this.mensajeError = "El campo % DTO no puede ser nulo.";
          valido = false;
        }
        else {

          this.mensajeError = "";
          valido = true;
        }
      }
    } else {
      if (this.tipoAsignacion == 3) {

        if (this.cantTipoAsignacion == 0) {
          this.mensajeError = "Importe Promoción debe ser mayor que 0.";
          valido = false;
        }
        else {
          this.mensajeError = "";
          valido = true;
        }
      }
    }

    return valido;

  }

  existeSeleccionArtDispo() {

    var valido = true;
    for (let index = 0; index < this.articulosDisponibles.length; index++) {
      var articulo = this.articulosDisponibles[index];
      if (articulo.selected) {
        this.mensajeError = "";
        valido = true;
        break;
      }
      else {
        this.mensajeError = "Es obligatorio seleccionar un artículo.";
        valido = false;
      }
    }
    return valido;
  }

  asignarPvpPromDesc() {

    if (this.validarEntradaPvpPromDesc() && this.validarNroArticulos() && !isUndefined(this.articulosDisponibles)) {

      var estadoDto = true;
      var indexSelec = 0;
      var pvp_Promocional_temp = 0;
      for (let index = 0; index < this.articulosDisponibles.length; index++) {
        var articulo = this.articulosDisponibles[index];

        if (this.tipoAsignacion == 1) {
          articulo.pvp_Promocional = this.cantTipoAsignacion;
          if (articulo.pvp == 0)
            articulo.dto = 0;
          else
            articulo.dto = ((articulo.pvp - this.cantTipoAsignacion) / articulo.pvp) * 100;

          if (this.cantTipoAsignacion >= articulo.pvp || this.cantTipoAsignacion < articulo.importe) {
            articulo.fondo = "#f79595";
          }
          else {
            if (index % 2 == 1)
              articulo.fondo = "#e9edf5";
            else
              articulo.fondo = "#d1dded";

          }
          if (this.cantTipoAsignacion < articulo.importe)
            articulo.colorImporte = "#f79595";
          else
            articulo.colorImporte = "#000000";

          if (this.cantTipoAsignacion >= articulo.pvp)
            articulo.colorPvp = "#f79595";
          else
            articulo.colorPvp = "#000000";

        }
        if (this.tipoAsignacion == 2) {
          if (this.existeSeleccionArtDispo()) {
            if (articulo.selected && estadoDto) {
              articulo.dto = this.cantTipoAsignacion;
              articulo.pvp_Promocional = articulo.pvp - (articulo.dto * articulo.pvp) / 100;
              pvp_Promocional_temp = articulo.pvp_Promocional;

              if (pvp_Promocional_temp >= articulo.pvp || pvp_Promocional_temp < articulo.importe) {
                articulo.fondo = "#f79595";
              } else {
                if (index % 2 == 1)
                  articulo.fondo = "#e9edf5";
                else
                  articulo.fondo = "#d1dded";
              }

              if (pvp_Promocional_temp < articulo.importe)
                articulo.colorImporte = "#f79595";
              else
                articulo.colorImporte = "#000000";

              if (pvp_Promocional_temp >= articulo.pvp)
                articulo.colorPvp = "#f79595";
              else
                articulo.colorPvp = "#000000";


              estadoDto = false;
              indexSelec = index;
              index = -1;
            }
            else {
              if (indexSelec != index) {

                articulo.pvp_Promocional = pvp_Promocional_temp;
                if (articulo.pvp == 0)
                  articulo.dto = 0;
                else
                  articulo.dto = ((articulo.pvp - pvp_Promocional_temp) / articulo.pvp) * 100;

                if (pvp_Promocional_temp >= articulo.pvp || pvp_Promocional_temp < articulo.importe) {
                  articulo.fondo = "#f79595";
                }
                else {
                  if (index % 2 == 1)
                    articulo.fondo = "#e9edf5";
                  else
                    articulo.fondo = "#d1dded";
                }


                if (pvp_Promocional_temp < articulo.importe)
                  articulo.colorImporte = "#f79595";
                else
                  articulo.colorImporte = "#000000";

                if (pvp_Promocional_temp >= articulo.pvp)
                  articulo.colorPvp = "#f79595";
                else
                  articulo.colorPvp = "#000000";

              }
            }
          }
        }
        else {
          if (this.tipoAsignacion == 3) {
            articulo.pvp_Promocional = this.cantTipoAsignacion / this.cant_Min;
          
            if (articulo.pvp == 0)
              articulo.dto = 0;
            else
              articulo.dto = ((articulo.pvp - articulo.pvp_Promocional) / articulo.pvp) * 100;

            if (articulo.pvp_Promocional>= articulo.pvp || articulo.pvp_Promocional < articulo.importe) {
              articulo.fondo = "#f79595";
            }
            else {
              if (index % 2 == 1)
                articulo.fondo = "#e9edf5";
              else
                articulo.fondo = "#d1dded";

            }
            if (articulo.pvp_Promocional < articulo.importe)
              articulo.colorImporte = "#f79595";
            else
              articulo.colorImporte = "#000000";

            if (articulo.pvp_Promocional >= articulo.pvp)
              articulo.colorPvp = "#f79595";
            else
              articulo.colorPvp = "#000000";
          }

        }


      }
    }

  }

  existenArticulosYaAñadidos(): boolean {
    let rpta = false;
    let pvpAux = this.articulosDisponibles.filter(x => x.selected)[0].pvp;
    this.articulosDisponibles.forEach((element, i) => {
      if (element.selected &&
        this.commonService.getListaArticulosAnadidosPRO().filter(item => item.id_Articulo == element.id_Articulo).length > 0) {
        rpta = true;
      }
    });
    return rpta;
  }

  validarNroArticulos() {
    var valido = false;
    if (isNumber(this.cant_Min)) {
      if (this.cant_Min <= 0) {

        this.mensajeError = "El campo Nº Artículos mínimo no puede ser cero.";
        valido = false;
      }
      else {
        this.mensajeError = "";
        valido = true;
        this.mPromotions.cant_Min = this.cant_Min;
      }
    }
    else {

      if (isNull(this.cant_Min)) {
        this.mensajeError = "El campo Nº Artículos es obligatorio.";
        valido = false;
      }
      else {

        this.mensajeError = "";
        valido = true;
        this.mPromotions.cant_Min = this.cant_Min;

      }

    }

    return valido;
  }


  getDatosGeneralesPromotions() {

    var maxPvpPromocional = 0;
    var maxPvpPromocionalSinCan = 0;
    var conteoArticulo = 0;
    var sumPvpIva = 0;
    var sumDto = 0

    var dtoMedio = 0;
    var valorDto = 0;

    maxPvpPromocional = this.getMaxPvpPromocional(this.mPromotions.cant_Min);
    conteoArticulo = this.getConteoArticulo();
    sumPvpIva = this.getPvpIva();
    maxPvpPromocionalSinCan = this.getMaxPvpPromocionalSinCantMin();
    sumDto = this.getSumaDto();
    valorDto = ((sumPvpIva - maxPvpPromocionalSinCan) * conteoArticulo) * this.mPromotions.cant_Min / conteoArticulo;
    dtoMedio = (sumDto / conteoArticulo);




    this.mPromotions.pvp_Promotion = maxPvpPromocional;
    if (isNaN(valorDto)) valorDto = 0;
    if (isNaN(dtoMedio)) dtoMedio = 0;
    this.mPromotions.valor_Dto = valorDto;
    this.mPromotions.dto_Medio = dtoMedio;



  }

  getMaxPvpPromocional(cant_Min: number) {

    var promotion = 0;
    var varTemp = 0;

    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];

      if (element.accion != "D") {
        varTemp = element.pvp_Promocional * cant_Min;

        if (varTemp > promotion)
          promotion = varTemp;
      }


    }

    return promotion;

  }

  getSumPvpPromocional(cant_Min: number) {

    var sumPromocional = 0;
    var varTemp = 0;

    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];

      if (element.accion != "D") {
        sumPromocional = sumPromocional + element.pvp_Promocional;
      }


    }

    return sumPromocional;

  }

  getMaxPvpPromocionalSinCantMin() {

    var promotion = 0;
    var varTemp = 0;

    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];
      if (element.accion != "D") {
        varTemp = element.pvp_Promocional;

        if (varTemp > promotion)
          promotion = varTemp;
      }

    }

    return promotion;

  }

  getConteoArticulo() {

    var conteoArticulo = 0;
    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];
      if (element.accion != "D") {
        conteoArticulo = conteoArticulo + 1
      }
    }

    return conteoArticulo;

  }

  getPvpIva() {

    var sumaPvpIva = 0;
    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];

      if (element.accion != "D") {
        //sumaPvpIva = sumaPvpIva + (element.pvp + ((element.pvp * element.iva) / 100));
        sumaPvpIva = sumaPvpIva + element.pvp;
      }

    }

    return sumaPvpIva;

  }

  getSumaDto() {

    var sumaDto = 0;
    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];

      if (element.accion != "D") {
        sumaDto = sumaDto + element.dto;
      }

    }

    return sumaDto;

  }



  tieneIgualPvpPromocionla(pvp_Promocional: any) {

    var existe = false;
    var listaAValidar = this.commonService.getListaArticulosAnadidosPRO().filter(x => x.accion != "D");

    if (listaAValidar.length > 0) {

      for (let index = 0; index < listaAValidar.length; index++) {
        const element = listaAValidar[index];
        if (pvp_Promocional == element.pvp_Promocional) {
          existe = true;
          break;
        }

      }
    }
    else {
      existe = true;
    }

    return existe;


  }

  agregarArticuloPromotions() {

    var cont = 1;

    this.articulosDisponibles.forEach((element, i) => {

      if (element.selected && this.tieneIgualPvpPromocionla(element.pvp_Promocional)) {

        // agregar todos los atributos necesario para guardar y actualizar
        let detalleAdd = new PromotionsArticle();
        detalleAdd.id_Articulo = element.id_Articulo;
        detalleAdd.accion = "I";
        detalleAdd.nombre = element.nombre;
        detalleAdd.pvp = element.pvp;
        detalleAdd.importe = element.importe;
        detalleAdd.referencia = element.referencia;
        detalleAdd.grupo = element.grupo;
        detalleAdd.pvp_Promocional = element.pvp_Promocional;
        detalleAdd.dto = element.dto;
        detalleAdd.iva = element.iva;
        detalleAdd.item = cont;
        cont = cont + 1;

        if (!this.existeArticulo(detalleAdd)) {
          this.commonService.getListaArticulosAnadidosPRO().push(detalleAdd);
        }
        element.selected = false;
        element.estadoCheck = true;
        element.id_Tipo_Promocion = 2;

        this.estadoArtAgr = true;
      }
    });

    this.mPromotionsById.p.totalItems = this.commonService.getListaArticulosAnadidosPRO().filter(x => x.accion != "D").length;
    if (this.mPromotionsById.p.totalItems % this.mPromotionsById.p.filasPorPagina == 0)
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString());
    else
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString()) + 1;
    this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.numeroPaginas;
    this.getArticulosAnadidosPaginadoyOrdenado();
    this.getDatosGeneralesPromotions();

  }

  existeArticulo(entidad: PromotionsArticle) {

    var existe = false;
    if (this.commonService.getListaArticulosAnadidosPRO().length > 0) {

      for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
        const element = this.commonService.getListaArticulosAnadidosPRO()[index];
        if (entidad.id_Articulo == element.id_Articulo) {
          element.pvp_Promocional = entidad.pvp_Promocional
          element.dto = entidad.dto;
          if (element.id > 0)
            element.accion = "U";
          existe = true;
          break;
        }

      }
    }

    return existe;


  }

  habilitarCheckBoxDisponibles(id_Articulo: number) {

    for (let index = 0; index < this.articulosDisponibles.length; index++) {
      const element = this.articulosDisponibles[index];
      if (id_Articulo == element.id_Articulo) {
        element.estadoCheck = false;
        element.id_Tipo_Promocion = 1;
        break;
      }

    }
  }

  quitarArticuloPromotions() {
    let arrayIndices = [];
    this.commonService.getListaArticulosAnadidosPRO().forEach((element, i) => {
      if (element.selected) {
        this.habilitarCheckBoxDisponibles(element.id_Articulo);
        if (element.id > 0) {
          element.accion = "D";
        }
        else {
          arrayIndices.push(i);
        }
        element.selected = false;
      }
    });

    let newIndex = 0;
    arrayIndices.forEach((dato, j) => {
      this.commonService.getListaArticulosAnadidosPRO().splice(dato - newIndex, 1);
      newIndex = newIndex + 1;
    });

    this.mPromotionsById.p.totalItems = this.commonService.getListaArticulosAnadidosPRO().filter(x => x.accion != "D").length;
    if (this.mPromotionsById.p.totalItems % this.mPromotionsById.p.filasPorPagina == 0)
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString());
    else
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString()) + 1;
    this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.numeroPaginas;
    this.getArticulosAnadidosPaginadoyOrdenado();
    this.getDatosGeneralesPromotions();

  }


  limpiarCantidad() {
    if (this.tipoAsignacion == 1)
      this.cantTipoAsignacion = "0.00";
    else
      this.cantTipoAsignacion = 0;


  }

  quitarEliminado() {

    let arrayIndices = [];
    this.commonService.getListaArticulosAnadidosPRO().forEach((element, i) => {
      if (element.accion == "D") {
        arrayIndices.push(i);
      }
    });

    let newIndex = 0;
    arrayIndices.forEach((dato, j) => {
      this.commonService.getListaArticulosAnadidosPRO().splice(dato - newIndex, 1);
      newIndex = newIndex + 1;
    });

  }


  guardarPromotions() {

    if (this.mPromotions.importe_Minimo.toString() == "") this.mPromotions.importe_Minimo = 0;

    this.getDatosGeneralesPromotions();

    if (this.mPromotions.id_Promotion > 0) {
      this.loading = true;
      this.validarPromotionsConditions();
      this.cambioDeComaPunto(",",".");
      this.promotionsService.update(this.mPromotions, this.commonService.getListaArticulosAnadidosPRO())
        .subscribe(
          promotions => {
            this.loading = false;
            if (promotions.id_Promotion > 0) {

              var mPromotionsData = new Promotions();
              this.commonService.setValueListaArticulosAnadidosPRO(promotions.detalleArticulos);
              this.mPromotionsById.p.totalItems = promotions.detalleArticulos.length;
              this.getArticulosAnadidosPaginadoyOrdenado();
              mPromotionsData = promotions;
              this.textoModal = "La promoción se actualizó correctamente.";
              this.mPromotions.prioridad = mPromotionsData.prioridad;
              this.mPromotions.importe_Minimo = mPromotionsData.importe_Minimo;
              this.mPromotions.detalleConditions = mPromotionsData.detalleConditions;
              this.cambioDeComaPunto(".",",");

              this.asignarUpdateAccion();
              this.disableTipo(event);


            }
            else {
              this.textoModal = "Ocurrió un error al actualizar los datos.";
            }
            this.showModal = true;
            console.log(promotions);
          },
          errorCode => {
            this.loading = false;
            this.textoModal = "Ocurrió un error. Por favor intente mas tarde.";
            this.showModal = true;
            this.statusCode = errorCode;
            console.log(errorCode);
          });

    }
    else {
      this.loading = true;
      this.validarPromotionsConditions();
      this.cambioDeComaPunto(",",".");
      this.promotionsService.create(this.mPromotions, this.commonService.getListaArticulosAnadidosPRO())
        .subscribe(
          promotions => {
            this.loading = false;
            if (promotions.id_Promotion > 0) {
              this.commonService.setValueListaArticulosAnadidosPRO(promotions.detalleArticulos);
              this.mPromotionsById.p.totalItems = promotions.detalleArticulos.length;
              this.getArticulosAnadidosPaginadoyOrdenado();
              var mPromotionsData = new Promotions();
              mPromotionsData = promotions;
              this.mPromotions.code = mPromotionsData.code;
              this.mPromotions.id_Promotion = mPromotionsData.id_Promotion;
              this.mPromotions.prioridad = mPromotionsData.prioridad;
              this.mPromotions.importe_Minimo = mPromotionsData.importe_Minimo;
              this.mPromotions.detalleConditions = mPromotionsData.detalleConditions;
              this.cambioDeComaPunto(".",",");

              this.textoModal = "La promoción se guardó correctamente.";
              this.asignarUpdateAccion();
              this.disableTipo(event);

              this.mPromotions.fechaDesdeTemp = this.obtenerFechaDesde();
             

            }
            else {
              this.textoModal = "Ocurrió un error al actualizar los datos.";
            }
            this.showModal = true;
            console.log(promotions);
          },
          errorCode => {
            this.loading = false;
            this.textoModal = "Ocurrió un error. Por favor intente mas tarde.";
            this.showModal = true;
            this.statusCode = errorCode;
            console.log(errorCode)
          });

    }
  }

  cerrarModal() {
    this.showModal = false;

  }

  BuscarArticulo(a, b, c) { }
  AsignarArticulo(a, b, c) { }
  agregarEstacion(a) { }

  cambioDeComaPunto(caracter1:string,caracter2:string) {

    for (let index = 0; index < this.mPromotions.detalleConditions.length; index++) {
      const element = this.mPromotions.detalleConditions[index];
      if (!isNullOrUndefined(element.importe) && element.importe.toString() != "") {
        element.importe = element.importe.toString().replace(caracter1, caracter2);
      }
      else{
        element.importe = 0;
      }
    }

    if (!isNullOrUndefined(this.mPromotions.importe_Minimo) && this.mPromotions.importe_Minimo.toString() != "") {
      this.mPromotions.importe_Minimo = this.mPromotions.importe_Minimo.toString().replace(caracter1,caracter2);
    }
    else{
      this.mPromotions.importe_Minimo = 0;
    }

  }


  validarPromotionsConditions() {

    let arrayPromCond = [];
    this.mPromotions.detalleConditions.forEach((element, i) => {
      var importe = element.importe;
      importe = importe.toString().replace(",",".");
      if (importe.toString() == "") element.importe = 0;
      if (importe > 0) {
        if (element.accion == "N")
          element.accion = "I";
        else
          element.accion = "U";

        arrayPromCond.push(element);

      }
      else {
        if (element.accion != "N")
          element.accion = "D";

        arrayPromCond.push(element);

      }
    });

    this.mPromotions.detalleConditions = [];
    this.mPromotions.detalleConditions = arrayPromCond;


  }

  habilitarControles(): boolean {
    if (this.mPromotions.accion == "" || this.mPromotions.accion == "1") {
      if (this.mPromotions.accion == "1")
        this.estadoArtAgr = true;
      return true;
    }
    else {
      this.estadoArtAgr = true;
      return false;
    }
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal(contentSel) {
    this.modalService.open(contentSel).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  verificarPromotionsCondicion() {

    var estado = true;

    for (let index = 0; index < this.mPromotions.detalleConditions.length; index++) {
      const element = this.mPromotions.detalleConditions[index];
      if (isNull(element.importe)) element.importe = 0;

      if (!isNumber(Number.parseFloat(element.importe))) {
        estado = false;
        break;
      }

    }
    return estado;

  }

  validarFormulario(content) {

    if (isNull(this.mPromotions.prioridad)) this.mPromotions.prioridad = 0;

    if (isNull(this.mPromotions.importe_Minimo)) this.mPromotions.importe_Minimo = 0;

    this.mPromotions.v_From_str = this.obtenerFechaDesde();
    this.mPromotions.v_To_str = this.obtenerFechaHasta();

    var fecha = new Date();

    var data = new Date().toLocaleString();
    var arrayFechaHora = data.split(" ");
    var arrayFecha = arrayFechaHora[0].split("/");
    var dia = arrayFecha[0];
    var mes = arrayFecha[1];
    var annio = arrayFecha[2];
    if (dia.length == 1)
      dia = "0" + dia;
    if (mes.length == 1)
      mes = "0" + mes;

    var fechaActual = new Date(mes + "/" + dia + "/" + annio);

    var fechaDesde = new Date(this.mPromotions.v_From_str);
    var fechaDesdeTemp = new Date(this.mPromotions.fechaDesdeTemp);

    var fechaHasta = new Date(this.mPromotions.v_To_str);


    let nCamposSinRellenar = 0;
    let mensaje = "";
    let mensajeSinRellenar = "";

    this.resul = "";
    if (this.mPromotions.description == "") {
      mensajeSinRellenar += "- Descripción ";
      nCamposSinRellenar = nCamposSinRellenar + 1;
    }
    if (this.mPromotions.description_Tpv == "") {
      mensajeSinRellenar += "- Descripción Ticket ";
      nCamposSinRellenar = nCamposSinRellenar + 1;
    }
    if (this.mPromotions.v_From_str == "") {
      mensajeSinRellenar += "- Fecha Desde ";
      nCamposSinRellenar = nCamposSinRellenar + 1;
    }
    if (this.mPromotions.v_To_str == "") {
      mensajeSinRellenar += "- Fecha Hasta ";
      nCamposSinRellenar = nCamposSinRellenar + 1;
    }

    if (nCamposSinRellenar == 1) {
      mensaje = "El campo " + mensajeSinRellenar.replace('-', '') + "es obligatorio";
    }
    else if (nCamposSinRellenar > 1) {
      mensaje = "Los siguientes campos son obligatorios:  " + mensajeSinRellenar;
    }

    this.resul = mensaje;

    let mensajeOtros = "";
    let otrosMensajes = "";
    let nOtrosMensajes = 0;
    if (this.mPromotions.prioridad < 0 || this.mPromotions.prioridad > 9) {
      otrosMensajes += "- La Prioridad debe estar entre 0 a 9. ";
      nOtrosMensajes = nOtrosMensajes + 1;
    }
    if (this.mPromotions.importe_Minimo < 0 || this.mPromotions.importe_Minimo > 9999.99) {
      otrosMensajes += "- El Importe Mínimo debe estar entre 0 a 9999.99. ";
      nOtrosMensajes = nOtrosMensajes + 1;
    }
    if (!this.verificarPromotionsCondicion()) {
      otrosMensajes += "- Condiciones deben ser numérico ";
      nOtrosMensajes = nOtrosMensajes + 1;
    }

    if (nOtrosMensajes > 0) {
      if (this.resul.length > 0)
        mensajeOtros = ".  Además: " + otrosMensajes;
      else
        mensajeOtros = otrosMensajes;
    }

    this.resul = this.resul + mensajeOtros;

    if (this.resul != "")
      this.modalService.open(content, { centered: true, size: 'sm' });
    else {
      if (fechaDesde > fechaHasta) {
        this.resul = "La fecha hasta debe ser mayor a fecha desde.";
        this.modalService.open(content, { centered: true, size: 'sm' });
      }
      else {
        if (this.mPromotions.id_Promotion > 0) {
          if (fechaDesdeTemp > fechaDesde || fechaDesdeTemp < fechaDesde) {
            if (fechaDesde < fechaActual) {
              this.resul = "La fecha desde no debe  ser menor a la fecha actual.";
              this.modalService.open(content, { centered: true, size: 'sm' });
            }
            else {
              this.guardarPromotions();

            }
          }
          else {
            this.guardarPromotions();

          }
        }
        else {

          if (fechaDesde < fechaActual) {
            this.resul = "La fecha desde no debe  ser menor a la fecha actual.";
            this.modalService.open(content, { centered: true, size: 'sm' });
          }
          else {
            this.guardarPromotions();

          }


        }
      }


    }

  }

  validarSeleccion(contentSel) {

    var cantSel = 0;
    var valido = false;
    this.resul = "";

    this.articulosDisponibles.forEach((element, i) => {
      if (element.selected) {
        cantSel = cantSel + 1;
      }
    });


    for (let index = 0; index < this.articulosDisponibles.length; index++) {
      const element = this.articulosDisponibles[index];
      if (element.selected) {

        if (element.fondo == "#f79595") {
          if (element.pvp_Promocional < element.importe)
            this.resul = "Uno o varios artículos contienen un PVP Promocional inferior al coste.";
          else if (element.pvp_Promocional >= element.pvp)
            this.resul = "Uno o varios artículos contienen un PVP Promocional superior ó igual al PVP actual.";
          break;
        }
        else {
          this.resul = "";
        }
      }
    }

    if (this.resul == "") {

      if (cantSel <= 0) {
        valido = false;
        this.resul = "Es obligatorio seleccionar un artículo.";
      } else {
        valido = true;
        for (let index = 0; index < this.articulosDisponibles.length; index++) {
          const element = this.articulosDisponibles[index];
          if (element.selected) {

            if (isUndefined(element.pvp_Promocional) || isUndefined(element.dto)) {
              this.resul = "Es obligatorio asignar el PVP Promocional, % DTO y Nº artículos mínimo.";
              valido = false;
              break;
            }
            else {
              valido = true;
              this.resul = "";
            }
          }

        }

      }

      if (!valido) {
        this.modalService.open(contentSel, { centered: true, size: 'sm' });
      }
      else {

        if (!this.verificarSiCumplePvpPromocional()) {
          this.resul = "Todos los artículos de una promoción de tipo artículo deberán tener el mismo PVP Promocional.";
          this.modalService.open(contentSel, { centered: true, size: 'sm' });
        }
        else {
          this.resul = "";
          this.agregarArticuloPromotions();
        }
      }

    }
    else {
      this.modalService.open(contentSel, { centered: true, size: 'sm' });

    }



  }

  verificarSiCumplePvpPromocional() {
    var bandera = true;
    for (let index = 0; index < this.articulosDisponibles.length; index++) {
      const element = this.articulosDisponibles[index];

      if (element.selected && !this.tieneIgualPvpPromocionla(element.pvp_Promocional)) {
        bandera = false;
        break;
      }

    }
    return bandera;
  }


  asignarUpdateAccion() {

    this.commonService.getListaArticulosAnadidosPRO().forEach((element, i) => {

      element.accion = "U";

    });
  }

  obtenerPromotionsTemp() {

    this.mPromotionsTemp = new Promotions();
    this.mPromotionsTemp.id_Promotion = this.mPromotions.id_Promotion;
    this.mPromotionsTemp.code = this.mPromotions.code;
    this.mPromotionsTemp.description = this.mPromotions.description;
    this.mPromotionsTemp.description_Tpv = this.mPromotions.description_Tpv;
    this.mPromotionsTemp.qt_Dtos = this.mPromotions.qt_Dtos;
    this.mPromotionsTemp.type = this.mPromotions.type;
    this.mPromotionsTemp.v_From_str = this.mPromotions.v_From_str;
    this.mPromotionsTemp.v_To_str = this.mPromotions.v_To_str;
    this.mPromotionsTemp.id_Empresa = this.mPromotions.id_Empresa;
    this.mPromotionsTemp.type_Promotion = this.mPromotions.type_Promotion;
    this.mPromotionsTemp.limit_Car = this.mPromotions.limit_Car;
    this.mPromotionsTemp.applytoalproducts = this.mPromotions.applytoalproducts;
    this.mPromotionsTemp.applicationmode = this.mPromotions.applicationmode;
    this.mPromotionsTemp.prioridad = this.mPromotions.prioridad;
    this.mPromotionsTemp.central = this.mPromotions.central;
    this.mPromotionsTemp.tienda = this.mPromotions.tienda;
    this.mPromotionsTemp.is_Combo = this.mPromotions.is_Combo;
    this.mPromotionsTemp.importe_Minimo = this.mPromotions.importe_Minimo;
    this.mPromotionsTemp.dto_Medio = this.mPromotions.dto_Medio;
    this.mPromotionsTemp.cant_Min = this.mPromotions.cant_Min;
    this.mPromotionsTemp.pvp_Promotion = this.mPromotions.pvp_Promotion;
    this.mPromotionsTemp.valor_Dto = this.mPromotions.valor_Dto;
    this.mPromotionsTemp.accion = this.mPromotions.accion;
    this.mPromotionsTemp.totalFilas = this.mPromotions.totalFilas;

    this.commonService.getListaArticulosAnadidosPRO().forEach((element, i) => {

      let detalleAdd = new PromotionsArticle();
      detalleAdd.id_Articulo = element.id_Articulo;
      detalleAdd.accion = element.accion;
      detalleAdd.nombre = element.nombre;
      detalleAdd.pvp = element.pvp;
      detalleAdd.importe = element.importe;
      detalleAdd.referencia = element.referencia;
      detalleAdd.grupo = element.grupo;
      detalleAdd.pvp_Promocional = element.pvp_Promocional;
      detalleAdd.dto = element.dto;
      detalleAdd.iva = element.iva;
      detalleAdd.item = element.item;

      this.mPromotionsTemp.detalleArticulos.push(detalleAdd);

    });

  }


  calcularPaginacionGO(data: PromotionsArticle[]) {

    let paginaInicialNueva = 0;
    if (this.filtroArticulosPromotions.paginaActualGO == 1 || this.numeroPaginasGO < 6)
      paginaInicialNueva = 1;
    else if (this.filtroArticulosPromotions.paginaActualGO == this.numeroPaginasGO)
      paginaInicialNueva = this.numeroPaginasGO - 4;
    else
      paginaInicialNueva = this.filtroArticulosPromotions.listPaginasGO.length > 0 ? this.filtroArticulosPromotions.listPaginasGO[0] : 1;

    let indiceSeleccionado = 0;
    if (this.filtroArticulosPromotions.paginaActualGO > 1 && this.filtroArticulosPromotions.paginaActualGO != this.numeroPaginasGO) {
      this.filtroArticulosPromotions.listPaginasGO.forEach((element, i) => {
        if (element == this.filtroArticulosPromotions.paginaActualGO)
          indiceSeleccionado = i;
      });
      switch (indiceSeleccionado) {
        case 0:
          if (this.filtroArticulosPromotions.paginaActualGO == 1 || this.filtroArticulosPromotions.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 2;
          break;
        case 1:
          if (this.filtroArticulosPromotions.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 1;
          break;
        case 2:
          if (this.filtroArticulosPromotions.paginaActualGO == 3)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva;
          break;
        case 3:
          if (this.filtroArticulosPromotions.paginaActualGO == this.numeroPaginasGO - 1)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 1;
          break;
        case 4:
          if (this.filtroArticulosPromotions.paginaActualGO == this.numeroPaginasGO)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 2;
          break;
        default:
          break;
      }
    }

    this.filtroArticulosPromotions.listPaginasGO = [];
    this.totalItemsGO = data.length > 0 ? data[0].totalFilas : 0;
    if (this.totalItemsGO % this.filtroArticulosPromotions.filasPorPaginaGO == 0) {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.filtroArticulosPromotions.filasPorPaginaGO).toString());
    }
    else {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.filtroArticulosPromotions.filasPorPaginaGO).toString()) + 1;
    }
    if (this.numeroPaginasGO >= 5) {
      for (let index = 0; index < 5; index++) {
        this.filtroArticulosPromotions.listPaginasGO.push(paginaInicialNueva + index);
      }
    }
    else {
      for (let index = 0; index < this.numeroPaginasGO; index++) {
        this.filtroArticulosPromotions.listPaginasGO.push(paginaInicialNueva + index);
      }
    }


  }

  inicializarPaginado() {
    this.filtroArticulosPromotions.paginaActualGO = 1;
    this.numeroPaginasGO = 0;
    this.filtroArticulosPromotions.filasPorPaginaGO = 10;
    this.totalItemsGO = 0;
    this.filtroArticulosPromotions.listPaginasGO = [];
  }
  paginacionClick(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.filtroArticulosPromotions.paginaActualGO > 1) {
          this.filtroArticulosPromotions.paginaActualGO = this.filtroArticulosPromotions.paginaActualGO - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.filtroArticulosPromotions.paginaActualGO < this.numeroPaginasGO) {
          this.filtroArticulosPromotions.paginaActualGO = this.filtroArticulosPromotions.paginaActualGO + 1;
          invoke = true;
        }
        break;
      default:
        this.filtroArticulosPromotions.paginaActualGO = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getArticulosDisponibles();
  }

  setClassActive(pagina: number) {
    let clase = "";
    if (pagina == this.filtroArticulosPromotions.paginaActualGO)
      clase = "page-item active";

    return clase;
  }

  cargarPromotionsFisrtTime() {
    this.inicializarPaginado();
    this.getArticulosDisponibles();
  }


  headerClickGO(ordenadoPor: string) {
    this.filtroArticulosPromotions.orderByGO = ordenadoPor;
    this.filtroArticulosPromotions.orderDirectionGO = this.filtroArticulosPromotions.orderDirectionGO == 1 ? 0 : 1;
    this.cargarPromotionsFisrtTime();
  }

  limpiarFiltrosArticulos() {
    this.loading = true;
    this.filtroArticulosPromotions.referenciaFiltro = "";
    this.filtroArticulosPromotions.proveedorFiltro = 0;
    this.filtroArticulosPromotions.descripcionFiltro = "";
    this.filtroArticulosPromotions.categoriaFiltro = [];
    this.filtroArticulosPromotions.familiaFiltro = [];
    this.filtroArticulosPromotions.subFamiliaFiltro = [];

    this.articulosDisponibles = [];
    this.numeroPaginasGO = 0;

    this.categoriasService.getAll()
      .subscribe(
        result => {
          this.mCategorias = result;
          this.filtroArticulosPromotions.categoriaFiltro = result.map(c => c.id_Categoria);
          this.obtenerFamiliasEnCascada();
          //this.loading = false;
        },
        error => {
          console.log(error);

        }
      );


  }



  setClassHeaderOrder() {
    let clase = "";
    if (this.filtroArticulosPromotions.orderDirectionGO == 1)
      clase = "assets/arrow-up.jpg";
    else
      clase = "assets/arrow-down.jpg";
    return clase;
  }


  selectedAllCategorias() {
    this.loading = true;
    this.filtroArticulosPromotions.familiaFiltro = [];
    this.filtroArticulosPromotions.subFamiliaFiltro = [];
    let array = [];
    array = this.mCategorias.map(cat => cat.id_Categoria);
    //array.push(0);
    this.filtroArticulosPromotions.categoriaFiltro = array;
    this.obtenerFamiliasEnCascada();
  }

  selectedAllFamilias() {
    this.loading = true;
    this.filtroArticulosPromotions.subFamiliaFiltro = [];
    let array = [];
    array = this.mFamiliasPadre.map(famp => famp.id_Familias_Padre);
    this.filtroArticulosPromotions.familiaFiltro = array;
    this.familiasService.getAll(this.filtroArticulosPromotions)
      .subscribe(
        result => {
          this.mFamilias = result;
          this.filtroArticulosPromotions.subFamiliaFiltro = result.map(s => s.id_Familias);
          this.loading = false;
        },
        error => {
          console.log(error);

        }
      );
  }


  selectedAllSubFamilias() {
    this.loading = true;
    let array = [];
    array = this.mFamilias.map(fam => fam.id_Familias);
    this.loading = false;
    this.filtroArticulosPromotions.subFamiliaFiltro = array;
  }

  disableTipo(event) {
    // Usamos el método emit
    this.desahabilitarTipo.emit();
  }


  validarEntradaNroArti() {
    let nroArtMin: number
    nroArtMin = this.cant_Min;
    if (isNull(nroArtMin))
      this.cant_Min = 0;
    else if (!isNumber(nroArtMin))
      this.cant_Min = 0;
    else if (nroArtMin < 0)
      this.cant_Min = 0;
  }

  validarEntradaCanTipAsi() {

    let canTipoAsi: number
    canTipoAsi = this.cantTipoAsignacion;
    if (isNull(canTipoAsi))
      this.cantTipoAsignacion = 0;
    else if (!isNumber(canTipoAsi))
      this.cantTipoAsignacion = 0;
    else if (canTipoAsi < 0)
      this.cantTipoAsignacion = 0;
    else if (this.tipoAsignacion == 2) {
      if (this.cantTipoAsignacion <= 0 || this.cantTipoAsignacion > 100)
        this.cantTipoAsignacion = 0;
    }


  }


  onInputNroArt() {
    let nroArtMin: number
    nroArtMin = this.cant_Min;
    if (isNull(nroArtMin))
      this.cant_Min = 0;
    else if (!isNumber(nroArtMin))
      this.cant_Min = 0;
    else if (nroArtMin < 0)
      this.cant_Min = 0;
  }

  onInputCanTipAsi() {

    let canTipoAsi: number
    canTipoAsi = this.cantTipoAsignacion;
    if (isNull(canTipoAsi))
      this.cantTipoAsignacion = 0;
    else if (!isNumber(canTipoAsi))
      this.cantTipoAsignacion = 0;
    else if (canTipoAsi < 0)
      this.cantTipoAsignacion = 0;
    else if (this.tipoAsignacion == 2) {
      if (this.cantTipoAsignacion <= 0 || this.cantTipoAsignacion > 100)
        this.cantTipoAsignacion = 0;
    }

  }

  validarSeleccionQuitar(contentSelQuitar) {


    var cantSel = 0;
    var valido = false;
    this.resul = "";

    this.commonService.getListaArticulosAnadidosPRO().forEach((element, i) => {
      if (element.selected) {
        cantSel = cantSel + 1;
      }
    });

    if (cantSel <= 0) {

      this.resul = "Es obligatorio seleccionar un artículo.";
      this.modalService.open(contentSelQuitar, { centered: true, size: 'sm' });
    } else {

      this.resul = "";
      this.quitarArticuloPromotions();
    }

  }


  existeEnAgregados(id_Articulo) {

    var existe = false;
    for (let index = 0; index < this.commonService.getListaArticulosAnadidosPRO().length; index++) {
      const element = this.commonService.getListaArticulosAnadidosPRO()[index];
      if (id_Articulo == element.id_Articulo && element.accion != "D") {
        existe = true;
        break;
      }
      else
        existe = false;
    }
    return existe;

  }
  addSoloArticulosDisponibles(lista: PromotionsArticle[]) {

    this.articulosDisponibles = [];

    var id_Grupos_Oferta_Temp = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];

      if (!this.existeEnAgregados(element.id_Articulo))
        this.articulosDisponibles.push(element);
    }

  }

  asignarNombreTooltip() {

    let nombreProveedor: string;
    nombreProveedor = "";
    let id: number
    id = 0;
    id = this.filtroArticulosPromotions.proveedorFiltro;

    for (let index = 0; index < this.mProveedores.length; index++) {
      const element = this.mProveedores[index];

      if (element.id_Proveedores == id) {
        this.proveedorFiltroNombre = element.razon_Social;
        break;
      }
    }

  }

  getArticulosAnadidosPaginadoyOrdenado() {
    this.mPromotionsById.p.filasPorPagina = this.mPromotionsById.p.filasPorPagina == 100 || this.mPromotionsById.p.filasPorPagina == 0 ? 10 : this.mPromotionsById.p.filasPorPagina;
    var listaPaginadaYOrdenada = this.commonService.getValueListaArticulosAnadidosPRO(this.mPromotionsById.p.paginaActual, this.mPromotionsById.p.filasPorPagina, this.mPromotionsById.orderBy, this.mPromotionsById.orderDirection);
    this.mPromotions.detalleArticulos = [];
    this.mPromotions.detalleArticulos = listaPaginadaYOrdenada;
    this.calcularPaginacionArticulosAnadidos(listaPaginadaYOrdenada);
  }

  calcularPaginacionArticulosAnadidos(data: any[]) {
    var p = new Paginacion();
    p.filasPorPagina = this.mPromotionsById.p.filasPorPagina;
    p.listPaginas = this.mPromotionsById.p.listPaginas;
    p.numeroPaginas = this.mPromotionsById.p.numeroPaginas;
    p.paginaActual = this.mPromotionsById.p.paginaActual;

    p.totalItems = this.mPromotionsById.p.totalItems == 0 ? (data.length > 0 ? data[0].totalFilas : 0) : this.mPromotionsById.p.totalItems;
    this.mPromotionsById.p = this._paginacionHelper.calcularPaginacion(p);
  }

  paginacionClickArticulosAnadidos(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.mPromotionsById.p.paginaActual > 1) {
          this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.paginaActual - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.mPromotionsById.p.paginaActual < this.mPromotionsById.p.numeroPaginas) {
          this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.paginaActual + 1;
          invoke = true;
        }
        break;
      default:
        this.mPromotionsById.p.paginaActual = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getArticulosAnadidosPaginadoyOrdenado();
  }

  setClassActiveArticulosAnadidos(pagina: number) {
    let clase = "";
    if (pagina == this.mPromotionsById.p.paginaActual)
      clase = "page-item active";

    return clase;
  }

  headerClickArticulosAnadidos(ordenadoPor: string) {
    this.mPromotionsById.orderBy = ordenadoPor;
    this.mPromotionsById.orderDirection = this.mPromotionsById.orderDirection == 1 ? 0 : 1;
    this.getArticulosAnadidosPaginadoyOrdenado();
  }

  setClassHeaderOrderArticulosAnadidos() {
    let clase = "";
    if (this.mPromotionsById.orderDirection == 1)
      clase = "assets/arrow-up-small.jpg";
    else
      clase = "assets/arrow-down-small.jpg";
    return clase;
  }

  ngOnDestroy() {
    this.commonService.setValueListaArticulosAnadidosPRO([]);
  }

}
