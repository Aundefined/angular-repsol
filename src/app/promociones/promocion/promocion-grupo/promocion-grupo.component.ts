import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GruposOfertasFiltro, PromotionsGrupo,
  ArticulosPromotionsGrupo, Articulos,
  PromotionsByIdFiltro, Promotions, Paginacion
} from '../../../_models/index';
import { PromotionsService, PromotionsGrupoService, CommonService } from '../../../_services/index';
import { Alert } from 'selenium-webdriver';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { isNull, isUndefined, isNumber, isNullOrUndefined } from 'util';
import { ElementSchemaRegistry } from '@angular/compiler';
import { PaginacionHelper } from '../../../_helpers/index';

@Component({
  selector: 'app-promocion-grupo',
  templateUrl: './promocion-grupo.component.html',
  styleUrls: ['./promocion-grupo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PromocionGrupoComponent implements OnInit, OnDestroy {

  @Input() mPromotions = new Promotions();
  @Input() mPromotionsById = new PromotionsByIdFiltro();
  @Output() volverForm = new EventEmitter();
  @Output() desahabilitarTipo = new EventEmitter();
  cambio: boolean;
  public loading = false;
  gruposOfertasFiltro = new GruposOfertasFiltro();
  promotionsGrupo: PromotionsGrupo[];
  listaPromotionsGrupo: PromotionsGrupo[];
  mPromotionsTemp = new Promotions();
  mPromotionsFinal = new Promotions();
  listaArticulo: ArticulosPromotionsGrupo[];
  promotionsGrupoValidado: PromotionsGrupo[];
  tipoAsignacion: number;
  cantTipoAsignacion: any;
  estadoGrupoDisp: boolean;
  estadoGrupoAgr: boolean;
  detArticulos: Articulos[];
  ocultaFila: boolean;
  textoModal: string;
  showModal: boolean;
  statusCode: number;
  cant_Min: number;
  closeResult: string;
  resul: string;
  mensajeError: string;

  public totalItemsGO: number = 0;
  public numeroPaginasGO: number = 0;

  constructor(private promotionsGrupoService: PromotionsGrupoService, private promotionsService: PromotionsService,
    private router: Router, private modalService: NgbModal, private _paginacionHelper: PaginacionHelper,
    private commonService: CommonService) {
    this.cambio = true;
    this.cantTipoAsignacion = "0.00";
    this.tipoAsignacion = 1;
    this.estadoGrupoDisp = false;
    this.estadoGrupoAgr = false;
    this.ocultaFila = false;
    this.listaPromotionsGrupo = [];
    this.listaArticulo = [];
    this.cant_Min = 0;
    this.resul = "";
    this.promotionsGrupoValidado = [];
    this.mensajeError = "";
  }
  chkEstadio: any;

  ngOnInit() {
    this.cambio = true;
    this.estadoGrupoDisp = false;
    this.estadoGrupoAgr = false;
    this.cant_Min = 0;
    this.promotionsGrupo = [];

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

  getGruposDisponibles() {
    this.loading = true;
    this.gruposOfertasFiltro.paginacionBd = false;
    if (this.mPromotions.id_Promotion > 0)
      this.gruposOfertasFiltro.id_Promotion = this.mPromotions.id_Promotion;
    else
      this.gruposOfertasFiltro.id_Promotion = 0;
     
    this.promotionsGrupoService.getAll(this.gruposOfertasFiltro)
      .subscribe(
        result => {
          console.log(JSON.stringify(this.resul));
          this.estructurarGrupo(result);
          this.calcularPaginacionGO(result);
          this.loading = false;
          this.estadoGrupoDisp = true;
        },
        error => {
          console.log(error);

        }
      );
  }

  limpiarCantidad() {
    if (this.tipoAsignacion == 1)
      this.cantTipoAsignacion = "0.00";
    else
      this.cantTipoAsignacion = 0;
  }

  existeEnAgregados(id_Grupos_Oferta) {

    var existe = false;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];
      if (id_Grupos_Oferta == element.id_Grupos_Oferta && element.accion != "D") {
        existe = true;
        break;
      }
      else
        existe = false;
    }
    return existe;

  }

  estructurarGrupo(lista: PromotionsGrupo[]) {

    this.promotionsGrupo = [];

    var id_Grupos_Oferta_Temp = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];

      let entity = new PromotionsGrupo();

      if (id_Grupos_Oferta_Temp != element.id_Grupos_Oferta) {

        entity.id_Grupos_Oferta = element.id_Grupos_Oferta;
        entity.codigo = element.codigo;
        entity.nombre = element.nombre;
        entity.codigoPG = element.codigoPG;
        entity.cant_Min = element.cant_Min;
        entity.valor_Medio_Grupo = element.valor_Medio_Grupo;
        entity.valorRowSpan = this.getCantArticuloGrupo(lista, element.id_Grupos_Oferta);

        entity.ocultarFila = true;
        entity.id_Articulo = element.id_Articulo;
        entity.referencia = element.referencia;
        entity.nombre_Articulo = element.nombre_Articulo;
        entity.pvp = element.pvp;
        entity.iva = element.iva;
        entity.importe = element.importe;
        entity.pvp_Promocional = "";
        entity.dto = "";

        if (!this.existeEnAgregados(element.id_Grupos_Oferta))
          this.promotionsGrupo.push(entity);


      }
      else {

        entity.id_Grupos_Oferta = element.id_Grupos_Oferta;
        entity.codigo = element.codigo;
        entity.nombre = element.nombre;
        entity.codigoPG = element.codigoPG;
        entity.cant_Min = this.cant_Min;
        entity.valor_Medio_Grupo = 0.00

        entity.valorRowSpan = "0";
        entity.ocultarFila = false;
        entity.id_Articulo = element.id_Articulo;
        entity.referencia = element.referencia;
        entity.nombre_Articulo = element.nombre_Articulo;
        entity.pvp = element.pvp;
        entity.iva = element.iva;
        entity.importe = element.importe;
        entity.pvp_Promocional = "";
        entity.dto = "";

        if (!this.existeEnAgregados(element.id_Grupos_Oferta))
          this.promotionsGrupo.push(entity);
      }

      id_Grupos_Oferta_Temp = element.id_Grupos_Oferta;


    }

    console.log(JSON.stringify(this.promotionsGrupo));

  }

  getArticuloGrupo(lista: PromotionsGrupo[], idGrupoOferta: number) {

    this.detArticulos = [];
    let detalleAdd;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];

      if (element.id_Grupos_Oferta == idGrupoOferta) {
        detalleAdd = new Articulos();
        detalleAdd.referencia = element.referencia;
        detalleAdd.nombre_Articulo = element.nombre_Articulo;
        detalleAdd.pvp = element.pvp;
        detalleAdd.importe = element.importe;
        detalleAdd.pvp_Promocional = element.pvp_Promocional;
        detalleAdd.dto = element.dto;
        this.detArticulos.push(detalleAdd);
      }
    }
    console.log(JSON.stringify(this.detArticulos));
    return this.detArticulos;

  }

  getCantArticuloGrupo(lista: PromotionsGrupo[], idGrupoOferta: number) {

    var cant = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      if (element.id_Grupos_Oferta == idGrupoOferta) {
        cant = cant + 1;
      }
    }

    return cant.toString();


  }


  generarValorMedioGrupo(id_Grupos_Oferta: number) {

    var sumaPvp = 0;
    var sumaPvpPromocional = 0;
    var conteoPvpPromocional = 0;
    var cantidadMinima = 0;
    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      var grupo = this.promotionsGrupo[index];

      if (grupo.id_Grupos_Oferta == id_Grupos_Oferta) {
        sumaPvp = sumaPvp + grupo.pvp;
        sumaPvpPromocional = sumaPvpPromocional + grupo.pvp_Promocional;
        conteoPvpPromocional = conteoPvpPromocional + 1;
        cantidadMinima = grupo.cant_Min;
      }
    }

    return ((sumaPvp - sumaPvpPromocional) / conteoPvpPromocional) * cantidadMinima;

  }

  existeSeleccionArtDispo() {

    var valido = true;
    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      var articulo = this.promotionsGrupo[index];
      if (articulo.selected) {
        this.mensajeError = "";
        valido = true;
        break;
      }
      else {
        this.mensajeError = "Es obligatorio seleccionar un grupo.";
        valido = false;
      }
    }
    return valido;
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
    else {
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
      }

    }

    return valido;

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

  asignarFondoValorMedioGrupo(id_Grupos_Oferta: number) {
    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      var grupo = this.promotionsGrupo[index];
      if (id_Grupos_Oferta == grupo.id_Grupos_Oferta) {
        grupo.fondoMedio = "#f79595";
      }
      else {
        if (index % 2 == 1)
          grupo.fondoMedio = "#e9edf5";
        else
          grupo.fondoMedio = "#d1dded";
      }
    }
  }

  asignarPvpPromDesc() {

    if (this.validarEntradaPvpPromDesc() && this.validarNroArticulos() && !isUndefined(this.promotionsGrupo)) {

      var estadoDto = true;
      var indexSelec = 0;
      var pvp_Promocional_temp = 0;
      var id_Grupos_Oferta = 0;
      for (let index = 0; index < this.promotionsGrupo.length; index++) {
        var grupo = this.promotionsGrupo[index];
        if (this.existeSeleccionArtDispo()) {
          if (grupo.selected) {

            grupo.cant_Min = this.cant_Min;

            if (this.tipoAsignacion == 1) {
              if (grupo.selected) {
                grupo.pvp_Promocional = this.cantTipoAsignacion;
                if (grupo.pvp == 0)
                  grupo.dto = 0;
                else
                  grupo.dto = ((grupo.pvp - this.cantTipoAsignacion) / grupo.pvp) * 100;

                if (this.cantTipoAsignacion >= grupo.pvp || this.cantTipoAsignacion < grupo.importe) {
                  grupo.fondo = "#f79595";
                  grupo.fondoMedio = "#f79595";
                  id_Grupos_Oferta = grupo.id_Grupos_Oferta;
                }
                else {
                  if (index % 2 == 1)
                    grupo.fondo = "#e9edf5";
                  else
                    grupo.fondo = "#d1dded";

                }
                if (this.cantTipoAsignacion < grupo.importe)
                  grupo.colorImporte = "#f79595";
                else
                  grupo.colorImporte = "#000000";

                if (this.cantTipoAsignacion >= grupo.pvp)
                  grupo.colorPvp = "#f79595";
                else
                  grupo.colorPvp = "#000000";


              }


            } else {
              if (this.tipoAsignacion == 2) {
                if (grupo.selected) {
                  if (grupo.selected && estadoDto) {
                    grupo.dto = this.cantTipoAsignacion;
                    grupo.pvp_Promocional = grupo.pvp - (grupo.dto * grupo.pvp) / 100;
                    pvp_Promocional_temp = grupo.pvp_Promocional;

                    if (pvp_Promocional_temp >= grupo.pvp || pvp_Promocional_temp < grupo.importe) {
                      grupo.fondo = "#f79595";
                      grupo.fondoMedio = "#f79595";
                      id_Grupos_Oferta = grupo.id_Grupos_Oferta;

                    } else {
                      if (index % 2 == 1)
                        grupo.fondo = "#e9edf5";
                      else
                        grupo.fondo = "#d1dded";
                    }

                    if (pvp_Promocional_temp < grupo.importe)
                      grupo.colorImporte = "#f79595";
                    else
                      grupo.colorImporte = "#000000";

                    if (pvp_Promocional_temp >= grupo.pvp)
                      grupo.colorPvp = "#f79595";
                    else
                      grupo.colorPvp = "#000000";

                    estadoDto = false;

                    index = -1;
                  }
                  else {

                    grupo.pvp_Promocional = pvp_Promocional_temp;
                    if (grupo.pvp == 0)
                      grupo.dto = 0;
                    else
                      grupo.dto = ((grupo.pvp - pvp_Promocional_temp) / grupo.pvp) * 100;
                    if (pvp_Promocional_temp >= grupo.pvp || pvp_Promocional_temp < grupo.importe) {
                      grupo.fondo = "#f79595";
                      grupo.fondoMedio = "#f79595";
                      id_Grupos_Oferta = grupo.id_Grupos_Oferta;
                    }
                    else {
                      if (index % 2 == 1)
                        grupo.fondo = "#e9edf5";
                      else
                        grupo.fondo = "#d1dded";
                    }

                    if (pvp_Promocional_temp < grupo.importe)
                      grupo.colorImporte = "#f79595";
                    else
                      grupo.colorImporte = "#000000";

                    if (pvp_Promocional_temp >= grupo.pvp)
                      grupo.colorPvp = "#f79595";
                    else
                      grupo.colorPvp = "#000000";
                    //}
                  }
                }

              }
            }

          }
        }
      }

      for (let index = 0; index < this.promotionsGrupo.length; index++) {
        var grupo = this.promotionsGrupo[index];
        if (grupo.pvp_Promocional != "" && grupo.dto != "")
          grupo.dto_Medio_Grupo = this.generarValorMedioGrupo(grupo.id_Grupos_Oferta);
      }

      this.asignarFondoValorMedioGrupo(id_Grupos_Oferta);

    }

  }

  getDatosGeneralesPromotions() {

    var totalCantMin = 0;
    var sumaTotalPvpPromotion = 0;
    var sumaDtoMedioGrupo = 0;
    var sumaTotalDto = 0;
    var sumTotalDtoPorcentaje = 0;

    var sumaPvpPromocional = 0;
    var conteoCodigoGrupo = 0;
    var sumDto = 0;

    var cantidadMinima = 0;
    var id_Grupos_Oferta = 0;

    var conteoArticulo = 0;
    var sumTotalMedioPorGrupo = 0
    var sumMedioPorGrupo = 0


    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {

      if (element.accion != "D") {
        if (id_Grupos_Oferta != element.id_Grupos_Oferta) {

          sumaPvpPromocional = this.getSumaPvpPromocional(element.id_Grupos_Oferta);
          conteoCodigoGrupo = this.getConteoCodigoGrupo(element.id_Grupos_Oferta);
          sumMedioPorGrupo = this.getMedioPorGrupo(element.id_Grupos_Oferta);

          cantidadMinima = element.cant_Min;

          sumaTotalPvpPromotion = sumaTotalPvpPromotion + (element.pvp_Promocional * cantidadMinima);
          sumaTotalDto = sumaTotalDto + ((sumDto / conteoCodigoGrupo) - (sumaPvpPromocional / conteoCodigoGrupo)) * cantidadMinima;
          sumTotalDtoPorcentaje = sumTotalDtoPorcentaje + ((sumDto / conteoCodigoGrupo) * cantidadMinima);

          id_Grupos_Oferta = element.id_Grupos_Oferta;
          totalCantMin = totalCantMin + parseInt(element.cant_Min.toString());
          sumaDtoMedioGrupo = sumaDtoMedioGrupo + parseFloat(element.dto_Medio_Grupo);
          sumTotalMedioPorGrupo = sumTotalMedioPorGrupo + (sumMedioPorGrupo * cantidadMinima);
        }
      }

    });

    conteoArticulo = this.getConteoArticulo();
    sumDto = this.getSumaDto();

    this.mPromotions.cant_Min = totalCantMin;
    this.mPromotions.pvp_Promotion = sumaTotalPvpPromotion;
    this.mPromotions.valor_Dto = sumaDtoMedioGrupo;

    this.mPromotions.dto_Medio = (sumTotalMedioPorGrupo / this.mPromotions.cant_Min) * 100;

    if (isNaN(this.mPromotions.dto_Medio)) this.mPromotions.dto_Medio = 0.00;

  }

  getMedioPorGrupo(id_Grupos_Oferta: number) {

    var sumMedioPorGrupo = 0;
    var sumPVP = 0;
    var sumPVP_Promocional = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];
      if (element.accion != "D") {
        if (id_Grupos_Oferta == element.id_Grupos_Oferta) {
          sumPVP = sumPVP + element.pvp;
          sumPVP_Promocional = sumPVP_Promocional + element.pvp_Promocional;
        }
      }
    }

    if (this.commonService.getListaGruposAnadidosPRO().length > 0)
      sumMedioPorGrupo = ((sumPVP - sumPVP_Promocional) / sumPVP);

    return sumMedioPorGrupo;

  }


  getSumaPvpPromocional(id_Grupos_Oferta: number) {

    var sumaPvpPromocional = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];

      if (element.accion != "D") {
        if (id_Grupos_Oferta == element.id_Grupos_Oferta) {
          sumaPvpPromocional = sumaPvpPromocional + element.pvp_Promocional;
        }
      }
    }

    return sumaPvpPromocional;

  }

  getConteoArticulo() {

    var conteoArticulo = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];
      if (element.accion != "D") {
        conteoArticulo = conteoArticulo + 1
      }
    }

    return conteoArticulo;

  }


  getConteoCodigoGrupo(id_Grupos_Oferta: number) {

    var conteoCodigoGrupo = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];
      if (element.accion != "D") {
        if (id_Grupos_Oferta == element.id_Grupos_Oferta) {
          conteoCodigoGrupo = conteoCodigoGrupo + 1;
        }
      }
    }

    return conteoCodigoGrupo;

  }

  getSumaDto() {

    var sumaDto = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];

      if (element.accion != "D") {
        sumaDto = sumaDto + element.dto;
      }

    }

    return sumaDto;

  }

  getDto(id_Grupos_Oferta: number) {

    var sumaDto = 0;
    for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
      const element = this.commonService.getListaGruposAnadidosPRO()[index];
      if (element.accion != "D") {
        if (id_Grupos_Oferta == element.id_Grupos_Oferta) {
          sumaDto = sumaDto + (element.pvp + ((element.pvp * element.iva) / 100));
        }
      }
    }

    return sumaDto;

  }


  agregarGrupoPromotions() {
    var cont = 1;
    var id_Grupos_Oferta_Temp = 0;
    var idGrupoOfertaTemp = 0;

    let gruposNuevos = [];
    this.promotionsGrupo.forEach((element, i) => {
      if (element.selected) {
        let detalleAdd = new PromotionsGrupo();
        let articulosPromotionsGrupo = new ArticulosPromotionsGrupo();

        if (id_Grupos_Oferta_Temp != element.id_Grupos_Oferta) {
          detalleAdd.id_Grupos_Oferta = element.id_Grupos_Oferta;
          detalleAdd.accion = "I";
          detalleAdd.codigo = element.codigo;
          detalleAdd.nombre = element.nombre;
          detalleAdd.id_Articulo = element.id_Articulo;
          detalleAdd.cant_Min = element.cant_Min;
          detalleAdd.referencia = element.referencia;
          detalleAdd.nombre_Articulo = element.nombre_Articulo;
          detalleAdd.pvp = element.pvp;
          detalleAdd.iva = element.iva;
          detalleAdd.importe = element.importe;
          detalleAdd.pvp_Promocional = element.pvp_Promocional;
          detalleAdd.dto = element.dto;
          detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;
          detalleAdd.valorRowSpan = this.getCantArticuloGrupo(this.promotionsGrupo, element.id_Grupos_Oferta);
          detalleAdd.ocultarFila = true;

          articulosPromotionsGrupo.id_GruposOferta = element.id_Grupos_Oferta;
          articulosPromotionsGrupo.id_Articulo = element.id_Articulo;
          articulosPromotionsGrupo.dto = element.dto;
          articulosPromotionsGrupo.pvp_Promocional = element.pvp_Promocional;

          detalleAdd.detalle.push(articulosPromotionsGrupo);



          if (!this.existeArticulo(detalleAdd)) {
            gruposNuevos.push(element.id_Grupos_Oferta);
            this.commonService.addValueListaGruposAnadidosPRO(detalleAdd);
            element.pvp_Promocional = "";
            element.dto = "";
            element.dto_Medio_Grupo = "";


          }
          element.selected = false;
          element.estadoCheck = true;

        }
        else {

          detalleAdd.id_Grupos_Oferta = element.id_Grupos_Oferta;;
          detalleAdd.codigo = element.codigo;
          detalleAdd.nombre = element.nombre;
          detalleAdd.cant_Min = element.cant_Min;

          detalleAdd.valorRowSpan = "0";
          detalleAdd.ocultarFila = false;
          detalleAdd.accion = "I";
          detalleAdd.id_Articulo = element.id_Articulo;
          detalleAdd.referencia = element.referencia;
          detalleAdd.nombre_Articulo = element.nombre_Articulo;
          detalleAdd.pvp = element.pvp;
          detalleAdd.iva = element.iva;
          detalleAdd.importe = element.importe;
          detalleAdd.pvp_Promocional = element.pvp_Promocional;
          detalleAdd.dto = element.dto;
          detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;

          articulosPromotionsGrupo.id_GruposOferta = element.id_Grupos_Oferta;
          articulosPromotionsGrupo.id_Articulo = element.id_Articulo;
          articulosPromotionsGrupo.dto = element.dto;
          articulosPromotionsGrupo.pvp_Promocional = element.pvp_Promocional;

          detalleAdd.detalle.push(articulosPromotionsGrupo);

          if (!this.existeArticulo(detalleAdd)) {
            this.commonService.addValueListaGruposAnadidosPRO(detalleAdd);
            element.dto_Medio_Grupo = "";
            element.dto = "";
            element.pvp_Promocional = "";
          }
          element.selected = false;
          element.estadoCheck = true;

        }

        id_Grupos_Oferta_Temp = element.id_Grupos_Oferta;

        this.estadoGrupoAgr = true;

      }
    });

    //Agregar en MasterDetail  
    let masterDetail: PromotionsGrupo;
    //llamar al metodo de estructurar master detail antes de grabar
    //LLenar manualmente
    let listaNuevosGrupos: PromotionsGrupo[] = [];
    gruposNuevos.forEach(element => {
      var item = this.commonService.getListaGruposAnadidosPRO().filter(x => x.id_Grupos_Oferta == element)[0];
      listaNuevosGrupos.push(item);
    });

    var id_Grupos_OfertaAux = 0;
    listaNuevosGrupos.forEach((element, i) => {
      if (id_Grupos_OfertaAux != element.id_Grupos_Oferta) {
        masterDetail = new PromotionsGrupo();
        masterDetail.id_Grupos_Oferta = element.id_Grupos_Oferta;
        masterDetail.accion = element.accion;
        masterDetail.id_PromotionsGrupo = element.id_PromotionsGrupo;
        masterDetail.codigo = element.codigo;
        masterDetail.nombre = element.nombre;
        masterDetail.id_Articulo = element.id_Articulo;
        masterDetail.cant_Min = element.cant_Min;
        masterDetail.referencia = element.referencia;
        masterDetail.nombre_Articulo = element.nombre_Articulo;
        masterDetail.pvp = element.pvp;
        masterDetail.iva = element.iva;
        masterDetail.importe = element.importe;
        masterDetail.pvp_Promocional = element.pvp_Promocional;
        masterDetail.dto = element.dto;
        masterDetail.dto_Medio_Grupo = element.dto_Medio_Grupo;

        masterDetail.detalle = this.getArticulos(element.id_Grupos_Oferta, element.id_Articulo);

        this.commonService.addValueListaGruposAnadidosPROMasterDetail(masterDetail);

        id_Grupos_OfertaAux = element.id_Grupos_Oferta;
      }

    });

    this.mPromotionsById.p.totalItems = this.commonService.getListaGruposAnadidosPROMasterDetail().filter(x => x.accion != "D").length;
    if (this.mPromotionsById.p.totalItems % this.mPromotionsById.p.filasPorPagina == 0)
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString());
    else
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString()) + 1;
    this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.numeroPaginas;
    this.getGruposAnadidosPaginadoyOrdenado();
    this.getDatosGeneralesPromotions();


  }

  asignarSeleccionDisponible(id_Grupos_Oferta: number) {

    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      const element = this.promotionsGrupo[index];

      if (element.id_Grupos_Oferta == id_Grupos_Oferta) {
        if (element.selected) {
          this.promotionsGrupo.forEach((objeto, i) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = true;
            }
          });
          break;
        }
        else {
          this.promotionsGrupo.forEach((objeto, j) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = false;
            }
          });
          break;
        }
      }
    }
  }

  asignarSeleccionAgregados(id_Grupos_Oferta: number) {

    for (let index = 0; index < this.mPromotions.detalleGrupos.length; index++) {
      const element = this.mPromotions.detalleGrupos[index];

      if (element.id_Grupos_Oferta == id_Grupos_Oferta) {
        if (element.selected) {
          this.mPromotions.detalleGrupos.forEach((objeto, i) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = true;
            }
          });
          this.commonService.getListaGruposAnadidosPRO().forEach((objeto, i) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = true;
            }
          });
          break;
        }
        else {
          this.mPromotions.detalleGrupos.forEach((objeto, j) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = false;
            }
          });
          this.commonService.getListaGruposAnadidosPRO().forEach((objeto, j) => {
            if (id_Grupos_Oferta == objeto.id_Grupos_Oferta) {
              objeto.selected = false;
            }
          });
          break;
        }
      }
    }
  }
  existeArticulo(entidad: PromotionsGrupo) {

    var existe = false;
    if (this.commonService.getListaGruposAnadidosPRO().length > 0) {

      for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
        const element = this.commonService.getListaGruposAnadidosPRO()[index];
        //alert(entidad.id_Grupos_Oferta + " : " + element.id_Grupos_Oferta  + "   " +  entidad.id_Articulo  + " : " + element.id_Articulo);
        if (entidad.id_Grupos_Oferta == element.id_Grupos_Oferta && entidad.id_Articulo == element.id_Articulo) {
          element.pvp_Promocional = entidad.pvp_Promocional;
          element.dto = entidad.dto;
          element.cant_Min = entidad.cant_Min;
          element.dto_Medio_Grupo = entidad.dto_Medio_Grupo;
          if (element.id_PromotionsGrupo > 0) {
            element.accion = "U";
            this.commonService.updateEstadoListaGruposAnadidosPROMasterDetailOculto(element.id_PromotionsGrupo, "U", element.id_Grupos_Oferta, element.id_Articulo, element.pvp_Promocional, element.dto, element.cant_Min, element.dto_Medio_Grupo);
          }
          existe = true;
          break;
        }

      }
    }

    return existe;


  }

  habilitarCheckBoxDisponibles(id_Grupos_Oferta: number) {

    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      const element = this.promotionsGrupo[index];
      if (id_Grupos_Oferta == element.id_Grupos_Oferta) {
        element.estadoCheck = false;
        break;
      }

    }
  }

  quitarGrupoPromotions() {
    let arrayIndices = [];
    let arrayIndicesTemp = [];
    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {


      if (element.selected) {
        this.habilitarCheckBoxDisponibles(element.id_Grupos_Oferta);
        //arrayIndices.push(element);
        if (element.id_PromotionsGrupo > 0) {
          element.accion = "D";
          this.commonService.updateEstadoListaGruposAnadidosPROMasterDetail(element.id_PromotionsGrupo, "D");
        }
        else {
          this.commonService.deleteItemListaGruposAnadidosPROMasterDetail(element.id_Grupos_Oferta);
          arrayIndices.push(i);
        }
        element.selected = false;
      }
    });


    let newIndex = 0;
    arrayIndices.forEach((dato, j) => {
      this.commonService.getListaGruposAnadidosPRO().splice(dato - newIndex, 1);
      newIndex = newIndex + 1;
    });

    this.mPromotionsById.p.totalItems = this.commonService.getListaGruposAnadidosPROMasterDetail().filter(x => x.accion != "D").length;
    if (this.mPromotionsById.p.totalItems % this.mPromotionsById.p.filasPorPagina == 0)
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString());
    else
      this.mPromotionsById.p.numeroPaginas = parseInt((this.mPromotionsById.p.totalItems / this.mPromotionsById.p.filasPorPagina).toString()) + 1;
    this.mPromotionsById.p.paginaActual = this.mPromotionsById.p.numeroPaginas;
    this.getGruposAnadidosPaginadoyOrdenado();
    this.getDatosGeneralesPromotions();

  }

  agregarLoQuitado() {

    this.listaPromotionsGrupo.forEach((element, j) => {
      this.commonService.addValueListaGruposAnadidosPRO(element);
    });

  }

  generarListaPromotionsEstructurada() {

    this.promotionsGrupoValidado = [];

    var id_Grupos_Oferta = 0;

    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {

      if (id_Grupos_Oferta != element.id_Grupos_Oferta) {

        let promotionGrupoTemp = new PromotionsGrupo();

        promotionGrupoTemp.id_Grupos_Oferta = element.id_Grupos_Oferta;

        promotionGrupoTemp.accion = element.accion;

        promotionGrupoTemp.id_PromotionsGrupo = element.id_PromotionsGrupo;
        promotionGrupoTemp.codigo = element.codigo;
        promotionGrupoTemp.nombre = element.nombre;
        promotionGrupoTemp.id_Articulo = element.id_Articulo;
        promotionGrupoTemp.cant_Min = element.cant_Min;
        promotionGrupoTemp.referencia = element.referencia;
        promotionGrupoTemp.nombre_Articulo = element.nombre_Articulo;
        promotionGrupoTemp.pvp = element.pvp;
        promotionGrupoTemp.iva = element.iva;
        promotionGrupoTemp.importe = element.importe;
        promotionGrupoTemp.pvp_Promocional = element.pvp_Promocional;
        promotionGrupoTemp.dto = element.dto;
        promotionGrupoTemp.dto_Medio_Grupo = element.dto_Medio_Grupo;

        promotionGrupoTemp.detalle = this.getArticulos(element.id_Grupos_Oferta, element.id_Articulo);

        this.promotionsGrupoValidado.push(promotionGrupoTemp);

        id_Grupos_Oferta = element.id_Grupos_Oferta;
      }

    });


    this.mPromotionsFinal.id_Promotion = this.mPromotions.id_Promotion;
    this.mPromotionsFinal.code = this.mPromotions.code;
    this.mPromotionsFinal.description = this.mPromotions.description;
    this.mPromotionsFinal.description_Tpv = this.mPromotions.description_Tpv;
    this.mPromotionsFinal.qt_Dtos = this.mPromotions.qt_Dtos;
    this.mPromotionsFinal.type = this.mPromotions.type;
    this.mPromotionsFinal.v_From_str = this.mPromotions.v_From_str;
    this.mPromotionsFinal.v_To_str = this.mPromotions.v_To_str;
    this.mPromotionsFinal.id_Empresa = this.mPromotions.id_Empresa;
    this.mPromotionsFinal.type_Promotion = this.mPromotions.type_Promotion;
    this.mPromotionsFinal.limit_Car = this.mPromotions.limit_Car;
    this.mPromotionsFinal.applytoalproducts = this.mPromotions.applytoalproducts;
    this.mPromotionsFinal.applicationmode = this.mPromotions.applicationmode;
    this.mPromotionsFinal.prioridad = this.mPromotions.prioridad;
    this.mPromotionsFinal.central = this.mPromotions.central;
    this.mPromotionsFinal.tienda = this.mPromotions.tienda;
    this.mPromotionsFinal.is_Combo = this.mPromotions.is_Combo;
    this.mPromotionsFinal.importe_Minimo = this.mPromotions.importe_Minimo;
    if (isNaN(this.mPromotions.dto_Medio))
      this.mPromotionsFinal.dto_Medio = 0.00;
    else
      this.mPromotionsFinal.dto_Medio = this.mPromotions.dto_Medio;
    this.mPromotionsFinal.cant_Min = this.mPromotions.cant_Min;
    this.mPromotionsFinal.pvp_Promotion = this.mPromotions.pvp_Promotion;
    this.mPromotionsFinal.valor_Dto = this.mPromotions.valor_Dto;
    this.mPromotionsFinal.accion = this.mPromotions.accion;
    this.mPromotionsFinal.totalFilas = this.mPromotions.totalFilas;


    this.mPromotionsFinal.detalleConditions = this.mPromotions.detalleConditions;
    this.mPromotionsFinal.detalleGrupos = this.promotionsGrupoValidado;

  }

  getArticulos(id_Grupos_Oferta: number, id_Articulo: number) {

    this.listaArticulo = [];

    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {

      if (id_Grupos_Oferta == element.id_Grupos_Oferta) {

        let articulo = new ArticulosPromotionsGrupo();

        articulo.id_GruposOferta = element.id_Grupos_Oferta;
        articulo.id_Articulo = element.id_Articulo;
        articulo.dto = element.dto;
        articulo.pvp_Promocional = element.pvp_Promocional;
        articulo.id_PromotionsGrupo = element.id_PromotionsGrupo;
        articulo.nombre = element.nombre_Articulo;
        articulo.referencia = element.referencia;
        articulo.importe = element.importe;
        articulo.pvp = element.pvp;
        articulo.iva = element.iva;

        this.listaArticulo.push(articulo);

      }


    });

    return this.listaArticulo;

  }




  guardarPromotions() {

    if (this.mPromotions.importe_Minimo.toString() == "") this.mPromotions.importe_Minimo = 0;

    this.getDatosGeneralesPromotions();

    if (this.mPromotions.id_Promotion > 0) {
      this.loading = true;
      this.validarPromotionsConditions();
      this.cambioDeComaPunto(",",".");
      this.generarListaPromotionsEstructurada();
      console.log(JSON.stringify(this.mPromotionsFinal));
      this.promotionsService.updatePromotionsGrupo(this.mPromotionsFinal)
        .subscribe(
          promotions => {
            this.loading = false;
            if (promotions.id_Promotion > 0) {
              this.commonService.setValueListaGruposAnadidosPROMasterDetail(promotions.detalleGrupos);
              this.mPromotionsById.p.totalItems = promotions.detalleGrupos.length;
              this.getGruposAnadidosPaginadoyOrdenado();
              var mPromotionsData = new Promotions();
              mPromotionsData = promotions;
              this.mPromotions.importe_Minimo = mPromotionsData.importe_Minimo;
              this.mPromotions.detalleConditions = mPromotionsData.detalleConditions;
              this.cambioDeComaPunto(".",",");
              this.textoModal = "Se Actualizaran los datos.";
              this.asignarUpdateAccion();
              this.disableTipo(event);

            }
            else {
              this.textoModal = "Ocurrió un error al actualizar los datos.";
            }
            this.showModal = true;
            console.log(promotions);
          },
          errorCode => { this.statusCode = errorCode; console.log(errorCode) });

    }
    else {
      this.loading = true;
      this.validarPromotionsConditions();
      this.cambioDeComaPunto(",",".");
      this.generarListaPromotionsEstructurada();
      console.log(JSON.stringify(this.mPromotionsFinal));


      this.promotionsService.createPromotionsGrupo(this.mPromotionsFinal)
        .subscribe(
          promotions => {
            this.loading = false;
            if (promotions.id_Promotion > 0) {
              this.commonService.setValueListaGruposAnadidosPROMasterDetail(promotions.detalleGrupos);
              this.mPromotionsById.p.totalItems = promotions.detalleGrupos.length;
              this.getGruposAnadidosPaginadoyOrdenado();
              var mPromotionsData = new Promotions();
              mPromotionsData = promotions;
              this.mPromotions.code = mPromotionsData.code;
              this.mPromotions.id_Promotion = mPromotionsData.id_Promotion;
              this.mPromotions.importe_Minimo = mPromotionsData.importe_Minimo;
              this.mPromotions.detalleConditions = mPromotionsData.detalleConditions;
              this.cambioDeComaPunto(".",",");
              this.gruposOfertasFiltro.id_Promotion = this.mPromotions.id_Promotion;
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
          errorCode => { this.statusCode = errorCode; console.log(errorCode) });


    }

  }

  asignarUpdateAccion() {

    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {

      element.accion = "U";

    });
  }

  
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

    console.log(JSON.stringify(this.mPromotions.detalleConditions));

    let arrayPromCond = [];
    this.mPromotions.detalleConditions.forEach((element, i) => {
      var importe =  element.importe;
      importe = parseFloat(importe.toString().replace(",","."));
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

  cerrarModal() {
    this.showModal = false;
  }


  BuscarArticulo(a, b, c) { }
  AsignarArticulo(a, b, c) { }
  agregarEstacion(a) { }

  volverFormCrear(event) {
    this.volverForm.emit({ cambio: this.cambio });

  }

  habilitarControles(): boolean {

    if (this.mPromotions.accion == "" || this.mPromotions.accion == "1") {
      if (this.mPromotions.accion == "1")
        this.estadoGrupoAgr = true;
      return true;
    }
    else {
      this.estadoGrupoAgr = true;
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
        mensajeOtros = ". " + otrosMensajes;
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
        } else {
          this.guardarPromotions();
        }
      }else{
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

  limpiarFiltroGrupos() {

    this.gruposOfertasFiltro.codigoFiltro = "";
    this.gruposOfertasFiltro.descripcionFiltro = "";
    this.promotionsGrupo = [];
    this.numeroPaginasGO = 0;

  }


  validarSeleccion(contentSel) {

    var cantSel = 0;
    var valido = false;
    this.resul = "";

    this.promotionsGrupo.forEach((element, i) => {
      if (element.selected) {
        cantSel = cantSel + 1;
      }
    });


    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      const element = this.promotionsGrupo[index];
      if (element.selected) {
        if (element.fondo == "#f79595") {
          if (element.pvp_Promocional < element.importe)
            this.resul = "Uno o varios grupos contienen algún artículo con un PVP Promocional inferior al coste.";
          else if (element.pvp_Promocional >= element.pvp)
            this.resul = "Uno o varios grupos contienen algún artículo con un PVP Promocional superior al PVP actual.";
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
        for (let index = 0; index < this.promotionsGrupo.length; index++) {
          const element = this.promotionsGrupo[index];
          if (element.selected) {
            if (isNullOrUndefined(element.pvp_Promocional) || element.pvp_Promocional == "" || isNullOrUndefined(element.dto || element.dto == "")) {
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

        this.agregarGrupoPromotions();

      }

    }
    else {
      this.modalService.open(contentSel, { centered: true, size: 'sm' });

    }



  }

  verificarSiCumplePvpPromocional() {
    var bandera = true;
    for (let index = 0; index < this.promotionsGrupo.length; index++) {
      const element = this.promotionsGrupo[index];

      if (element.selected && !this.tieneIgualPvpPromocionla(element.pvp_Promocional)) {
        bandera = false;
        break;
      }

    }
    return bandera;
  }

  tieneIgualPvpPromocionla(pvp_Promocional: any) {

    var existe = false;

    if (this.commonService.getListaGruposAnadidosPRO().length > 0) {

      for (let index = 0; index < this.commonService.getListaGruposAnadidosPRO().length; index++) {
        const element = this.commonService.getListaGruposAnadidosPRO()[index];
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


  calcularPaginacionGO(data: PromotionsGrupo[]) {

    let paginaInicialNueva = 0;
    if (this.gruposOfertasFiltro.paginaActualGO == 1 || this.numeroPaginasGO < 6)
      paginaInicialNueva = 1;
    else if (this.gruposOfertasFiltro.paginaActualGO == this.numeroPaginasGO)
      paginaInicialNueva = this.numeroPaginasGO - 4;
    else
      paginaInicialNueva = this.gruposOfertasFiltro.listPaginasGO.length > 0 ? this.gruposOfertasFiltro.listPaginasGO[0] : 1;

    let indiceSeleccionado = 0;
    if (this.gruposOfertasFiltro.paginaActualGO > 1 && this.gruposOfertasFiltro.paginaActualGO != this.numeroPaginasGO) {
      this.gruposOfertasFiltro.listPaginasGO.forEach((element, i) => {
        if (element == this.gruposOfertasFiltro.paginaActualGO)
          indiceSeleccionado = i;
      });
      switch (indiceSeleccionado) {
        case 0:
          if (this.gruposOfertasFiltro.paginaActualGO == 1 || this.gruposOfertasFiltro.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 2;
          break;
        case 1:
          if (this.gruposOfertasFiltro.paginaActualGO == 2)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva - 1;
          break;
        case 2:
          if (this.gruposOfertasFiltro.paginaActualGO == 3)
            paginaInicialNueva = 1;
          else
            paginaInicialNueva = paginaInicialNueva;
          break;
        case 3:
          if (this.gruposOfertasFiltro.paginaActualGO == this.numeroPaginasGO - 1)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 1;
          break;
        case 4:
          if (this.gruposOfertasFiltro.paginaActualGO == this.numeroPaginasGO)
            paginaInicialNueva = this.numeroPaginasGO - 4;
          else
            paginaInicialNueva = paginaInicialNueva + 2;
          break;
        default:
          break;
      }
    }

    this.gruposOfertasFiltro.listPaginasGO = [];
    this.totalItemsGO = data.length > 0 ? data[0].totalFilas : 0;
    if (this.totalItemsGO % this.gruposOfertasFiltro.filasPorPaginaGO == 0) {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.gruposOfertasFiltro.filasPorPaginaGO).toString());
    }
    else {
      this.numeroPaginasGO = parseInt((this.totalItemsGO / this.gruposOfertasFiltro.filasPorPaginaGO).toString()) + 1;
    }
    if (this.numeroPaginasGO >= 5) {
      for (let index = 0; index < 5; index++) {
        this.gruposOfertasFiltro.listPaginasGO.push(paginaInicialNueva + index);
      }
    }
    else {
      for (let index = 0; index < this.numeroPaginasGO; index++) {
        this.gruposOfertasFiltro.listPaginasGO.push(paginaInicialNueva + index);
      }
    }


  }

  inicializarPaginado() {
    this.gruposOfertasFiltro.paginaActualGO = 1;
    this.numeroPaginasGO = 0;
    this.gruposOfertasFiltro.filasPorPaginaGO = 5;
    this.totalItemsGO = 0;
    this.gruposOfertasFiltro.listPaginasGO = [];
  }
  paginacionClick(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.gruposOfertasFiltro.paginaActualGO > 1) {
          this.gruposOfertasFiltro.paginaActualGO = this.gruposOfertasFiltro.paginaActualGO - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.gruposOfertasFiltro.paginaActualGO < this.numeroPaginasGO) {
          this.gruposOfertasFiltro.paginaActualGO = this.gruposOfertasFiltro.paginaActualGO + 1;
          invoke = true;
        }
        break;
      default:
        this.gruposOfertasFiltro.paginaActualGO = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getGruposDisponibles();
  }

  setClassActive(pagina: number) {
    let clase = "";
    if (pagina == this.gruposOfertasFiltro.paginaActualGO)
      clase = "page-item active";

    return clase;
  }

  cargarPromotionsFisrtTime() {
    this.inicializarPaginado();
    this.getGruposDisponibles();
  }


  headerClickGO(ordenadoPor: string) {
    this.gruposOfertasFiltro.orderByGO = ordenadoPor;
    this.gruposOfertasFiltro.orderDirectionGO = this.gruposOfertasFiltro.orderDirectionGO == 1 ? 0 : 1;
    this.cargarPromotionsFisrtTime();
  }

  setClassHeaderOrder() {
    let clase = "";
    if (this.gruposOfertasFiltro.orderDirectionGO == 1)
      clase = "assets/arrow-up.jpg";
    else
      clase = "assets/arrow-down.jpg";
    return clase;
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

    this.commonService.getListaGruposAnadidosPRO().forEach((element, i) => {
      if (element.selected) {
        cantSel = cantSel + 1;
      }
    });

    if (cantSel <= 0) {

      this.resul = "Es obligatorio seleccionar un grupo.";
      this.modalService.open(contentSelQuitar, { centered: true, size: 'sm' });
    } else {

      this.resul = "";
      this.quitarGrupoPromotions();
    }

  }

  getGruposAnadidosPaginadoyOrdenado() {
    this.mPromotionsById.p.filasPorPagina = this.mPromotionsById.p.filasPorPagina == 100 || this.mPromotionsById.p.filasPorPagina == 0 ? 10 : this.mPromotionsById.p.filasPorPagina;
    var listaPaginadaYOrdenada = this.commonService.getValueListaGruposAnadidosPRO(this.mPromotionsById.p.paginaActual, this.mPromotionsById.p.filasPorPagina, this.mPromotionsById.orderBy, this.mPromotionsById.orderDirection);
    this.mPromotions.detalleGrupos = [];
    this.mPromotions.detalleGrupos = listaPaginadaYOrdenada;
    this.calcularPaginacionGruposAnadidos(listaPaginadaYOrdenada);
  }

  calcularPaginacionGruposAnadidos(data: any[]) {
    var p = new Paginacion();
    p.filasPorPagina = this.mPromotionsById.p.filasPorPagina;
    p.listPaginas = this.mPromotionsById.p.listPaginas;
    p.numeroPaginas = this.mPromotionsById.p.numeroPaginas;
    p.paginaActual = this.mPromotionsById.p.paginaActual;

    p.totalItems = this.mPromotionsById.p.totalItems == 0 ? (data.length > 0 ? data[0].totalFilas : 0) : this.mPromotionsById.p.totalItems;
    this.mPromotionsById.p = this._paginacionHelper.calcularPaginacion(p);
  }

  paginacionClickGruposAnadidos(pagina: number) {
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
      this.getGruposAnadidosPaginadoyOrdenado();
  }

  setClassActiveGruposAnadidos(pagina: number) {
    let clase = "";
    if (pagina == this.mPromotionsById.p.paginaActual)
      clase = "page-item active";

    return clase;
  }

  headerClickGruposAnadidos(ordenadoPor: string) {
    this.mPromotionsById.orderBy = ordenadoPor;
    this.mPromotionsById.orderDirection = this.mPromotionsById.orderDirection == 1 ? 0 : 1;
    this.getGruposAnadidosPaginadoyOrdenado();
  }

  setClassHeaderOrderGruposAnadidos() {
    let clase = "";
    if (this.mPromotionsById.orderDirection == 1)
      clase = "assets/arrow-up-small.jpg";
    else
      clase = "assets/arrow-down-small.jpg";
    return clase;
  }

  ngOnDestroy() {
    this.commonService.clearListaGruposAnadidosPRO();
    this.commonService.clearListaGruposAnadidosPROMasterDetail();
  }

}
