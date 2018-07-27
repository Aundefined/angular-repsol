import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Fechas, PromotionsGrupo, PromotionsByIdFiltro,
  ArticulosPromotionsGrupo, PromotionsConditions, Promotions,
  Paginacion
} from '../../../_models/index';
import { PromotionsService, PromotionsConditionsService, CustomDatepickerI18n, I18n, NgbDateISOParserFormatter, CommonService } from '../../../_services/index';
import { PromocionArticuloComponent } from '../promocion-articulo/promocion-articulo.component';
import { isUndefined, isNull, isNumber, isNullOrUndefined } from 'util';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgbDatepickerI18n, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DISABLED } from '@angular/forms/src/model';
import { PaginacionHelper } from '../../../_helpers/index';

@Component({
  selector: 'app-crear-promocion',
  templateUrl: './crear-promocion.component.html',
  styleUrls: ['./crear-promocion.component.css'],
  providers: [NgbDatepickerConfig, I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter }]

})
export class CrearPromocionComponent implements OnInit {

  url: string;
  tipoArt: any;
  mPromotions = new Promotions();
  mPromotionsById = new PromotionsByIdFiltro();
  estadoPro: boolean;
  estadoArt: boolean;
  estadoGru: boolean;
  mPromotionsConditions: PromotionsConditions[];
  public action: string;
  ocultaDivComPro: boolean;


  constructor(private router: Router,
    private commonService: CommonService,
    private _routeParams: ActivatedRoute,
    private promotionsConditionsService: PromotionsConditionsService,
    private promotionsService: PromotionsService, config: NgbDatepickerConfig,
    private _paginacionHelper: PaginacionHelper) {
    this.estadoPro = false;
    this.estadoArt = false;
    this.estadoGru = false;
    this.action = "";

    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };

