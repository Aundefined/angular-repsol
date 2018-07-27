import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { Promotions, PromotionsFiltro, Fechas } from '../../../_models/index';
import { PromotionsService, CommonService, CustomDatepickerI18n, I18n, NgbDateISOParserFormatter } from '../../../_services/index';
import { empty } from 'rxjs/observable/empty';
import { Alert } from 'selenium-webdriver';
import { NgbModal, ModalDismissReasons, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { isUndefined, isNull, isString, isNullOrUndefined } from 'util';
import { ActivatedRoute } from '@angular/router';
import { NgbDatepickerI18n, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buscar-promocion',
  templateUrl: './buscar-promocion.component.html',
  styleUrls: ['./buscar-promocion.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDatepickerConfig, I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter }]
})
export class BuscarPromocionComponent implements OnInit {

  allPromotions: Promotions[];
  promotions = new Promotions();
  mPromotionsFiltro = new PromotionsFiltro();
  statusCode: number;
  public loading = false;
  contenedor: boolean;
  closeResult: string;
  id_Promotion: number;
  resul: string;
  ocultarBtn: boolean;
  nameBtn: string;
  fecha_desde: { year: number, month: number, day: number };
  fecha_hasta: { year: number, month: number, day: number };
  public totalItemsGO: number = 0;
  public action: string = "";
  fechaIni: string;



  constructor(private config: NgbDatepickerConfig, private promotionsService: PromotionsService, private modalService: NgbModal, private commonService: CommonService, private _routeParams: ActivatedRoute) {

    this.contenedor = false;
    this.resul = "";
    this.ocultarBtn = true;
    this.nameBtn = "";

    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };

    this._routeParams.queryParams.subscribe(params => {
      if (params['action']) {
        this.action = (params['action']);
      }
    });
    if (this.action == "1") {
      this.mPromotionsFiltro.codigo = commonService.getValuePromotionsFiltro().codigo;
      this.mPromotionsFiltro.descripcion = commonService.getValuePromotionsFiltro().descripcion;
      this.mPromotionsFiltro.fecha_desde = commonService.getValuePromotionsFiltro().fecha_desde;
      this.mPromotionsFiltro.fecha_hasta = commonService.getValuePromotionsFiltro().fecha_hasta;

      this.mPromotionsFiltro.paginaActualGO = commonService.getValuePromotionsFiltro().paginaActualGO;
      this.mPromotionsFiltro.filasPorPaginaGO = commonService.getValuePromotionsFiltro().filasPorPaginaGO;
      this.mPromotionsFiltro.orderByGO = commonService.getValuePromotionsFiltro().orderByGO;
      this.mPromotionsFiltro.orderDirectionGO = commonService.getValuePromotionsFiltro().orderDirectionGO;
      this.mPromotionsFiltro.listPaginasGO = commonService.getValuePromotionsFiltro().listPaginasGO;
      this.mPromotionsFiltro.numeroPaginasGO = commonService.getValuePromotionsFiltro().numeroPaginasGO;
    }

  }

  ngOnInit() {
    if (this.action == "1") {
      this.getAllPromotions();
    }
    this.fechaIni = "";
    this.fecha_desde = new Fechas();
    this.fecha_hasta = new Fechas();
  }

  obtenerFechaDesde() {

    var fecha = "01/01/1900";


    if (!isNullOrUndefined(this.fecha_desde) && !isNullOrUndefined(this.fecha_desde.day)) {
      var dia = this.fecha_desde.day.toString();
      var mes = this.fecha_desde.month.toString();
      var annio = this.fecha_desde.year.toString();
      if (dia.length == 1)
        dia = "0" + dia;
      if (mes.length == 1)
        mes = "0" + mes;

      fecha = dia + "/" + mes + "/" + annio;
    }
    return fecha;

  }
  obtenerFechaHasta() {

    var fecha = "12/12/2200";

    if (!isNullOrUndefined(this.fecha_hasta) && !isNullOrUndefined(this.fecha_hasta.day)) {
      var dia = this.fecha_hasta.day.toString();
      var mes = this.fecha_hasta.month.toString();
      var annio = this.fecha_hasta.year.toString();
      if (dia.length == 1)
        dia = "0" + dia;
      if (mes.length == 1)
        mes = "0" + mes;

      fecha = dia + "/" + mes + "/" + annio;
    }
    return fecha;

  }

  getAllPromotions() {
    this.contenedor = true;
    this.loading = true;

    this.mPromotionsFiltro.fecha_desde = this.obtenerFechaDesde();
    this.mPromotionsFiltro.fecha_hasta = this.obtenerFechaHasta();

    this.promotionsService.getAll(this.mPromotionsFiltro)
      .subscribe(
        result => {
          this.allPromotions = result;
          this.calcularPaginacionGO(result);
          this.commonService.setValuePromotionsFiltro(this.mPromotionsFiltro);
          this.loading = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  limpiarFiltros() {
    this.mPromotionsFiltro.codigo = "";
    this.mPromotionsFiltro.descripcion = "";
    this.mPromotionsFiltro.fecha_desde = "";
    this.mPromotionsFiltro.fecha_hasta = "";
    this.fecha_desde = null;
    this.fecha_hasta = null;
    this.commonService.setValuePromotionsFiltro(this.mPromotionsFiltro);
    this.allPromotions = [];
    this.mPromotionsFiltro.numeroPaginasGO = 0;

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

  showModalDarBajaPromotion(content, id: number) {

    this.resul = "Se va a realizar la baja de la promoción, ¿está seguro?";
    this.nameBtn = "Cancelar";
    this.ocultarBtn = true;
    this.modalService.open(content, { centered: true, size: 'sm' });
    this.id_Promotion = id;

  }

  darBajaPromotions(id: number) {

    this.loading = true;
    this.promotions.id_Promotion = id;
    this.promotions.prioridad = 0;
    this.promotions.tienda = "";
    this.promotions.importe_Minimo = 0;

    this.promotionsService.darBaja(this.promotions)
      .subscribe(
        result => {
          this.loading = false;
          this.resul = "La promoción se dió de baja correctamente.";
          this.ocultarBtn = false;
          this.nameBtn = "Aceptar";
          this.getAllPromotions();
        },
        error => {
          console.log(error);
          this.resul = "Error al realizar la acción.";
          this.nameBtn = "Aceptar";

        }
      );
  }

  calcularPaginacionGO(data: Promotions[]) {
    if (this.action != "1") {
      let paginaInicialNueva = 0;
      if (this.mPromotionsFiltro.paginaActualGO == 1 || this.mPromotionsFiltro.numeroPaginasGO < 6)
        paginaInicialNueva = 1;
      else if (this.mPromotionsFiltro.paginaActualGO == this.mPromotionsFiltro.numeroPaginasGO)
        paginaInicialNueva = this.mPromotionsFiltro.numeroPaginasGO - 4;
      else
        paginaInicialNueva = this.mPromotionsFiltro.listPaginasGO.length > 0 ? this.mPromotionsFiltro.listPaginasGO[0] : 1;

      let indiceSeleccionado = 0;
      if (this.mPromotionsFiltro.paginaActualGO > 1 && this.mPromotionsFiltro.paginaActualGO != this.mPromotionsFiltro.numeroPaginasGO) {
        this.mPromotionsFiltro.listPaginasGO.forEach((element, i) => {
          if (element == this.mPromotionsFiltro.paginaActualGO)
            indiceSeleccionado = i;
        });
        switch (indiceSeleccionado) {
          case 0:
            if (this.mPromotionsFiltro.paginaActualGO == 1 || this.mPromotionsFiltro.paginaActualGO == 2)
              paginaInicialNueva = 1;
            else
              paginaInicialNueva = paginaInicialNueva - 2;
            break;
          case 1:
            if (this.mPromotionsFiltro.paginaActualGO == 2)
              paginaInicialNueva = 1;
            else
              paginaInicialNueva = paginaInicialNueva - 1;
            break;
          case 2:
            if (this.mPromotionsFiltro.paginaActualGO == 3)
              paginaInicialNueva = 1;
            else
              paginaInicialNueva = paginaInicialNueva;
            break;
          case 3:
            if (this.mPromotionsFiltro.paginaActualGO == this.mPromotionsFiltro.numeroPaginasGO - 1)
              paginaInicialNueva = this.mPromotionsFiltro.numeroPaginasGO - 4;
            else
              paginaInicialNueva = paginaInicialNueva + 1;
            break;
          case 4:
            if (this.mPromotionsFiltro.paginaActualGO == this.mPromotionsFiltro.numeroPaginasGO)
              paginaInicialNueva = this.mPromotionsFiltro.numeroPaginasGO - 4;
            else if (this.mPromotionsFiltro.paginaActualGO == this.mPromotionsFiltro.numeroPaginasGO - 1)
              paginaInicialNueva = paginaInicialNueva + 1;
            else
              paginaInicialNueva = paginaInicialNueva + 2;
            break;
          default:
            break;
        }
      }

      this.mPromotionsFiltro.listPaginasGO = [];
      this.totalItemsGO = data.length > 0 ? data[0].totalFilas : 0;
      if (this.totalItemsGO % this.mPromotionsFiltro.filasPorPaginaGO == 0) {
        this.mPromotionsFiltro.numeroPaginasGO = parseInt((this.totalItemsGO / this.mPromotionsFiltro.filasPorPaginaGO).toString());
      }
      else {
        this.mPromotionsFiltro.numeroPaginasGO = parseInt((this.totalItemsGO / this.mPromotionsFiltro.filasPorPaginaGO).toString()) + 1;
      }
      if (this.mPromotionsFiltro.numeroPaginasGO >= 5) {
        for (let index = 0; index < 5; index++) {
          this.mPromotionsFiltro.listPaginasGO.push(paginaInicialNueva + index);
        }
      }
      else {
        for (let index = 0; index < this.mPromotionsFiltro.numeroPaginasGO; index++) {
          this.mPromotionsFiltro.listPaginasGO.push(paginaInicialNueva + index);
        }
      }
    }
    else {
      this.mPromotionsFiltro.numeroPaginasGO = this.mPromotionsFiltro.numeroPaginasGO;
      this.action = "";
    }

  }

  inicializarPaginado() {
    this.mPromotionsFiltro.paginaActualGO = 1;
    this.mPromotionsFiltro.numeroPaginasGO = 0;
    this.mPromotionsFiltro.filasPorPaginaGO = 10;
    this.totalItemsGO = 0;
    this.mPromotionsFiltro.listPaginasGO = [];
  }
  paginacionClick(pagina: number) {
    let invoke = false;
    switch (pagina) {
      case -1:
        if (this.mPromotionsFiltro.paginaActualGO > 1) {
          this.mPromotionsFiltro.paginaActualGO = this.mPromotionsFiltro.paginaActualGO - 1;
          invoke = true;
        }
        break;
      case 0:
        if (this.mPromotionsFiltro.paginaActualGO < this.mPromotionsFiltro.numeroPaginasGO) {
          this.mPromotionsFiltro.paginaActualGO = this.mPromotionsFiltro.paginaActualGO + 1;
          invoke = true;
        }
        break;
      default:
        this.mPromotionsFiltro.paginaActualGO = pagina;
        invoke = true;
        break;
    }
    if (invoke)
      this.getAllPromotions();
  }

  setClassActive(pagina: number) {
    let clase = "";
    if (pagina == this.mPromotionsFiltro.paginaActualGO)
      clase = "page-item active";

    return clase;
  }

  verificandoValidaciones(contentFecha) {
    var fechaActual = new Date((((new Date().toISOString().slice(0, 10)).replace("-", "/")).replace("-", "/")).replace("-", "/"));

    this.mPromotionsFiltro.fecha_desde = this.obtenerFechaDesde();
    this.mPromotionsFiltro.fecha_hasta = this.obtenerFechaHasta();


    var arrayFechaDesde = this.mPromotionsFiltro.fecha_desde.split("/");
    var arrayFechaHasta = this.mPromotionsFiltro.fecha_hasta.split("/");

    var dateDesde = new Date(arrayFechaDesde[2] + "-" + arrayFechaDesde[1] + "-" + arrayFechaDesde[0]);
    var dateHasta = new Date(arrayFechaHasta[2] + "-" + arrayFechaHasta[1] + "-" + arrayFechaHasta[0]);
    dateDesde.setDate(dateDesde.getDate() + 1);
    dateHasta.setDate(dateHasta.getDate() + 1);

    if (dateHasta < dateDesde) {
      this.resul = "Fecha Hasta no puede menor a Fecha Desde.";
      this.modalService.open(contentFecha, { centered: true, size: 'sm' });
    }
    else {
      this.resul = "";
      this.cargarPromotionsFisrtTime();
    }
  }

  cargarPromotionsFisrtTime() {

    this.inicializarPaginado();
    this.getAllPromotions();

  }


  headerClickGO(ordenadoPor: string) {
    this.mPromotionsFiltro.orderByGO = ordenadoPor;
    this.mPromotionsFiltro.orderDirectionGO = this.mPromotionsFiltro.orderDirectionGO == 1 ? 0 : 1;
    this.cargarPromotionsFisrtTime();
  }

  setClassHeaderOrder() {
    let clase = "";
    if (this.mPromotionsFiltro.orderDirectionGO == 1)
      clase = "assets/arrow-up.jpg";
    else
      clase = "assets/arrow-down.jpg";
    return clase;
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
    if (isNullOrUndefined(this.fecha_desde))
      this.fecha_desde = null;
    else {

      fecha_ini = this.fecha_desde.toString();

      if (fecha_ini != "[object Object]") {
        if (fecha_ini == "") {

          this.fecha_desde = null;
        } else {
          if (!this.recorrerFechaCorrecta(fecha_ini)) {
            this.fecha_desde = null;
          }
        }
      }
    }

  }

  verificarFechaRealHasta() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.fecha_hasta))
      this.fecha_hasta = null;
    else {

      fecha_ini = this.fecha_hasta.toString();

      if (fecha_ini != "[object Object]") {
        if (fecha_ini == "") {

          this.fecha_hasta = null;
        } else {
          if (!this.recorrerFechaCorrecta(fecha_ini)) {
            this.fecha_hasta = null;
          }
        }
      }
    }

  }

  asignarFechaRealDesde() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.fecha_desde))
      this.fecha_desde = null;
    else {
      fecha_ini = this.fecha_desde.toString();

      if (fecha_ini != "[object Object]") {

        if (fecha_ini == "") {

          this.fecha_desde = null;
        } else {
          if (fecha_ini.length != 10) {
            this.fecha_desde = null;
          } else {
            var var_fecha_ini = (fecha_ini.replace("/", "")).replace("/", "");
            if (!this.isInteger(var_fecha_ini) || var_fecha_ini.length != 8) {
              this.fecha_desde = null;
            }
            else {
              if (!this.isDate(fecha_ini)) {
                this.fecha_desde = null;
              }
              else {

                var arrayFechaDesde = (this.fecha_desde.toString()).split("/");

                var objFechaDesde = new Fechas();
                objFechaDesde.year = Number.parseInt(arrayFechaDesde[2]);
                objFechaDesde.month = Number.parseInt(arrayFechaDesde[1]);
                objFechaDesde.day = Number.parseInt(arrayFechaDesde[0]);

                this.fecha_desde = objFechaDesde;



              }
            }
          }
        }
      }
    }
  }

  asignarFechaRealHasta() {

    var fecha_ini = "";
    if (isNullOrUndefined(this.fecha_hasta))
      this.fecha_hasta = null;
    else {
      fecha_ini = this.fecha_hasta.toString();

      if (fecha_ini != "[object Object]") {

        if (fecha_ini == "") {

          this.fecha_hasta = null;
        } else {
          if (fecha_ini.length != 10) {
            this.fecha_hasta = null;
          } else {
            var var_fecha_ini = (fecha_ini.replace("/", "")).replace("/", "");
            if (!this.isInteger(var_fecha_ini) || var_fecha_ini.length != 8) {
              this.fecha_hasta = null;
            }
            else {
              if (!this.isDate(fecha_ini)) {
                this.fecha_hasta = null;
              }
              else {

                var arrayFechaHasta = (this.fecha_hasta.toString()).split("/");

                var objFechaHasta = new Fechas();
                objFechaHasta.year = Number.parseInt(arrayFechaHasta[2]);
                objFechaHasta.month = Number.parseInt(arrayFechaHasta[1]);
                objFechaHasta.day = Number.parseInt(arrayFechaHasta[0]);

                this.fecha_hasta = objFechaHasta;



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