    this._routeParams.queryParams.subscribe(params => {
      if (params['id']) {
        this.mPromotions.id_Promotion = (params['id']);
        this.mPromotionsById.id_Promotions = this.mPromotions.id_Promotion;
      }
      if (params['action']) {
        this.mPromotions.accion = (params['action']);
        this.action = this.mPromotions.accion;
        if (this.action == "")
          this.mPromotions.habilitarTipo = true;
        else
          this.mPromotions.habilitarTipo = false;
      }
    });


  }

  ngOnInit() {

    this.estadoPro = true;
    this.estadoArt = true;
    this.estadoGru = false;

    this.getPromotionsConditions();
    this.getPromotionById();
    this.mPromotions.habilitarTipo = true;

    this.ocultaDivComPro = true;

    this.mPromotions.fecha_desde = new Fechas();
    this.mPromotions.fecha_hasta = new Fechas();

    var date = new Date();
    this.mPromotions.fecha_desde = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };


  }



  redireccionarTipo(a) {
    if (this.mPromotions.type == "1") {
      this.estadoPro = true;
      this.estadoArt = true;
      this.estadoGru = false;
      this.mPromotionsById.p.filasPorPagina = 10;
      this.mPromotionsById.orderBy = "referencia";
    } else {
      this.estadoPro = true;
      this.estadoArt = false;
      this.estadoGru = true;
      this.mPromotionsById.p.filasPorPagina = 5;
      this.mPromotionsById.orderBy = "codigo";
    }

  }

  cambiarEstadoArt(event) {

    this.estadoPro = event.cambio;
    this.estadoArt = event.cambio;
    this.estadoGru = !event.cambio;
  }

  cambiarEstadoGru(event) {

    this.estadoPro = event.cambio;
    this.estadoArt = !event.cambio;
    this.estadoGru = event.cambio;
  }

  inhabilitarTipo() {

    this.mPromotions.habilitarTipo = false;

  }

  getPromotionsConditions() {

    this.promotionsConditionsService.getAll()
      .subscribe(
        result => {
          this.mPromotions.detalleConditions = result;
          console.log(JSON.stringify(this.mPromotions.detalleConditions));

        },
        error => {
          console.log(error);

        }
      );
  }

  getPromotionById() {
    if (this.mPromotions.id_Promotion > 0) {
      this.promotionsService.getById(this.mPromotionsById)
        .subscribe(
          resultById => {

            var mPromotionsData = new Promotions();
            mPromotionsData = resultById;
            this.mPromotions = resultById;
            this.mPromotions.type = resultById.type.toString();
            this.mPromotions.accion = this.action;

            if (this.mPromotions.type == "2") {
              this.mPromotionsById.p.filasPorPagina = 5;
              this.mPromotionsById.orderBy = "codigo";
              this.commonService.setValueListaGruposAnadidosPROMasterDetail(resultById.detalleGrupos);
              this.mPromotionsById.p.totalItems = resultById.detalleGrupos.length;
              this.getGruposAnadidosPaginadoyOrdenado();
            }
            else {
              this.mPromotionsById.p.filasPorPagina = 10;
              this.mPromotionsById.orderBy = "referencia";
              this.commonService.setValueListaArticulosAnadidosPRO(resultById.detalleArticulos);
              this.mPromotionsById.p.totalItems = resultById.detalleArticulos.length;
              this.getArticulosAnadidosPaginadoyOrdenado();
            }

            var arrayFechaDesde = this.mPromotions.v_From_str.split("/");
            var arrayFechaHasta = this.mPromotions.v_To_str.split("/");

            var objFechaDesde = new Fechas();
            objFechaDesde.year = Number.parseInt(arrayFechaDesde[2]);
            objFechaDesde.month = Number.parseInt(arrayFechaDesde[1]);
            objFechaDesde.day = Number.parseInt(arrayFechaDesde[0]);
            this.mPromotions.fechaDesdeTemp = arrayFechaDesde[2] + "/" + arrayFechaDesde[1] + "/" + arrayFechaDesde[0];

            var objFechaHasta = new Fechas();
            objFechaHasta.year = Number.parseInt(arrayFechaHasta[2]);
            objFechaHasta.month = Number.parseInt(arrayFechaHasta[1]);
            objFechaHasta.day = Number.parseInt(arrayFechaHasta[0]);

            this.mPromotions.fecha_desde = objFechaDesde;
            this.mPromotions.fecha_hasta = objFechaHasta;


            this.inicializarControlesDetalle();

            if (this.mPromotions.type == "2") {
              this.estadoPro = true;
              this.estadoArt = false;
              this.estadoGru = true;
              this.estructurarGrupo();
              this.mPromotions.detalleConditionsTemp = this.mPromotions.detalleConditions;


            }
            else {
              this.estadoPro = true;
              this.estadoArt = true;
              this.estadoGru = false;

            }
            this.cambioDeComaPunto(".",",");


          },
          error => {
            console.log(error);

          }
        );
    }

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

  getCantArticuloGrupo(idGrupoOferta: number) {

    var cant = 0;
    for (let index = 0; index < this.mPromotions.detalleGrupos.length; index++) {
      const element = this.mPromotions.detalleGrupos[index];
      if (element.id_Grupos_Oferta == idGrupoOferta) {
        cant = cant + 1;
      }
    }
    return cant.toString();

  }
  estructurarGrupo() {

    var id_Grupos_Oferta_Temp = 0;
    var nroFila = 0;

    for (let index = 0; index < this.mPromotions.detalleGrupos.length; index++) {
      const element = this.mPromotions.detalleGrupos[index];
      nroFila = nroFila + 1;
    }

    let articulosPromotionsGrupo = new ArticulosPromotionsGrupo();
    for (let index = 0; index < this.mPromotions.detalleGrupos.length; index++) {
      const element = this.mPromotions.detalleGrupos[index];

      if (id_Grupos_Oferta_Temp != element.id_Grupos_Oferta) {
        element.valorRowSpan = this.getCantArticuloGrupo(element.id_Grupos_Oferta);
        element.ocultarFila = true;
        element.referencia = element.referencia;
        element.nombre_Articulo = element.nombre_Articulo;
        element.pvp = element.pvp;
        element.id_Articulo = element.id_Articulo;
        element.id_Grupos_Oferta = element.id_Grupos_Oferta;
        element.id_PromotionsGrupo = element.id_PromotionsGrupo;
        element.accion = "U";


      }
      else {
        element.valorRowSpan = "0"
        element.ocultarFila = false;
        element.referencia = element.referencia;
        element.nombre_Articulo = element.nombre_Articulo;
        element.pvp = element.pvp;
        element.pvp_Promocional = element.pvp_Promocional;
        element.id_Articulo = element.id_Articulo;
        element.id_Grupos_Oferta = element.id_Grupos_Oferta;
        element.id_PromotionsGrupo = element.id_PromotionsGrupo;
        element.accion = "U";

      }
      id_Grupos_Oferta_Temp = element.id_Grupos_Oferta;

    }



  }

  habilitarControles(): boolean {
    if (this.action == "" || this.action == "1") {
      return true;
    }
    else {
      return false;
    }
  }

  habilitarRadioTipoPromocion(): boolean {
    if (this.action == "") {
      return true;
    }
    else {
      return false;
    }
  }

  inicializarControlesDetalle() {
    if (this.mPromotions.type == "1" || this.mPromotions.type == "0") {
      this.estadoPro = true;
      this.estadoArt = true;
      this.estadoGru = false;
    }
    else {
      this.estadoPro = true;
      this.estadoArt = false;
      this.estadoGru = true;
    }
  }


  asignarDetalleGrupo(detalleTemp: PromotionsGrupo[]) {


    for (let i = 0; i < detalleTemp.length; i++) {
      const element = detalleTemp[i];
      for (let j = 0; j < element.detalle.length; j++) {
        const articulo = element.detalle[j];
        element.id_Grupos_Oferta = articulo.id_GruposOferta;
      }

    }


    var id_Grupos_Oferta_Temp = 0;

    this.mPromotions.detalleGrupos = [];

    for (let index = 0; index < detalleTemp.length; index++) {
      const element = detalleTemp[index];


      for (let index1 = 0; index1 < element.detalle.length; index1++) {
        const articulo = element.detalle[index1];

        let detalleAdd = new PromotionsGrupo();

        if (id_Grupos_Oferta_Temp != articulo.id_GruposOferta) {
          detalleAdd.accion = "U"
          detalleAdd.codigo = element.codigo;
          detalleAdd.nombre = element.nombre;
          detalleAdd.cant_Min = element.cant_Min;
          detalleAdd.id_PromotionsGrupo = element.id_PromotionsGrupo;
          detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;

          detalleAdd.referencia = articulo.referencia;
          detalleAdd.nombre_Articulo = articulo.nombre;
          detalleAdd.pvp = articulo.pvp;
          detalleAdd.iva = articulo.iva;
          detalleAdd.importe = articulo.importe;


          detalleAdd.id_PromotionsGrupo = articulo.id_PromotionsGrupo;
          detalleAdd.id_Articulo = articulo.id_Articulo;
          detalleAdd.dto = articulo.dto;
          detalleAdd.id_Grupos_Oferta = articulo.id_GruposOferta
          detalleAdd.pvp_Promocional = articulo.pvp_Promocional;

          detalleAdd.valorRowSpan = this.getCantArticuloDetalleGrupo(element.detalle, articulo.id_GruposOferta);
          detalleAdd.ocultarFila = true;

          this.mPromotions.detalleGrupos.push(detalleAdd);

        }

        else {

          detalleAdd.accion = "U"
          detalleAdd.codigo = element.codigo;
          detalleAdd.nombre = element.nombre;
          detalleAdd.cant_Min = element.cant_Min;
          detalleAdd.id_PromotionsGrupo = element.id_PromotionsGrupo;
          detalleAdd.dto_Medio_Grupo = element.dto_Medio_Grupo;

          detalleAdd.referencia = articulo.referencia;
          detalleAdd.nombre_Articulo = articulo.nombre;
          detalleAdd.pvp = articulo.pvp;
          detalleAdd.iva = articulo.iva;
          detalleAdd.importe = articulo.importe;


          detalleAdd.id_PromotionsGrupo = articulo.id_PromotionsGrupo;
          detalleAdd.id_Articulo = articulo.id_Articulo;
          detalleAdd.dto = articulo.dto;
          detalleAdd.id_Grupos_Oferta = articulo.id_GruposOferta
          detalleAdd.pvp_Promocional = articulo.pvp_Promocional;

          detalleAdd.valorRowSpan = "0";
          detalleAdd.ocultarFila = false;

          this.mPromotions.detalleGrupos.push(detalleAdd);


        }

        id_Grupos_Oferta_Temp = articulo.id_GruposOferta;


      }
    }

    console.log(JSON.stringify(this.mPromotions.detalleGrupos));

  }

  getCantArticuloDetalleGrupo(lista: ArticulosPromotionsGrupo[], idGrupoOferta: number) {

    var cant = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];

      if (element.id_GruposOferta == idGrupoOferta) {
        cant = cant + 1;
      }
    }

    return cant.toString();


  }

  toggleDiv(estado) {

    this.ocultaDivComPro = !estado;


  }

  esDecimal(numero) {
    var estado = false
    if (numero % 1 == 0) {
      estado = false;
    } else {
      estado = true;
    }
  }

  validarEntradaCombPromTexto(event: KeyboardEvent, indice, importe) {

    var caracter = event.key;
    var nro = importe.selectionEnd;

    var texto = this.mPromotions.detalleConditions[indice].importe.toString();

    if (!this.verificarCombProm(texto)) {

      if (this.isInteger(texto) || this.esDecimal(Number.parseFloat(texto))) {
        var primerCaracter = texto.toString().substring(0, 1);
        if (primerCaracter == "0" && texto.length > 1)
          this.mPromotions.detalleConditions[indice].importe = Number.parseFloat(texto.toString().replace("0", ""));
        else {
          var textoParcial1 = texto.toString().substring(0, nro - 1);
          var textoParcial2 = texto.toString().substring(nro, texto.length);
          var textoFinal = textoParcial1 + textoParcial2;
          if (textoFinal.toString() != "")
            this.mPromotions.detalleConditions[indice].importe = textoFinal.toString();
          else
            this.mPromotions.detalleConditions[indice].importe = "";
        }
      }
      else {
        if (!this.verificarCombProm(texto)) {
          var textoParcial1 = texto.toString().substring(0, nro - 1);
          var textoParcial2 = texto.toString().substring(nro, texto.length);
          var textoFinal = textoParcial1 + textoParcial2;
          if (textoFinal.toString() != "")
            this.mPromotions.detalleConditions[indice].importe = textoFinal.toString();
          else
            this.mPromotions.detalleConditions[indice].importe = "";
        }
      }
    }
    else {
      var primerCaracter = texto.toString().substring(0, 1);
      var segundoCaracter = texto.toString().substring(1, 2);
      if (primerCaracter == "0" && segundoCaracter != "," && texto.length > 1)
        this.mPromotions.detalleConditions[indice].importe = Number.parseFloat(texto.toString().replace("0", ""));
    }

  }

  validarEntradaCombProm(indice) {

    let importe: number
    importe = this.mPromotions.detalleConditions[indice].importe;
    if (isNull(importe))
      this.mPromotions.detalleConditions[indice].importe = 0;
    else if (!isNumber(importe))
      this.mPromotions.detalleConditions[indice].importe = 0;
    else if (importe <= 0)
      this.mPromotions.detalleConditions[indice].importe = 0;
    else {

      var numArray = (importe.toString()).split(",");
      var parteEntera: string;
      var parteDecimal: string;
      if (numArray.length != 2) {
        if (numArray.length == 1) {
          parteEntera = numArray[0];
          if (parteEntera.toString().length > 2) {
            this.mPromotions.detalleConditions[indice].importe = 0;
          }
          else if (parseFloat(parteEntera) <= 0 || parseFloat(parteEntera) >= 100)
            this.mPromotions.detalleConditions[indice].importe = 0;
          else
            this.mPromotions.detalleConditions[indice].importe = parseFloat(parteEntera);
        }
        else
          this.mPromotions.detalleConditions[indice].importe = 0;
      }
      else {
        parteEntera = numArray[0];
        parteDecimal = numArray[1];
        if (parteDecimal.toString().length > 2) {
          this.mPromotions.detalleConditions[indice].importe = parseFloat(parteEntera + "," + parteDecimal.substring(0, 2));
        }
        if (parteEntera.toString().length > 2)
          this.mPromotions.detalleConditions[indice].importe = 0;
        if (parseFloat(parteEntera) <= 0 || parseFloat(parteEntera) >= 100)
          this.mPromotions.detalleConditions[indice].importe = 0;
      }

    }


  }

  validarEntradaPrioridad() {

    let prioridad: number
    prioridad = this.mPromotions.prioridad;
    if (isNull(prioridad))
      this.mPromotions.prioridad = 0;
    else if (!isNumber(prioridad))
      this.mPromotions.prioridad = 0;
    else if (prioridad < 0)
      this.mPromotions.prioridad = 0;
    else if (prioridad < 0 || prioridad > 9)
      this.mPromotions.prioridad = 0;


  }



  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }


  verificarCombProm(texto: string) {

    var estado = false;

    if (texto.length == 1) {
      if (this.isInteger(texto) && parseInt(texto) >= 0 && parseInt(texto) <= 9) estado = true;
      else estado = false;
    }
    else if (texto.length >= 2) {

      var numArray = (texto.toString()).split(",");
      var parteEntera: string;
      var parteDecimal: string;
      var primierDigito: string;

      if (numArray.length == 2) {
        parteEntera = numArray[0];
        parteDecimal = numArray[1];
        if (parteDecimal.toString() == "") {
          primierDigito = parteEntera.substring(0, 1);
          if (this.isInteger(parteEntera) && parteEntera.length <= 2 && parseInt(parteEntera) >= 0 && parseInt(parteEntera) < 100) {
            if (parteEntera.length > 1 && primierDigito != "0") estado = true;
            else if (parteEntera.length == 1) estado = true;
            else estado = false;
          }
          else estado = false;
        }
        else {
          if (this.isInteger(parteEntera) && this.isInteger(parteDecimal) && parteEntera.length <= 2 && parteDecimal.length <= 2 && parseInt(parteEntera) >= 0 && parseInt(parteEntera) < 100 && parseInt(parteDecimal) >= 0 && parseInt(parteDecimal) < 100) {
            if (parteEntera.length > 1 && primierDigito != "0") estado = true;
            else if (parteEntera.length == 1) estado = true;
            else estado = false;

          }
          else estado = false;
        }

      }
      else {
        primierDigito = texto.substring(0, 1);
        if (this.isInteger(texto) && texto.length <= 2 && parseInt(texto) >= 0 && parseInt(texto) < 100) {
          if (texto.length > 1 && primierDigito != "0") estado = true;
          else if (texto.length == 1) estado = true;
          else estado = false;

        }
        else estado = false;

      }




    }

    return estado;

  }
  onInputChangeCombPromTexto(indice) {

    var texto = this.mPromotions.detalleConditions[indice].importe;
    if (!this.verificarCombProm(texto)) {
      this.mPromotions.detalleConditions[indice].importe = "";
    }


  }

  onInputChangeCombProm(indice) {

    var texto = "";

    if (isNaN(this.mPromotions.detalleConditions[indice].importe)) {
      texto = "0";
      this.mPromotions.detalleConditions[indice].importe = Number.parseFloat(texto);
    } else {
      texto = this.replaceAll(texto, "-", "");
      texto = this.replaceAll(texto, "*", "");
      texto = this.replaceAll(texto, "/", "");
      texto = this.replaceAll(texto, "+", "");
      if (texto == "") texto = "0";

      this.mPromotions.detalleConditions[indice].importe = Number.parseFloat(texto);

      let importe: number;
      importe = 0;
      importe = this.mPromotions.detalleConditions[indice].importe;


      if (isNull(importe))
        this.mPromotions.detalleConditions[indice].importe = 0;
      else if (!isNumber(importe))
        this.mPromotions.detalleConditions[indice].importe = 0;
      else if (importe < 0) {

        this.mPromotions.detalleConditions[indice].importe = 0;


      }
      else {

        var numArray = (importe.toString()).split(",");
        var parteEntera: string;
        var parteDecimal: string;
        if (numArray.length != 2) {
          if (numArray.length == 1) {
            parteEntera = numArray[0];
            if (parteEntera.toString().length > 2) {
              this.mPromotions.detalleConditions[indice].importe = 0;
            }
            else if (parseFloat(parteEntera) < 0 || parseFloat(parteEntera) >= 100)
              this.mPromotions.detalleConditions[indice].importe = 0;
            else {
              this.mPromotions.detalleConditions[indice].importe = parseFloat(parteEntera);
            }
          }
          else
            this.mPromotions.detalleConditions[indice].importe = 0;
        }
        else {
          parteEntera = numArray[0];
          parteDecimal = numArray[1];
          if (parteDecimal.toString().length > 2) {
            this.mPromotions.detalleConditions[indice].importe = parseFloat(parteEntera + "," + parteDecimal.substring(0, 2));
          }
          if (parteEntera.toString().length > 2)
            this.mPromotions.detalleConditions[indice].importe = 0;
          if (parseFloat(parteEntera) <= 0 || parseFloat(parteEntera) >= 100)
            this.mPromotions.detalleConditions[indice].importe = 0;


        }

      }

    }

  }

  onInputChangePrioridad() {

    let prioridad: number
    prioridad = this.mPromotions.prioridad;
    if (isNull(prioridad))
      this.mPromotions.prioridad = 0;
    else if (!isNumber(prioridad))
      this.mPromotions.prioridad = 0;
    else if (prioridad < 0)
      this.mPromotions.prioridad = 0;
    else if (prioridad < 0 || prioridad > 9)
      this.mPromotions.prioridad = 0;

  }

  validarDecimal(texto: string, longitudParteEntera: number, longitudParteDecimal: number, nroMinParteEntera: number, nroMaxParteEntera: number, nroMinPartDecimal: number, nroMaxParteDecimal: number) {

    var estado = false;

    if (texto.length == 1) {
      if (this.isInteger(texto) && parseInt(texto) >= nroMinParteEntera && parseInt(texto) <= nroMaxParteEntera) estado = true;
      else estado = false;
    }
    else if (texto.length >= 2) {

      var numArray = (texto.toString()).split(",");
      var parteEntera: string;
      var parteDecimal: string;
      var primierDigito: string;

      if (numArray.length == 2) {
        parteEntera = numArray[0];
        parteDecimal = numArray[1];
        if (parteDecimal.toString() == "") {
          primierDigito = parteEntera.substring(0, 1);
          if (this.isInteger(parteEntera) && parteEntera.length <= longitudParteEntera && parseInt(parteEntera) >= nroMinParteEntera && parseInt(parteEntera) < nroMaxParteEntera) {
            if (parteEntera.length > 1 && primierDigito != "0") estado = true;
            else if (parteEntera.length == 1) estado = true;
            else estado = false;
          }
          else estado = false;
        }
        else {
          if (this.isInteger(parteEntera) && this.isInteger(parteDecimal) && parteEntera.length <= longitudParteEntera && parteDecimal.length <= longitudParteDecimal && parseInt(parteEntera) >= nroMinParteEntera && parseInt(parteEntera) < nroMaxParteEntera && parseInt(parteDecimal) >= nroMinPartDecimal && parseInt(parteDecimal) < nroMaxParteDecimal) {
            if (parteEntera.length > 1 && primierDigito != "0") estado = true;
            else if (parteEntera.length == 1) estado = true;
            else estado = false;

          }
          else estado = false;
        }

      }
      else {
        primierDigito = texto.substring(0, 1);
        if (this.isInteger(texto) && texto.length <= longitudParteEntera && parseInt(texto) >= nroMinParteEntera && parseInt(texto) < nroMaxParteEntera) {
          if (texto.length > 1 && primierDigito != "0") estado = true;
          else if (texto.length == 1) estado = true;
          else estado = false;

        }
        else estado = false;

      }




    }

    return estado;

  }

  validarEntradaImpMinTexto(event: KeyboardEvent, importeMinino) {

    var caracter = event.key;
    var nro = importeMinino.selectionEnd;

    var texto = this.mPromotions.importe_Minimo.toString();

    if (!this.validarDecimal(texto, 4, 2, 0, 10000, 0, 100)) {

      if (this.isInteger(texto) || this.esDecimal(Number.parseFloat(texto))) {
        var primerCaracter = texto.toString().substring(0, 1);
        if (primerCaracter == "0" && texto.length > 1)
          this.mPromotions.importe_Minimo = Number.parseFloat(texto.toString().replace("0", ""));
        else {
          var textoParcial1 = texto.toString().substring(0, nro - 1);
          var textoParcial2 = texto.toString().substring(nro, texto.length);
          var textoFinal = textoParcial1 + textoParcial2;
          if (textoFinal.toString() != "")
            this.mPromotions.importe_Minimo = textoFinal.toString();
          else
            this.mPromotions.importe_Minimo = "";
        }
      }
      else {
        if (!this.validarDecimal(texto, 4, 2, 0, 10000, 0, 100)) {
          var textoParcial1 = texto.toString().substring(0, nro - 1);
          var textoParcial2 = texto.toString().substring(nro, texto.length);
          var textoFinal = textoParcial1 + textoParcial2;
          if (textoFinal.toString() != "")
            this.mPromotions.importe_Minimo = textoFinal.toString();
          else
            this.mPromotions.importe_Minimo = "";
        }
      }
    }
    else {
      var primerCaracter = texto.toString().substring(0, 1);
      var segundoCaracter = texto.toString().substring(1, 2);
      if (primerCaracter == "0" && segundoCaracter != "," && texto.length > 1)
        this.mPromotions.importe_Minimo = Number.parseFloat(texto.toString().replace("0", ""));
    }


  }

  onInputChangeImpMinTexto(indice) {

    var texto = this.mPromotions.importe_Minimo;
    if (!this.validarDecimal(texto, 4, 2, 0, 10000, 0, 100)) {
      this.mPromotions.importe_Minimo = "";
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



  recorrerFechaCorrecta(s) {

    var estado = false;

    if (s.length == 1) {
      if (this.isInteger(s) && parseInt(s) >= 0 && parseInt(s) <= 3) estado = true;
      else estado = false;
    }
    else if (s.length == 2) {
      if (this.isInteger(s) && parseInt(s) >= 1 && parseInt(s) <= 31) estado = true;
      else estado = false;
    }
    else if (s.length == 3) {
      var dia = s.substring(0, 2);
      var backslash = s.substring(3, 2);
      if (this.isInteger(dia) && backslash == "/") estado = true;
      else estado = false;
    } else if (s.length == 4) {
      var dia = s.substring(0, 2);
      var backslash = s.substring(2, 3);
      var mes = s.substring(3, 4);
      if (this.isInteger(dia) && backslash == "/" && this.isInteger(mes) && (mes == "0" || mes == "1")) estado = true;
      else estado = false;
    }
    else if (s.length == 5) {
      var dia = s.substring(0, 2);
      var backslash = s.substring(2, 3);
      var mes = s.substring(3, 5);
      if (this.isInteger(dia) && backslash == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12) estado = true;
      else estado = false;
    }
    else if (s.length == 6) {
      var dia = s.substring(0, 2);
      var backslash1 = s.substring(2, 3);
      var mes = s.substring(3, 5);
      var backslash2 = s.substring(5, 6);
      if (this.isInteger(dia) && backslash1 == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12 && backslash2 == "/") estado = true;
      else estado = false;
    }
    else if (s.length == 7) {
      var dia = s.substring(0, 2);
      var backslash1 = s.substring(2, 3);
      var mes = s.substring(3, 5);
      var backslash2 = s.substring(5, 6);
      var annio = s.substring(6, 7);
      if (this.isInteger(dia) && backslash1 == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12 && backslash2 == "/" && this.isInteger(annio) && parseInt(annio) >= 1 && parseInt(annio) <= 2) estado = true;
      else estado = false;
    }
    else if (s.length == 8) {
      var dia = s.substring(0, 2);
      var backslash1 = s.substring(2, 3);
      var mes = s.substring(3, 5);
      var backslash2 = s.substring(5, 6);
      var annio = s.substring(6, 8);
      if (this.isInteger(dia) && backslash1 == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12 && backslash2 == "/" && this.isInteger(annio) && parseInt(annio) >= 19 && parseInt(annio) <= 20) estado = true;
      else estado = false;
    }
    else if (s.length == 9) {
      var dia = s.substring(0, 2);
      var backslash1 = s.substring(2, 3);
      var mes = s.substring(3, 5);
      var backslash2 = s.substring(5, 6);
      var annio = s.substring(6, 9);
      if (this.isInteger(dia) && backslash1 == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12 && backslash2 == "/" && this.isInteger(annio) && parseInt(annio) >= 190 && parseInt(annio) <= 209) estado = true;
      else estado = false;
    }
    else if (s.length == 10) {
      var dia = s.substring(0, 2);
      var backslash1 = s.substring(2, 3);
      var mes = s.substring(3, 5);
      var backslash2 = s.substring(5, 6);
      var annio = s.substring(6, 10);
      if (this.isInteger(dia) && backslash1 == "/" && this.isInteger(mes) && mes.length == 2 && parseInt(mes) >= 1 && parseInt(mes) <= 12 && backslash2 == "/" && this.isInteger(annio) && parseInt(annio) >= 1900 && parseInt(annio) <= 2099 && this.isDate(s)) {
        estado = true;
      }
      else estado = false;
    }



    return estado;


  }

  verificarFechaRealDesde() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.mPromotions.fecha_desde))
      this.mPromotions.fecha_desde = null;
    else {

      fecha_ini = this.mPromotions.fecha_desde.toString();

      if (fecha_ini != "[object Object]") {
        if (fecha_ini == "") {

          this.mPromotions.fecha_desde = null;
        } else {
          if (!this.recorrerFechaCorrecta(fecha_ini)) {
            this.mPromotions.fecha_desde = null;
          }
        }
      }
    }

  }

  verificarFechaRealHasta() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.mPromotions.fecha_hasta))
      this.mPromotions.fecha_hasta = null;
    else {

      fecha_ini = this.mPromotions.fecha_hasta.toString();

      if (fecha_ini != "[object Object]") {
        if (fecha_ini == "") {

          this.mPromotions.fecha_hasta = null;
        } else {
          if (!this.recorrerFechaCorrecta(fecha_ini)) {
            this.mPromotions.fecha_hasta = null;
          }
        }
      }
    }

  }

  asignarFechaRealDesde() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.mPromotions.fecha_desde))
      this.mPromotions.fecha_desde = null;
    else {
      fecha_ini = this.mPromotions.fecha_desde.toString();

      if (fecha_ini != "[object Object]") {

        if (fecha_ini == "") {

          this.mPromotions.fecha_desde = null;
        } else {
          if (fecha_ini.length != 10) {
            this.mPromotions.fecha_desde = null;
          } else {
            var var_fecha_ini = (fecha_ini.replace("/", "")).replace("/", "");
            if (!this.isInteger(var_fecha_ini) || var_fecha_ini.length != 8) {
              this.mPromotions.fecha_desde = null;
            }
            else {
              if (!this.isDate(fecha_ini)) {
                this.mPromotions.fecha_desde = null;
              }
              else {

                var arrayFechaDesde = (this.mPromotions.fecha_desde.toString()).split("/");

                var objFechaDesde = new Fechas();
                objFechaDesde.year = Number.parseInt(arrayFechaDesde[2]);
                objFechaDesde.month = Number.parseInt(arrayFechaDesde[1]);
                objFechaDesde.day = Number.parseInt(arrayFechaDesde[0]);

                this.mPromotions.fecha_desde = objFechaDesde;



              }
            }
          }
        }
      }
    }
  }

  asignarFechaRealHasta() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.mPromotions.fecha_hasta))
      this.mPromotions.fecha_hasta = null;
    else {
      fecha_ini = this.mPromotions.fecha_hasta.toString();

      if (fecha_ini != "[object Object]") {

        if (fecha_ini == "") {

          this.mPromotions.fecha_hasta = null;
        } else {
          if (fecha_ini.length != 10) {
            this.mPromotions.fecha_hasta = null;
          } else {
            var var_fecha_ini = (fecha_ini.replace("/", "")).replace("/", "");
            if (!this.isInteger(var_fecha_ini) || var_fecha_ini.length != 8) {
              this.mPromotions.fecha_hasta = null;
            }
            else {
              if (!this.isDate(fecha_ini)) {
                this.mPromotions.fecha_hasta = null;
              }
              else {

                var arrayFechaHasta = (this.mPromotions.fecha_hasta.toString()).split("/");

                var objFechaHasta = new Fechas();
                objFechaHasta.year = Number.parseInt(arrayFechaHasta[2]);
                objFechaHasta.month = Number.parseInt(arrayFechaHasta[1]);
                objFechaHasta.day = Number.parseInt(arrayFechaHasta[0]);

                this.mPromotions.fecha_hasta = objFechaHasta;



              }
            }
          }
        }
      }
    }
  }


  isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (((c < "0") || (c > "9"))) return false;
    }
    return true;
  }

  DaysArray(n) {
    for (var i = 1; i <= n; i++) {
      this[i] = 31
      if (i == 4 || i == 6 || i == 9 || i == 11) { this[i] = 30 }
      if (i == 2) { this[i] = 29 }
    }
    return this
  }
  daysInFebruary(year) {
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
  }

  stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    for (i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
  }

  isDate(dtStr) {

    var dtCh = "/";
    var minYear = 1900;
    var maxYear = 2100;

    var daysInMonth = this.DaysArray(12)
    var pos1 = dtStr.indexOf(dtCh)
    var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
    var strDay = dtStr.substring(0, pos1)
    var strMonth = dtStr.substring(pos1 + 1, pos2)
    var strYear = dtStr.substring(pos2 + 1)
    var strYr = "";

    strYr = strYear
    if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1)
    if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1)
    for (var i = 1; i <= 3; i++) {
      if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1)
    }
    var month = parseInt(strMonth)
    var day = parseInt(strDay)
    var year = parseInt(strYr)
    if (pos1 == -1 || pos2 == -1) {
      return false
    }
    if (strMonth.length < 1 || month < 1 || month > 12) {
      return false
    }
    if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > this.daysInFebruary(year)) || day > daysInMonth[month]) {
      return false
    }
    if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
      return false
    }
    if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || this.isInteger(this.stripCharsInBag(dtStr, dtCh)) == false) {
      return false
    }
    return true
  }



}
