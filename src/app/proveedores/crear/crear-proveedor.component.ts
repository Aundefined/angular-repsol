import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RequestProvinciasByIdEmpresa, RequestPaisesByIdEmpresa, RequestProveedor, ResponseProveedor, Proveedor, RequestCaracterizacionByIdTipo, ResponseCaracterizacion, TiposCaracterizacion, RequestTiposCaracterizacionByTipo, CaracterizacionProveedores, RequestValidarCodigoSap, ResponseListaCodigosProveedor, CodigoProveedor, RequestFacturador, RequestHacienda, ResponseTiposCaracterizacion, ResponseClasificacion } from '../../_models/index';
import { ProvinciasService, PaisesService, ProveedorService, ClasificacionService, TiposCaracterizacionService, CaracterizacionesService } from '../../_services/index';
import { ProveedoresViewModel } from '../../_models/viewModels/proveedores/proveedoresViewModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNull, isNullOrUndefined } from 'util';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-crear-proveedor',
    templateUrl: './crear-proveedor.component.html',
    styleUrls: ['./crear-proveedor.component.css']


})
export class CrearProveedorComponent implements OnInit {

    vm = new ProveedoresViewModel();

    constructor(private provinciasService: ProvinciasService, private paisesService: PaisesService,
        private proveedorService: ProveedorService, private clasificacionService: ClasificacionService,
        private tiposCaracterizacionService: TiposCaracterizacionService, private caracterizacionesService: CaracterizacionesService,
        private modalService: NgbModal, private _routeParams: ActivatedRoute, private router: Router) {

        this._routeParams.queryParams.subscribe(params => {
            if (params['id']) {
                this.vm.DatosBasicos.Id_Proveedores = parseInt(params['id']);
            }
            if (params['accion']) {
                this.vm.action = (params['accion']);
            }
        });

        this.vm.resul = "";
        this.vm.habilitarGuardar = false;
        this.vm.habilitarModificar = true;
        this.vm.habilitarSoap = true;

    }

    ngOnInit() {

        this.inicializarComponenteServices();
    }

    inicializarComponenteServices() {

        this.documentReadyInicializar();

        this.vm.loading = true;
        this.vm.habilitarModificarDetalle = false;

        if (this.vm.DatosBasicos.Id_Proveedores > 0) {


            var reqProvincias = new RequestProvinciasByIdEmpresa();
            var reqPaises = new RequestPaisesByIdEmpresa();
            var reqTiposCaracterizacion = new RequestTiposCaracterizacionByTipo();
            var reqProveedor = new RequestProveedor();
            var rspProveedor = new ResponseProveedor();
            var reqFacturador = new RequestFacturador();

            reqProvincias.Id_Empresa = 1;
            reqPaises.Id_Empresa = 1;
            reqTiposCaracterizacion.Tipo = 1
            reqTiposCaracterizacion.Id_Empresa = 1;
            reqProveedor.Proveedor = this.vm.DatosBasicos;
            reqProveedor.Proveedor.Id_Proveedores = this.vm.DatosBasicos.Id_Proveedores;
            reqProveedor.Proveedor.Id_Empresa = 1
            reqFacturador.Id_Empresa = 1;


            const allrequests = Observable.forkJoin(
                this.provinciasService.getByIdEmpresa(reqProvincias),
                this.paisesService.getByIdEmpresa(reqPaises),
                this.proveedorService.getFacturador(reqFacturador),
                this.clasificacionService.get(),
                this.tiposCaracterizacionService.get(reqTiposCaracterizacion),
                this.proveedorService.getByIdProveedor(reqProveedor)

            );
            allrequests.subscribe(latestResults => {
                this.vm.RspProvincias = latestResults[0];
                this.vm.RspPaises = latestResults[1];
                this.vm.RspFacturador = latestResults[2];
                this.vm.RspClasificacion = latestResults[3];
                this.vm.RpsTiposCaracterizacion = latestResults[4];
                rspProveedor = latestResults[5];

                if (this.vm.RspProvincias.CodigoServicio == "OK") {
                    //this.asignarSeleccionProvincias();
                    this.vm.DatosBasicos.Id_Provincia = 0;
                }
                else {
                    console.log(JSON.stringify(this.vm.RspProvincias.ListaErrores));
                }

                if (this.vm.RspPaises.CodigoServicio == "OK") {
                    this.asignarSeleccionPaises();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspPaises.ListaErrores));
                }

                if (this.vm.RspFacturador.CodigoServicio == "OK") {
                    this.asignarSeleccionIdFacturador();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspFacturador.ListaErrores));
                }
                if (this.vm.RspClasificacion.CodigoServicio == "OK") {
                    this.asignarSeleccionClasificacion();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspClasificacion.ListaErrores));
                }
                if (this.vm.RpsTiposCaracterizacion.CodigoServicio == "OK") {
                    this.inicializarListaTiposCaracterizacion();
                }
                else {
                    console.log(JSON.stringify(this.vm.RpsTiposCaracterizacion.ListaErrores));
                }

                if (rspProveedor.CodigoServicio == "OK") {
                    this.vm.DatosBasicos = rspProveedor.Proveedor;
                    this.vm.DatosBasicos.Falta_str = isNull(this.vm.DatosBasicos.Falta_str) ? "" : this.vm.DatosBasicos.Falta_str.substring(0, 10);
                    this.vm.DatosBasicos.Fbaja_str = isNull(this.vm.DatosBasicos.Fbaja_str) ? "" : this.vm.DatosBasicos.Fbaja_str.substring(0, 10);
                    this.vm.DatosBasicos.Fini_Acuerdo_str = isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) ? "" : this.vm.DatosBasicos.Fini_Acuerdo_str.substring(0, 10);
                    this.vm.DatosBasicos.Ffin_Acuerdo_str = isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) ? "" : this.vm.DatosBasicos.Ffin_Acuerdo_str.substring(0, 10);
                    this.asignarAlViewModelListaTiposCaracTerizaciones(rspProveedor.ListaCaracterizacionProveedores);
                    this.vm.ListaArticuloProveedor = rspProveedor.ListaArticuloProveedor;
                    this.validarComaPunto();

                    if (isNull(this.vm.DatosBasicos.Id_Provincia) || this.vm.DatosBasicos.Id_Provincia == 0)
                        this.asignarSeleccionProvincias();
                    if (isNull(this.vm.DatosBasicos.Clasificacion) || this.vm.DatosBasicos.Clasificacion == 0)
                        this.asignarSeleccionClasificacion();
                    if (isNull(this.vm.DatosBasicos.Id_Facturador) || this.vm.DatosBasicos.Id_Facturador == 0)
                        this.asignarSeleccionIdFacturador();

                    this.vm.loading = false;
                }
                else {
                    console.log(JSON.stringify(rspProveedor.ListaErrores));
                    this.vm.loading = false;
                }

                this.documentReadyCombo();
                this.documentReadyTable("tablaArticulo", this.vm.action);


                if (this.vm.action == "detalle") {
                    this.activarDesactivarBotones(false);
                    this.vm.habilitarModificarDetalle = true;
                }
                else
                    this.activarDesactivarBotones(true);

                this.vm.loading = false;



            },
                error => {
                    console.log(error);
                    this.documentReadyCombo();
                    this.vm.loading = false;
                });





        }
        else {
            var reqProvincias = new RequestProvinciasByIdEmpresa();
            var reqPaises = new RequestPaisesByIdEmpresa();
            var reqTiposCaracterizacion = new RequestTiposCaracterizacionByTipo();
            var reqValidarCodigoSap = new RequestValidarCodigoSap();
            var reqFacturador = new RequestFacturador();
            reqProvincias.Id_Empresa = 1;
            reqPaises.Id_Empresa = 1;
            reqTiposCaracterizacion.Tipo = 1
            reqTiposCaracterizacion.Id_Empresa = 1;
            reqValidarCodigoSap.Id_Empresa = 1;
            reqValidarCodigoSap.Codigo_Sap = "";
            reqFacturador.Id_Empresa = 1;


            const allrequests = Observable.forkJoin(
                this.provinciasService.getByIdEmpresa(reqProvincias),
                this.paisesService.getByIdEmpresa(reqPaises),
                this.proveedorService.getFacturador(reqFacturador),
                this.clasificacionService.get(),
                this.tiposCaracterizacionService.get(reqTiposCaracterizacion),
                this.proveedorService.codigoSapSugerencias(reqValidarCodigoSap)

            );
            allrequests.subscribe(latestResults => {
                this.vm.RspProvincias = latestResults[0];
                this.vm.RspPaises = latestResults[1];
                this.vm.RspFacturador = latestResults[2];
                this.vm.RspClasificacion = latestResults[3];
                this.vm.RpsTiposCaracterizacion = latestResults[4];
                this.vm.RspListaCodigosProveedor = latestResults[5];

                this.vm.DatosBasicos.Falta_str = this.fechaActual();

                if (this.vm.RspProvincias.CodigoServicio == "OK") {
                    // this.asignarSeleccionProvincias();
                    this.vm.DatosBasicos.Id_Provincia = 0;
                }
                else {
                    console.log(JSON.stringify(this.vm.RspProvincias.ListaErrores));
                }

                if (this.vm.RspPaises.CodigoServicio == "OK") {
                    this.asignarSeleccionPaises();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspPaises.ListaErrores));
                }

                if (this.vm.RspFacturador.CodigoServicio == "OK") {
                    this.asignarSeleccionIdFacturador();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspFacturador.ListaErrores));
                }
                if (this.vm.RspClasificacion.CodigoServicio == "OK") {
                    this.asignarSeleccionClasificacion();
                }
                else {
                    console.log(JSON.stringify(this.vm.RspClasificacion.ListaErrores));
                }
                if (this.vm.RpsTiposCaracterizacion.CodigoServicio == "OK") {
                    this.inicializarListaTiposCaracterizacion();
                }
                else {
                    console.log(JSON.stringify(this.vm.RpsTiposCaracterizacion.ListaErrores));
                }

                this.documentReadyCombo();
                this.documentReadyTable("tablaCaracteristica", this.vm.action);

                this.vm.loading = false;

            },
                error => {
                    console.log(error);
                    this.documentReadyCombo();
                    this.vm.loading = false;
                });

            this.activarDesactivarBotones(true);

        }
    }

    documentReadyInicializar() {

        let vmJquery = this;
        $(document).ready(function () {

            $(".rps-datepicker .rps-calendar").datepicker("destroy");
            $(".rps-datepicker .rps-calendar").datepicker({
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                showOn: "button",
                buttonText: "",
                dateFormat: 'dd/mm/yy',
                monthNamesShort: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                onSelect: function () {
                    $(".rps-datepicker button").removeClass("active");
                    var obj = this;
                    var name = this.id.toString().substring(0, this.id.length - 1);
                    var i = this.id.toString().substring(this.id.length - 1, this.id.length);
                    var fechaAlta = $("#falta").val();
                    var fechaBaja = $("#fbaja").val();
                    if (this.id == "falta") {
                        $(".errorFechaAlta").css("display", "none");
                        $("#falta").removeClass("error-validate-fecha");
                    }
                    else if (this.id == "fbaja") {
                        $(".errorFechaBaja").css("display", "none");
                        $("#fbaja").removeClass("error-validate-fecha");
                    }
                    else if (this.id == "fini_Acuerdo") {
                        $(".errorFechaIniAcuerdo").css("display", "none");
                        $("#fini_Acuerdo").removeClass("error-validate-fecha");
                    }
                    else if (this.id == "ffin_Acuerdo") {
                        $(".errorFechaFinAcuerdo").css("display", "none");
                        $("#ffin_Acuerdo").removeClass("error-validate-fecha");
                    }

                }
            });



            $('.input-limit').keypress(function (event) {
                var max = $(this).attr('maxlength');
                var len = $(this).val().length;

                if (event.which < 0x20) {
                    // e.which < 0x20, then it's not a printable character
                    // e.which === 0 - Not a character
                    return; // Do nothing
                }

                if (len >= max) {
                    event.preventDefault();
                }

            });

            $('.input-limit').keyup(function (event) {
                var max = $(this).attr('maxlength');
                var len = $(this).val().length;
                var char = max - len;

                $('#cuenta').text('Le quedan ' + char + ' caracteres');

            });

            // $('input[type=number]').keydown(function (e) {

            //     if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            //         // Ctrl+A
            //         (e.keyCode == 65 && e.ctrlKey === true) ||
            //         // Ctrl+C
            //         (e.keyCode == 67 && e.ctrlKey === true) ||
            //         // Ctrl+X
            //         (e.keyCode == 88 && e.ctrlKey === true) ||
            //         e.keyCode == 110 ||  e.keyCode == 188 || e.keyCode == 190 ||
            //         // home, end, left, right
            //         (e.keyCode >= 35 && e.keyCode <= 39)) {
            //         return;
            //     }
            //     //Previene cuando no es un número
            //     if ((e.shiftKey ||
            //         (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
            //         && (e.keyCode < 96 || e.keyCode > 105))     // sea del 0 al 9
            //     {
            //         e.preventDefault();
            //     }

            // });

            $('input.rps-calendar').keydown(function (e) {

                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                    // Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||

                    (e.shiftKey && (e.keyCode == 55 || e.keyCode == 16)) ||
                    e.keyCode == 111 ||

                    // home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                //Previene cuando no es un número
                if ((e.shiftKey ||
                    (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                    && (e.keyCode < 96 || e.keyCode > 105))      // sea del 0 al 9
                {
                    e.preventDefault();
                }

            });

            $('input.clsNumerico').keydown(function (e) {

                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                    // Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||

                    (e.keyCode == 55 && e.keyCode == 16) ||
                    // home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                //Previene cuando no es un número
                if ((e.shiftKey ||
                    (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                    && (e.keyCode < 96 || e.keyCode > 105))      // sea del 0 al 9
                {
                    e.preventDefault();
                }

            });

            $('input.clsDecimal').keydown(function (e) {

                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                    // Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||

                    (e.keyCode == 55 && e.keyCode == 16) ||
                    e.keyCode == 110 || e.keyCode == 188 || e.keyCode == 190 ||
                    // home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                //Previene cuando no es un número
                if ((e.shiftKey ||
                    (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                    && (e.keyCode < 96 || e.keyCode > 105))      // sea del 0 al 9
                {
                    e.preventDefault();
                }

            });

            $("#acuerdo_Comercial").on("blur", function () {

                var valor = this.value;
                var valorNumber = this.valueAsNumber;
                var validationMessage = this.validationMessage;

                if (validationMessage == "Debes introducir un número.") {
                    // valor = ".0";
                    vmJquery.vm.validarFormatoAcuerdoComercial = false;
                    vmJquery.vm.validarAcuerdoComercial = true;
                    vmJquery.vm.validarEstadoAcuerdoComercial = true;
                    $("#acuerdo_Comercial").addClass("error-validate");
                    $("#validarFormatoAcuerdoComercial1").css("display", "block");
                    $("#validarFormatoAcuerdoComercial2").css("display", "block");
                } else {
                    if (vmJquery.vm.habilitarModificar)
                        vmJquery.validarAcuerdoComercial();

                    if (valor == "") {
                        $("#acuerdo_Comercial").removeClass("error-validate");
                        $("#acuerdo_Comercial").removeClass("input-valido");
                        $("#validarFormatoAcuerdoComercial1").css("display", "none");
                        $("#validarFormatoAcuerdoComercial2").css("display", "none");
                        $("#validarFormAcuerCom1").css("display", "none");
                        $("#validarFormAcuerCom2").css("display", "none");

                    }
                }
            });

            $("#importe_Fijo").on("blur", function () {

                var valor = this.value;
                var valorNumber = this.valueAsNumber;
                var validationMessage = this.validationMessage;

                if (validationMessage == "Debes introducir un número.") {
                    // valor = ".0";
                    vmJquery.vm.validarFormatoImporteFijo = false;
                    vmJquery.vm.validarImporteFijo = true;
                    vmJquery.vm.validarEstadoImporteFijo = true;
                    $("#importe_Fijo").addClass("error-validate");
                    $("#validarFormatoImporteFijo1").css("display", "block");
                    $("#validarFormatoImporteFijo2").css("display", "block");
                } else {
                    if (vmJquery.vm.habilitarModificar)
                        vmJquery.validarImporteFijo();

                    if (valor == "") {
                        $("#importe_Fijo").removeClass("error-validate");
                        $("#importe_Fijo").removeClass("input-valido");
                        $("#validarFormatoImporteFijo1").css("display", "none");
                        $("#validarFormatoImporteFijo2").css("display", "none");
                        $("#validarImpFij1").css("display", "none");
                        $("#validarImpFij2").css("display", "none");

                    }
                }
            });

        });

    }

    validarComaPunto() {
        if (isNull(this.vm.DatosBasicos.Acuerdo_Comercial) || this.vm.DatosBasicos.Acuerdo_Comercial.toString() == "") {
            this.vm.DatosBasicos.Acuerdo_Comercial = null;
        }
        // else {
        //     this.vm.DatosBasicos.Acuerdo_Comercial = this.vm.DatosBasicos.Acuerdo_Comercial.toString().replace(".", ",");
        // }

        if (isNull(this.vm.DatosBasicos.Importe_Fijo) || this.vm.DatosBasicos.Importe_Fijo.toString() == "") {
            this.vm.DatosBasicos.Importe_Fijo = null;
        }
        //  else {
        //     this.vm.DatosBasicos.Importe_Fijo = this.vm.DatosBasicos.Importe_Fijo.toString().replace(".", ",");
        // }
    }

    validarCodigoSap() {

        if (!isNull(this.vm.DatosBasicos.Codigo_Sap) && this.vm.DatosBasicos.Codigo_Sap.toString() != "") {

            //this.vm.loading = true;
            var reqValidarCodigoSap = new RequestValidarCodigoSap();
            reqValidarCodigoSap.Codigo_Sap = this.vm.DatosBasicos.Codigo_Sap;
            reqValidarCodigoSap.Id_Empresa = 1;


            this.proveedorService.ValidarCodigoSap(reqValidarCodigoSap).subscribe(
                response => {
                    this.vm.RspValidacionGenerico = response;
                    if (this.vm.RspValidacionGenerico.CodigoServicio == "OK") {

                        if (!this.vm.RspValidacionGenerico.Validacion) {
                            this.vm.validarCodigoSap = true;
                            this.vm.validarCodigoSapFinal = false;
                            this.vm.validarEstadoCodigoSap = true;
                            //$("#codigo_Sap").focus();
                        }
                        else {
                            this.vm.validarCodigoSap = true;
                            this.vm.validarCodigoSapFinal = true;
                            this.vm.validarEstadoCodigoSap = false;
                        }
                        //this.vm.loading = false;

                    } else {
                        this.vm.validarCodigoSap = true;
                        this.vm.validarCodigoSapFinal = false;
                        this.vm.validarEstadoCodigoSap = true;
                        console.log(JSON.stringify(this.vm.RspValidacionGenerico.ListaErrores));
                        //this.vm.loading = false;

                    }
                });

        } else {

            this.vm.validarCodigoSap = false;
            this.vm.validarCodigoSapFinal = true;
            this.vm.validarEstadoCodigoSap = true;


        }

        return this.vm.validarCodigoSap && this.vm.validarCodigoSapFinal;
    }

    fechaActual() {
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

        this.vm.fechaPlaceholder = "XX/XX/" + annio;

        return dia + "/" + mes + "/" + annio;
    }

    searchSugerencia(e) {
        this.vm.hideSugerencias = false;
        var buscarSugerencia: any = e.target.value;
        clearTimeout(this.vm.timer.search.id);
        this.vm.timer.search.id = setTimeout(() => {
            this.vm.ListaCodigosProveedor = this.filtrarPorNombre(buscarSugerencia).splice(0, 8);
        }, this.vm.timer.search.ms);
    };


    filtrarPorNombre(obj) {
        var listaCodigoProveedor: CodigoProveedor[];
        listaCodigoProveedor = [];
        this.vm.ListaCodigosProveedor = this.vm.RspListaCodigosProveedor.ListaCodigosProveedor.filter((el) => {
            return el.Codigo_Proveer.includes(obj.toLocaleUpperCase());
        });

        for (let index = 0; index < this.vm.ListaCodigosProveedor.length; index++) {
            const element = this.vm.ListaCodigosProveedor[index];
            if (index < 5) {
                var codigoProveedor = new CodigoProveedor();
                codigoProveedor.Codigo_Proveer = element.Codigo_Proveer;
                codigoProveedor.Id_Codigo_Proveedor = element.Id_Codigo_Proveedor;
                codigoProveedor.Id_Empresa = element.Id_Empresa;
                codigoProveedor.Id_Proveedores = element.Id_Proveedores;
                codigoProveedor.Id_Sistema = element.Id_Sistema;
                listaCodigoProveedor.push(codigoProveedor);
            }
        }

        this.vm.ListaCodigosProveedor = [];
        this.vm.ListaCodigosProveedor = listaCodigoProveedor;

        return this.vm.ListaCodigosProveedor;
    }


    confirmSearch(inputBusqueda, busqueda) {
        this.vm.DatosBasicos.Codigo_Sap = busqueda;
        this.validarCodigoSap();
        this.vm.hideSugerencias = true;
    }
    hideResults(buscar) {
        clearTimeout(this.vm.timer.result.id);
        this.vm.timer.result.id = setTimeout(() => {
            this.vm.hideSugerencias = true;
        }, this.vm.timer.result.ms);

    }


    activarDesactivarBotones(estado: boolean) {

        if (estado) {
            this.vm.habilitarGuardar = false;
            this.vm.habilitarModificar = true;

            $("#provincia").removeAttr('disabled');
            var objDiv = $("#provincia").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#pais").removeAttr('disabled');
            var objDiv = $("#pais").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#clasificacion").removeAttr('disabled');
            var objDiv = $("#clasificacion").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#id_Facturador").removeAttr('disabled');
            var objDiv = $("#id_Facturador").siblings("div");
            $(objDiv).removeClass("disabled");

            if (this.vm.DatosBasicos.Id_Proveedores > 0) {

                $("#clasificacion").attr('disabled', 'disabled');
                var objDiv = $("#clasificacion").siblings("div");
                $(objDiv).addClass("disabled");
                $(objDiv).css("background-color", "#e5e3df");

                this.vm.habilitarSoap = false;
            }



        }
        else {
            this.vm.habilitarGuardar = true;
            this.vm.habilitarModificar = false;
            this.vm.habilitarSoap = false;

            this.reactivarColorDatosCaraterizacion(false);

            // this.vm.validarCodigoPostal = true;

            var objFalta = $("#falta").siblings("button");
            var objFbaja = $("#fbaja").siblings("button");
            var objFiniAcuer = $("#fini_Acuerdo").siblings("button");
            var objFfinAcuer = $("#ffin_Acuerdo").siblings("button");
            objFalta.attr("disabled", "disabled");
            objFbaja.attr("disabled", "disabled");
            objFiniAcuer.attr("disabled", "disabled");
            objFfinAcuer.attr("disabled", "disabled");

            $("#provincia").attr('disabled', 'disabled');
            var objDiv = $("#provincia").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#pais").attr('disabled', 'disabled');
            var objDiv = $("#pais").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#clasificacion").attr('disabled', 'disabled');
            var objDiv = $("#clasificacion").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#id_Facturador").attr('disabled', 'disabled');
            var objDiv = $("#id_Facturador").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");



        }
    }

    reactivarColorDatosCaraterizacion(estado: boolean) {

        var idTemporal2 = 0;

        for (let i = 0; i < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

            if (element.ID != idTemporal2)
                element.COLOR = estado ? '#e67600' : '#5C4E44';
            else {
                if (i % 2)
                    element.COLOR = "transparent";
                else
                    element.COLOR = "transparent";
            }
            idTemporal2 = element.ID;
        }

    }

    habilitarControles() {
        this.vm.habilitarGuardar = false;
        this.vm.habilitarModificar = true;

        this.reactivarColorDatosCaraterizacion(true);

        var objFalta = $("#falta").siblings("button");
        var objFbaja = $("#fbaja").siblings("button");
        var objFiniAcuer = $("#fini_Acuerdo").siblings("button");
        var objFfinAcuer = $("#ffin_Acuerdo").siblings("button");

        $(objFalta).removeAttr('disabled');
        $(objFbaja).removeAttr('disabled');
        $(objFiniAcuer).removeAttr('disabled');
        $(objFfinAcuer).removeAttr('disabled');

        $("#provincia").removeAttr('disabled');
        var objDiv = $("#provincia").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");

        $("#pais").removeAttr('disabled');
        var objDiv = $("#pais").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");

        $("#clasificacion").removeAttr('disabled');
        var objDiv = $("#clasificacion").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");

        $("#id_Facturador").removeAttr('disabled');
        var objDiv = $("#id_Facturador").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        if (this.vm.DatosBasicos.Id_Proveedores > 0) {

            $("#clasificacion").attr('disabled', 'disabled');
            var objDiv = $("#clasificacion").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            this.vm.habilitarSoap = false;

        }

    }

    documentReadyCombo() {
        $(document).ready(function () {
            $('select').niceSelect();

            $('.clsProvincia ul li').on("click", function () {
                var value = $(this).attr('data-value');
                if (value == "0") {
                    $('.clsProvincia').css("border-color", "#E40028");
                    $('#validarProvincia span').html("El campo provincia es obligatorio");
                }
                else {
                    $('.clsProvincia').css("border-color", "#e0ded9");
                    $('#validarProvincia span').html("");
                }
            });

            $('.clsClasificacion ul li').on("click", function () {
                var value = $(this).attr('data-value');
                if (value == "0") {
                    $('.clsClasificacion').css("border-color", "#E40028");
                    $('#validarClasificacion span').html("El campo clasificación es obligatorio");
                }
                else {
                    $('.clsClasificacion').css("border-color", "#e0ded9");
                    $('#validarClasificacion span').html("");
                }
            });

            // $('.clsFacturador ul li').on("click", function () {
            //     var value = $(this).attr('data-value');
            //     if (value == "0") {
            //         $('.clsFacturador').css("border-color", "#E40028");
            //         $('#validarFacturador span').html("El campo facturador es obligatorio");
            //     }
            //     else {
            //         $('.clsFacturador').css("border-color", "#e0ded9");
            //         $('#validarFacturador span').html("");
            //     }
            // });

        });
    }
    documentReadyTable(id, accion) {
        let vmJquery = this;
        $(document).ready(function () {
            $('#' + id).DataTable({
                searching: false,
                info: false,
                pageLength: 5,
                lengthChange: false,
                paging: true,
                language: {
                    processing: "Lectura de datos en curso...",
                    paginate: {
                        previous: "&laquo;",
                        next: "&raquo;"
                    },
                    zeroRecords: "No se encontraron resultados",
                }
            });
            if (id == "tablaCaracteristica" && $("#tablaCaracteristica").DataTable().rows()[0].length > 0 && vmJquery.vm.pageTablaCaracterizaciones != undefined) {
                var tNewPaginacionCaracterizaciones = $('#tablaCaracteristica').DataTable();
                tNewPaginacionCaracterizaciones.page(vmJquery.vm.pageTablaCaracterizaciones).draw('page');
            }

            //  var obj = $("#" + id + "_paginate ul");
            //  if (obj[0].childElementCount < 4)
            //      $('.pagination').hide();


            var tam = $("#" + id).DataTable().rows()[0].length;
            if (tam <= 5) {
                $("#" + id + "_paginate").hide();
            }

            // if (id == "tablaArticulo") {
            //     var tam = $("#" + id).DataTable().rows()[0].length;

            //     if (tam <= 0) {
            //         $("#" + id + " tbody tr").each(function (index) {
            //             $(this).hide();
            //         });
            //     }

            // }

            if (accion == "detalle") {

                var objFalta = $("#falta").siblings("button");
                var objFbaja = $("#fbaja").siblings("button");
                var objFiniAcuer = $("#fini_Acuerdo").siblings("button");
                var objFfinAcuer = $("#ffin_Acuerdo").siblings("button");
                objFalta.attr("disabled", "disabled");
                objFbaja.attr("disabled", "disabled");
                objFiniAcuer.attr("disabled", "disabled");
                objFfinAcuer.attr("disabled", "disabled");

                var objDiv1 = $("#clasificacion").siblings("div");
                var objDiv2 = $("#provincia").siblings("div");
                var objDiv3 = $("#pais").siblings("div");
                var objDiv4 = $("#id_Facturador").siblings("div");
                objDiv1.css("background-color", "#e5e3df");
                objDiv2.css("background-color", "#e5e3df");
                objDiv3.css("background-color", "#e5e3df");
                objDiv4.css("background-color", "#e5e3df");
            }
            else if (accion == "editar") {
                var objDiv1 = $("#clasificacion").siblings("div");
                objDiv1.css("background-color", "#e5e3df");

            }

            // if (accion == "detalle") {
            //     $("#falta").attr("disabled", "disabled");
            //     $("#cif").attr("disabled", "disabled");
            //     $("#fbaja").attr("disabled", "disabled");
            //     $("#razon_Social").attr("disabled", "disabled");
            //     $("#direccion").attr("disabled", "disabled");
            //     $("#codigo_Postal").attr("disabled", "disabled");
            //     $("#localidad").attr("disabled", "disabled");
            //     $("#provincia").attr("disabled", "disabled");
            //     $("#pais").attr("disabled", "disabled");
            //     $("#telefono1").attr("disabled", "disabled");
            //     $("#email1").attr("disabled", "disabled");
            //     $("#telefono2").attr("disabled", "disabled");
            //     $("#email2").attr("disabled", "disabled");
            //     $("#telefono3").attr("disabled", "disabled");
            //     $("#email3").attr("disabled", "disabled");
            //     $("#preproveedor").attr("disabled", "disabled");
            //     $("#proveedor").attr("disabled", "disabled");
            //     $("#distribuidor").attr("disabled", "disabled");
            //     $("#clasificacion").attr("disabled", "disabled");
            //     $("#observaciones").attr("disabled", "disabled");
            //     $("#acuerdo_Comercial").attr("disabled", "disabled");
            //     $("#importe_Fijo").attr("disabled", "disabled");
            //     $("#fini_Acuerdo").attr("disabled", "disabled");
            //     $("#ffin_Acuerdo").attr("disabled", "disabled");
            //     $("#punto_Operacional").attr("disabled", "disabled");
            //     $("#contacto").attr("disabled", "disabled");
            //     $("#contacto2").attr("disabled", "disabled");
            //     $("#facturador").attr("disabled", "disabled");
            //     $("#id_Facturador").attr("disabled", "disabled");
            //     $("#btnAltaArticulo").attr("disabled", "disabled");
            //     $("#btnAltaArticulo").removeClass("boton-estandar");
            //     $("#btnAltaArticulo").addClass("boton-inactivo");
            //     $("#btnGuardar").attr("disabled", "disabled");
            //     $("#btnGuardar").removeClass("boton-estandar");
            //     $("#btnGuardar").addClass("boton-inactivo");

            //     $("#" + id + " tbody tr").each(function (index) {
            //         var campo1, campo2, campo3;
            //         $(this).children("td").each(function (index2) {
            //             if (index2 == 0 && id == "tablaCaracteristica") {

            //                 $(this).children("a").removeAttr("data-target");
            //                 $(this).children("a").removeAttr("data-toggle");
            //                 $(this).children("a").attr("href", "javascript:void(0)");
            //                 var color = $(this).children("a").css("color");
            //                 if (color == "rgb(230, 118, 0)")
            //                     $(this).children("a").css("color", "#5C4E44");
            //             }
            //             else {
            //                 if (index2 == 3 && id == "tablaArticulo") {
            //                     $(this).children("a").attr("href", "javascript:void(0)");
            //                     $(this).children("a").html("");
            //                 }
            //             }

            //         })
            //         // alert(campo1 + ' - ' + campo2 + ' - ' + campo3);
            //     })


            // }

        });


    }

    validarDecimal(texto: string, longitudParteEntera: number, longitudParteDecimal: number, nroMinParteEntera: number, nroMaxParteEntera: number, nroMinPartDecimal: number, nroMaxParteDecimal: number) {

        var estado = false;

        if (texto.length == 1) {
            if (this.isInteger(texto) && parseInt(texto) >= nroMinParteEntera && parseInt(texto) <= nroMaxParteEntera) estado = true;
            else estado = false;
        }
        else if (texto.length >= 2) {

            var numArray = (texto.toString()).split(".");
            var parteEntera: string;
            var parteDecimal: string;
            var primierDigito: string;

            if (numArray.length == 2) {
                parteEntera = numArray[0];
                parteDecimal = numArray[1];
                if (parteDecimal.toString() == "" || parteEntera == "") {
                    estado = false;
                    // primierDigito = parteEntera.substring(0, 1);
                    // if (this.isInteger(parteEntera) && parteEntera.length <= longitudParteEntera && parseInt(parteEntera) >= nroMinParteEntera && parseInt(parteEntera) <= nroMaxParteEntera) {
                    //     if (parteEntera.length > 1 && primierDigito != "0") estado = true;
                    //     else if (parteEntera.length == 1) estado = true;
                    //     else estado = false;
                    // }
                    // else estado = false;
                }
                else {
                    primierDigito = parteEntera.substring(0, 1);
                    if (this.isInteger(parteEntera) && this.isInteger(parteDecimal) && parteEntera.length <= longitudParteEntera && parteDecimal.length <= longitudParteDecimal && parseInt(parteEntera) >= nroMinParteEntera && parseInt(parteEntera) <= nroMaxParteEntera && parseInt(parteDecimal) >= nroMinPartDecimal && parseInt(parteDecimal) <= nroMaxParteDecimal) {
                        if (parteEntera.length > 1 && primierDigito != "0") estado = true;
                        else if (parteEntera.length == 1) estado = true;
                        else estado = false;

                    }
                    else estado = false;
                }

            }
            else {
                primierDigito = texto.substring(0, 1);
                if (this.isInteger(texto) && texto.length <= longitudParteEntera && parseInt(texto) >= nroMinParteEntera && parseInt(texto) <= nroMaxParteEntera) {
                    if (texto.length > 1 && primierDigito != "0") estado = true;
                    else if (texto.length == 1) estado = true;
                    else estado = false;

                }
                else estado = false;

            }




        }

        return estado;

    }

    validarFormatoDecimal(texto: string) {

        var estado = true;
        let regEx = new RegExp(/^[0-9]+([.][0-9]+)?$/);

        if (!regEx.test(texto))
            estado = false;

        return estado;

    }

    validarAcuerdoComercial() {

        if (!isNull(this.vm.DatosBasicos.Acuerdo_Comercial) && this.vm.DatosBasicos.Acuerdo_Comercial.toString() != "") {
            if (!this.validarFormatoDecimal(this.vm.DatosBasicos.Acuerdo_Comercial.toString())) {
                this.vm.validarFormatoAcuerdoComercial = false;
                this.vm.validarAcuerdoComercial = true;
                this.vm.validarEstadoAcuerdoComercial = true;
            }
            else {
                if (!this.validarDecimal(this.vm.DatosBasicos.Acuerdo_Comercial.toString(), 3, 2, 0, 100, 0, 99)) {
                    this.vm.validarAcuerdoComercial = false;
                    this.vm.validarFormatoAcuerdoComercial = true;
                    this.vm.validarEstadoAcuerdoComercial = true;
                    $("#acuerdo_Comercial").addClass("error-validate");
                    $("#validarFormAcuerCom1").css("display", "block");
                    $("#validarFormAcuerCom2").css("display", "block");
                    $("#validarFormatoAcuerdoComercial1").css("display", "none");
                    $("#validarFormatoAcuerdoComercial2").css("display", "none");
                }
                else {
                    this.vm.validarAcuerdoComercial = true;
                    this.vm.validarFormatoAcuerdoComercial = true;
                    this.vm.validarEstadoAcuerdoComercial = false;
                    $("#acuerdo_Comercial").removeClass("error-validate");
                    $("#acuerdo_Comercial").addClass("input-valido");
                    $("#validarFormatoAcuerdoComercial1").css("display", "none");
                    $("#validarFormatoAcuerdoComercial2").css("display", "none");
                    $("#validarFormAcuerCom1").css("display", "none");
                    $("#validarFormAcuerCom2").css("display", "none");
                }
            }
        } else {
            this.vm.validarAcuerdoComercial = true;
            this.vm.validarFormatoAcuerdoComercial = true;
            this.vm.DatosBasicos.Acuerdo_Comercial = null;
            this.vm.validarEstadoAcuerdoComercial = true;
        }
        return this.vm.validarAcuerdoComercial && this.vm.validarFormatoAcuerdoComercial;
    }

    validarImporteFijo() {

        if (!isNull(this.vm.DatosBasicos.Importe_Fijo) && this.vm.DatosBasicos.Importe_Fijo.toString() != "") {
            if (!this.validarFormatoDecimal(this.vm.DatosBasicos.Importe_Fijo.toString())) {
                this.vm.validarFormatoImporteFijo = false;
                this.vm.validarImporteFijo = true;
                this.vm.validarEstadoImporteFijo = true;
            }
            else {
                if (!this.validarDecimal(this.vm.DatosBasicos.Importe_Fijo.toString(), 9, 2, 0, 999999999, 0, 99)) {
                    this.vm.validarImporteFijo = false;
                    this.vm.validarFormatoImporteFijo = true;
                    this.vm.validarEstadoImporteFijo = true;
                    $("#importe_Fijo").addClass("error-validate");
                    $("#validarImpFij1").css("display", "block");
                    $("#validarImpFij2").css("display", "block");
                    $("#validarFormatoImporteFijo1").css("display", "none");
                    $("#validarFormatoImporteFijo2").css("display", "none");
                }
                else {
                    this.vm.validarImporteFijo = true;
                    this.vm.validarFormatoImporteFijo = true;
                    this.vm.validarEstadoImporteFijo = false;
                    $("#importe_Fijo").removeClass("error-validate");
                    $("#importe_Fijo").addClass("input-valido");
                    $("#validarFormatoImporteFijo1").css("display", "none");
                    $("#validarFormatoImporteFijo2").css("display", "none");
                    $("#validarImpFij1").css("display", "none");
                    $("#validarImpFij2").css("display", "none");
                }
            }
        } else {
            this.vm.validarImporteFijo = true;
            this.vm.validarFormatoImporteFijo = true;
            this.vm.DatosBasicos.Importe_Fijo = null;
            this.vm.validarEstadoImporteFijo = true;
        }

        return this.vm.validarImporteFijo && this.vm.validarFormatoImporteFijo;
    }

    validarFormatoNumerico(texto: string) {

        var estado = true;
        let regEx = new RegExp(/[0-9]+/);

        if (!regEx.test(texto))
            estado = false;

        return estado;
    }

    validarFormatoNumerico5Digitos(texto: string) {

        var estado = true;
        let regEx = new RegExp(/(\d{5})/);

        if (!regEx.test(texto))
            estado = false;

        return estado;
    }

    validarCodigoPostal() {

        if (!isNull(this.vm.DatosBasicos.Codigo_Postal) && this.vm.DatosBasicos.Codigo_Postal.toString() != "") {

            if (!this.validarFormatoNumerico5Digitos(this.vm.DatosBasicos.Codigo_Postal)) {
                this.vm.validarCodigoPostal = true;
                this.vm.validarFormatoCodigoPostal = false;
                this.vm.validarCodigoPostalFinal = true;
                this.vm.validarEstadoCodigoPostal = false;
            } else {

                if (parseInt(this.vm.DatosBasicos.Codigo_Postal) < 1000 || parseInt(this.vm.DatosBasicos.Codigo_Postal) > 52999) {
                    this.vm.validarCodigoPostal = true;
                    this.vm.validarFormatoCodigoPostal = true;
                    this.vm.validarCodigoPostalFinal = false;
                    this.vm.validarEstadoCodigoPostal = false;
                }
                else {
                    this.vm.validarCodigoPostal = true;
                    this.vm.validarFormatoCodigoPostal = true;
                    this.vm.validarCodigoPostalFinal = true;
                    this.vm.validarEstadoCodigoPostal = false;
                }
            }
        }
        else {
            this.vm.validarCodigoPostal = false;
            this.vm.validarFormatoCodigoPostal = true;
            this.vm.validarCodigoPostalFinal = true;
            this.vm.validarEstadoCodigoPostal = true;

        }
        return this.vm.validarCodigoPostal && this.vm.validarFormatoCodigoPostal && this.vm.validarCodigoPostalFinal;


    }

    seleccionarProvincia() {

        var reqProvincias = new RequestProvinciasByIdEmpresa();
        reqProvincias.Id_Empresa = 1;

        var tam = this.vm.DatosBasicos.Codigo_Postal.length;
        var texto = this.vm.DatosBasicos.Codigo_Postal;
        if (tam == 5 && this.isInteger(texto)) {
            var codigo = texto.substring(0, 2);
            var idSeleccion = 0;
            var nombre = "";
            for (let index = 0; index < this.vm.RspProvincias.ListaProvincias.length; index++) {
                const element = this.vm.RspProvincias.ListaProvincias[index];
                if (element.Codigo_Postal == codigo && element.Id_Empresa == reqProvincias.Id_Empresa) {
                    idSeleccion = element.Id;
                    nombre = element.Nombre;
                    break
                }
            }
            this.vm.DatosBasicos.Id_Provincia = idSeleccion;
            var objDiv = $("#provincia").siblings("div");
            //alert(obj.html());
            var objUl = objDiv.children("ul");
            var objSpan = objDiv.children("span");

            for (let index = 0; index < objUl[0].children.length; index++) {
                const element = objUl[0].children[index];
                var value = $(element).attr('data-value');
                $(element).removeClass("selected");
                $(element).removeClass("focus");
                if (value == idSeleccion) {
                    $(element).addClass("selected");
                    $(element).addClass("focus");
                    objSpan[0].innerText = nombre;
                    break;
                } else {
                    $(element).removeClass("selected");
                    $(element).removeClass("focus");

                }
            }

            if (this.vm.DatosBasicos.Id_Provincia == 0) {

                var objDiv = $("#provincia").siblings("div");
                var objUl = objDiv.children("ul");
                var objSpan = objDiv.children("span")
                for (let index = 0; index < objUl[0].children.length; index++) {
                    const element = objUl[0].children[index];
                    var value = $(element).attr('data-value');
                    $(element).removeClass("selected");
                    $(element).removeClass("focus");
                    if (value == 0) {
                        $(element).addClass("selected");
                        $(element).addClass("focus");
                        objSpan[0].innerText = "--Seleccionar--";
                        break;
                    }
                }

                $('.clsProvincia').css("border-color", "#E40028");
                $('#validarProvincia span').html("El campo provincia es obligatorio");
            }
            else {
                $('.clsProvincia').css("border-color", "#e0ded9");
                $('#validarProvincia span').html("");
            }
        }
    }

    seleccionarProvinciaRepsol() {

        /* var id = "0";
         var objDiv = $("#provincia").siblings("div");
         var objUl = objDiv.children("ul");
         for (let index = 0; index < objUl[0].children.length; index++) {
             const element = objUl[0].children[index];
             var value = $(element).attr('data-value');
             if ($(element).hasClass("selected"))
                 id = value;
         }
 
         this.vm.DatosBasicos.Id_Provincia = parseInt(id);      
 */
        this.vm.DatosBasicos.Id_Provincia = $("#provincia").val() == null ? null : parseInt(($("#provincia").val()).toString());


    }

    seleccionarPaisRepsol() {

        /*
        var id = "0";
        var objDiv = $("#pais").siblings("div");
        var objUl = objDiv.children("ul");
        for (let index = 0; index < objUl[0].children.length; index++) {
            const element = objUl[0].children[index];
            var value = $(element).attr('data-value');
            if ($(element).hasClass("selected"))
                id = value;
        }

        this.vm.DatosBasicos.Id_Pais = parseInt(id);
        */

        this.vm.DatosBasicos.Id_Pais = $("#pais").val() == null ? null : parseInt(($("#pais").val()).toString());

    }

    seleccionarClasificacionRepsol() {

        /*
        var id = "0";
        var objDiv = $("#clasificacion").siblings("div");
        var objUl = objDiv.children("ul");
        for (let index = 0; index < objUl[0].children.length; index++) {
            const element = objUl[0].children[index];
            var value = $(element).attr('data-value');
            if ($(element).hasClass("selected"))
                id = value;
        }

        this.vm.DatosBasicos.Id_Pais = parseInt(id);
        */

        this.vm.DatosBasicos.Clasificacion = $("#clasificacion").val() == null ? null : parseInt(($("#clasificacion").val()).toString());

    }

    seleccionarIdFacturadorRepsol() {

        var id = "0";

        if ($("#facturador").is(':checked')) {
            this.vm.DatosBasicos.Id_Facturador = null;
        }
        else {
            /*
            var objDiv = $("#id_Facturador").siblings("div");
            var objUl = objDiv.children("ul");
            for (let index = 0; index < objUl[0].children.length; index++) {
                const element = objUl[0].children[index];
                var value = $(element).attr('data-value');
                if ($(element).hasClass("selected"))
                    id = value;
            }

            this.vm.DatosBasicos.Id_Facturador = parseInt(id);
            */

            this.vm.DatosBasicos.Id_Facturador = $("#id_Facturador").val() == null ? null : parseInt(($("#id_Facturador").val()).toString());

        }

    }

    verificarFechas() {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();
        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();
        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();
        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();

        this.vm.DatosBasicos.Falta_str = this.vm.DatosBasicos.Falta_str == "" ? null : this.vm.DatosBasicos.Falta_str;
        this.vm.DatosBasicos.Fbaja_str = this.vm.DatosBasicos.Fbaja_str == "" ? null : this.vm.DatosBasicos.Fbaja_str;
        this.vm.DatosBasicos.Fini_Acuerdo_str = this.vm.DatosBasicos.Fini_Acuerdo_str == "" ? null : this.vm.DatosBasicos.Fini_Acuerdo_str;
        this.vm.DatosBasicos.Ffin_Acuerdo_str = this.vm.DatosBasicos.Ffin_Acuerdo_str == "" ? null : this.vm.DatosBasicos.Ffin_Acuerdo_str;

    }


    isInteger(s) {
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (((c < "0") || (c > "9"))) return false;
        }
        return true;
    }

    validarSelecFacturador() {
        if ($("#facturador").is(':checked')) {
            this.vm.DatosBasicos.Id_Facturador = null;
            $("#id_Facturador").attr('disabled', 'disabled');
            var objDiv = $("#id_Facturador").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $('.clsFacturador').css("border-color", "#e0ded9");
            $('#validarFacturador span').html("");

        } else {
            this.vm.DatosBasicos.Id_Facturador = 0;
            $("#id_Facturador").removeAttr('disabled');
            this.asignarSeleccionIdFacturador();
            var obj_Div = $("#id_Facturador").siblings("div");
            $(obj_Div).removeClass("disabled");

            var objDiv = $("#id_Facturador").siblings("div");
            $(objDiv).css("background-color", "#ffffff");
            //alert(obj.html());
            var objUl = objDiv.children("ul");
            var objSpan = objDiv.children("span");

            for (let index = 0; index < objUl[0].children.length; index++) {
                const element = objUl[0].children[index];
                var value = $(element).attr('data-value');
                $(element).removeClass("selected");
                $(element).removeClass("focus");
                if (value == 0) {
                    $(element).addClass("selected");
                    $(element).addClass("focus");
                    objSpan[0].innerText = "--Seleccionar--";
                } else {
                    $(element).removeClass("selected");
                    $(element).removeClass("focus");
                }


            }
        }
    }

    asignarSeleccionProvincias() {
        var id = 0;
        for (let index = 0; index < this.vm.RspProvincias.ListaProvincias.length; index++) {
            const element = this.vm.RspProvincias.ListaProvincias[index];
            id = element.Id;
            break;
        }
        this.vm.DatosBasicos.Id_Provincia = 0;
    }

    asignarSeleccionPaises() {
        var id = 0;
        for (let index = 0; index < this.vm.RspPaises.ListaPaises.length; index++) {
            const element = this.vm.RspPaises.ListaPaises[index];
            id = element.Id;
            break;
        }
        this.vm.DatosBasicos.Id_Pais = id;
    }

    asignarSeleccionIdFacturador() {
        var id = 0;
        for (let index = 0; index < this.vm.RspFacturador.ListaProveedores.length; index++) {
            const element = this.vm.RspFacturador.ListaProveedores[index];
            id = element.Id_Facturador;
            break;
        }
        this.vm.DatosBasicos.Id_Facturador = 0;
    }
    asignarSeleccionClasificacion() {
        var id = 0;
        for (let index = 0; index < this.vm.RspClasificacion.ListaClasificacion.length; index++) {
            const element = this.vm.RspClasificacion.ListaClasificacion[index];
            id = element.Id_Clasificacion;
            break;
        }
        this.vm.DatosBasicos.Clasificacion = 0;
    }

    inicializarListaTiposCaracterizacion() {

        for (let index = 0; index < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            element.ID_CARACTERISTICA = -1;
        }
    }

    obtenerNombreTipoCaracterizacion(id: number) {

        var nombre = "";

        for (let index = 0; index < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            if (element.ID == id) {
                nombre = element.NOMBRE;
                break;
            }

        }

        return nombre;

    }

    mostrarCaracterizaciones(id: number) {

        $("#btnAsignarCaract").attr("data-ng-value", id.toString());
        var nombre = "";
        var reqCaracterizacion = new RequestCaracterizacionByIdTipo();
        nombre = this.obtenerNombreTipoCaracterizacion(id);
        this.vm.nombreTipCaract = nombre;
        reqCaracterizacion.IdTipo = id;
        reqCaracterizacion.Id_Empresa = 1;
        this.vm.RpsCaracterizacion.ListaCaracterizaciones = [];


        this.vm.loading = true;
        this.caracterizacionesService.get(reqCaracterizacion).subscribe(
            response => {
                this.vm.RpsCaracterizacion = response;
                if (this.vm.RpsCaracterizacion.CodigoServicio == "OK") {

                    for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                        const element = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
                        if (this.existeElementSelecTiposCaract(element.ID)) {
                            element.SELECTED = true;
                        }
                        else element.SELECTED = false;

                    }
                    this.verificarSelCaract();
                    this.vm.loading = false;
                }
                else {
                    console.log(JSON.stringify(this.vm.RpsCaracterizacion.ListaErrores));
                    this.vm.loading = false;
                }
            }
        );
    }

    verificarSelCaract() {

        var estado = false;
        var cantSel = 0;
        var cant = 0;
        cant = this.vm.RpsCaracterizacion.ListaCaracterizaciones.length;

        for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
            if (element.SELECTED) {
                cantSel = cantSel + 1;
            }
        }

        if (cant == cantSel) estado = true;

        if (estado) {
            this.vm.RpsCaracterizacion.Selected = true;
        }
        else {
            this.vm.RpsCaracterizacion.Selected = false;
        }
    }

    selAllCaracterizacion() {

        var estado = false;

        if (this.vm.RpsCaracterizacion.Selected)
            estado = true;

        for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
            element.SELECTED = estado;
        }
    }

    existeElementSelecCaract(id: number) {

        var estado = false;
        for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
            if (element.SELECTED && element.ID_TIPO == id) {
                estado = true;
                break;
            }
        }

        return estado;
    }

    existeElementSelecTiposCaract(id: number) {

        var estado = false;
        for (let index = 0; index < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            if (element.ID_CARACTERISTICA == id) {
                estado = true;
                break;
            }
        }

        return estado;
    }

    existeElementSelecCaractProveedor(id: number, lista: CaracterizacionProveedores[]) {

        var estado = false;
        for (let index = 0; index < lista.length; index++) {
            const element = lista[index];
            if (element.Id_Tipo == id) {
                estado = true;
                break;
            }
        }

        return estado;
    }

    agregarCaracterizaciones() {
        var tPaginacionCaracterizaciones = $('#tablaCaracteristica').DataTable();
        this.vm.pageTablaCaracterizaciones = tPaginacionCaracterizaciones.page();
        var idTipo = $("#btnAsignarCaract").attr("data-ng-value");


        var estado = false;

        for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
            if (element.SELECTED) {
                estado = true;
                break;
            }
        }

        if (!estado) {

            var ListaTiposCaracterizacion: TiposCaracterizacion[];
            ListaTiposCaracterizacion = [];

            var idAux = 0;
            var idTemp = 0;
            for (let i = 0; i < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
                const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

                if (element.ID == parseInt(idTipo)) {
                    if (element.ID != idAux) {

                        var tiposCaracterizacion = new TiposCaracterizacion();
                        tiposCaracterizacion.ID = element.ID;
                        tiposCaracterizacion.ID_EMPRESA = element.ID_EMPRESA;
                        tiposCaracterizacion.NOMBRE = element.NOMBRE;
                        if (element.ID != idAux)
                            tiposCaracterizacion.COLOR = "#e67600";
                        else {
                            if (i % 2)
                                tiposCaracterizacion.COLOR = "transparent";
                            else
                                tiposCaracterizacion.COLOR = "transparent";
                        }
                        tiposCaracterizacion.CARACTERISTICA = "";
                        tiposCaracterizacion.ID_CARACTERISTICA = -1
                        ListaTiposCaracterizacion.push(tiposCaracterizacion);

                        idAux = element.ID;
                    }

                }
                else {

                    var tiposCaracterizacion = new TiposCaracterizacion();
                    tiposCaracterizacion.ID = element.ID;
                    tiposCaracterizacion.ID_EMPRESA = element.ID_EMPRESA;
                    tiposCaracterizacion.NOMBRE = element.NOMBRE;//(element.ID != idTemp) ? element.NOMBRE : "";
                    if (element.ID != idTemp)
                        tiposCaracterizacion.COLOR = "#e67600";
                    else {
                        if (i % 2)
                            tiposCaracterizacion.COLOR = "transparent";
                        else
                            tiposCaracterizacion.COLOR = "transparent";
                    }
                    tiposCaracterizacion.CARACTERISTICA = element.CARACTERISTICA;
                    tiposCaracterizacion.ID_CARACTERISTICA = element.ID_CARACTERISTICA;
                    ListaTiposCaracterizacion.push(tiposCaracterizacion);

                    idTemp = element.ID;

                }

            }

            $('#tablaCaracteristica').DataTable().destroy();
            this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
            this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
            this.documentReadyTable("tablaCaracteristica", this.vm.action);

        }
        else {

            var ListaTiposCaracterizacion: TiposCaracterizacion[];
            ListaTiposCaracterizacion = [];

            var idTemp = 0;
            var idTemporal2 = 0;

            for (let i = 0; i < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
                const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[i];


                if (this.existeElementSelecCaract(element.ID)) {
                    if (element.ID != idTemp) {
                        var idTemporal1 = 0;
                        for (let index = 0; index < this.vm.RpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                            const elementCaract = this.vm.RpsCaracterizacion.ListaCaracterizaciones[index];
                            if (elementCaract.SELECTED && elementCaract.ID_TIPO == element.ID) {

                                var tiposCaracterizacion = new TiposCaracterizacion();
                                tiposCaracterizacion.ID = element.ID;
                                tiposCaracterizacion.ID_EMPRESA = element.ID_EMPRESA;
                                tiposCaracterizacion.NOMBRE = element.NOMBRE;//(element.ID != idTemporal1) ? element.NOMBRE : "";
                                if (element.ID != idTemporal1)
                                    tiposCaracterizacion.COLOR = "#e67600";
                                else {
                                    if (index % 2)
                                        tiposCaracterizacion.COLOR = "transparent";
                                    else
                                        tiposCaracterizacion.COLOR = "transparent";
                                }
                                tiposCaracterizacion.CARACTERISTICA = elementCaract.NOMBRE;
                                tiposCaracterizacion.ID_CARACTERISTICA = elementCaract.ID;
                                ListaTiposCaracterizacion.push(tiposCaracterizacion);
                                idTemporal1 = element.ID;
                            }
                        }
                        idTemp = element.ID;
                    }
                }
                else {
                    if (parseInt(idTipo) != element.ID) {
                        var tiposCaracterizacion = new TiposCaracterizacion();
                        tiposCaracterizacion.ID = element.ID;
                        tiposCaracterizacion.ID_EMPRESA = element.ID_EMPRESA;
                        tiposCaracterizacion.NOMBRE = element.NOMBRE;//(element.ID != idTemporal2) ? element.NOMBRE : "";
                        if (element.ID != idTemporal2)
                            tiposCaracterizacion.COLOR = "#e67600";
                        else {
                            if (i % 2)
                                tiposCaracterizacion.COLOR = "transparent";
                            else
                                tiposCaracterizacion.COLOR = "transparent";
                        }
                        tiposCaracterizacion.CARACTERISTICA = element.CARACTERISTICA;
                        tiposCaracterizacion.ID_CARACTERISTICA = element.ID_CARACTERISTICA;
                        ListaTiposCaracterizacion.push(tiposCaracterizacion);

                        idTemporal2 = element.ID;
                    }

                }




            }
            $('#tablaCaracteristica').DataTable().destroy();
            this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
            this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
            this.documentReadyTable("tablaCaracteristica", this.vm.action);

        }


    }

    obtenerListaTiposCaractAlRequest(id_Empresa: number) {

        let listaCaracterizacionProveedores: CaracterizacionProveedores[];
        listaCaracterizacionProveedores = [];

        for (let index = 0; index < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[index];

            if (element.ID_CARACTERISTICA != -1) {
                var caracterizacionProveedores = new CaracterizacionProveedores;
                caracterizacionProveedores.Id_Caracterizacion = element.ID_CARACTERISTICA;
                caracterizacionProveedores.Id_Empresa = id_Empresa;
                listaCaracterizacionProveedores.push(caracterizacionProveedores);
            }
        }

        return listaCaracterizacionProveedores;
    }

    asignarAlViewModelListaTiposCaracTerizaciones(lista: CaracterizacionProveedores[]) {

        var ListaTiposCaracterizacion: TiposCaracterizacion[];
        ListaTiposCaracterizacion = [];

        var idTemp = 0;
        var idTemporal2 = 0;

        for (let i = 0; i < this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
            const element = this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

            if (this.existeElementSelecCaractProveedor(element.ID, lista)) {
                if (element.ID != idTemp) {
                    var idTemporal1 = 0;
                    for (let index = 0; index < lista.length; index++) {
                        const entity = lista[index];
                        if (entity.Id_Tipo == element.ID) {

                            var tiposCaracterizacion = new TiposCaracterizacion();
                            tiposCaracterizacion.ID = entity.Id_Tipo;
                            tiposCaracterizacion.ID_EMPRESA = entity.Id_Empresa;
                            tiposCaracterizacion.NOMBRE = entity.Nombre;//(element.ID != idTemporal1) ? entity.Nombre : "";
                            if (entity.Id_Tipo != idTemporal1)
                                tiposCaracterizacion.COLOR = "#e67600";
                            else {
                                if (index % 2)
                                    tiposCaracterizacion.COLOR = "transparent";
                                else
                                    tiposCaracterizacion.COLOR = "transparent";
                            }
                            tiposCaracterizacion.CARACTERISTICA = entity.NombreCaracterizacion;
                            tiposCaracterizacion.ID_CARACTERISTICA = entity.Id_Caracterizacion;
                            ListaTiposCaracterizacion.push(tiposCaracterizacion);
                            idTemporal1 = entity.Id_Tipo;


                        }
                    }
                    idTemp = element.ID;
                }
            }
            else {


                var tiposCaracterizacion = new TiposCaracterizacion();
                tiposCaracterizacion.ID = element.ID;
                tiposCaracterizacion.ID_EMPRESA = element.ID_EMPRESA;
                tiposCaracterizacion.NOMBRE = element.NOMBRE;//(element.ID != idTemporal2) ? element.NOMBRE : "";
                if (element.ID != idTemporal2)
                    tiposCaracterizacion.COLOR = "#e67600";
                else {
                    if (i % 2)
                        tiposCaracterizacion.COLOR = "transparent";
                    else
                        tiposCaracterizacion.COLOR = "transparent";
                }
                tiposCaracterizacion.CARACTERISTICA = element.CARACTERISTICA;
                tiposCaracterizacion.ID_CARACTERISTICA = element.ID_CARACTERISTICA;
                ListaTiposCaracterizacion.push(tiposCaracterizacion);

                idTemporal2 = element.ID;


            }




        }
        $('#tablaCaracteristica').DataTable().destroy();
        this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
        this.vm.RpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
        this.documentReadyTable("tablaCaracteristica", this.vm.action);


    }

    mostrarAltaArticuloForm(content) {

        this.vm.resul = "";
        if (this.vm.DatosBasicos.Id_Proveedores > 0) {
            this.router.navigate(['/alta-articulos']);
        } else {
            this.vm.resul = "Debe guardar primero el proveedor antes de dar de alta sus artículos.";
            this.modalService.open(content, { centered: true, size: 'sm' });
        }

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
        var maxYear = 9999;

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

    validarFormatoCorreo(texto: string) {

        var estado = true;
        let regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

        if (!regEx.test(texto))
            estado = false;

        return estado;


    }

    validarLocalidad() {

        if (!isNull(this.vm.DatosBasicos.Localidad) && this.vm.DatosBasicos.Localidad.toString() != "") {
            this.vm.validarLocalidad = true;
            this.vm.validarEstadoLocalidad = false;
        }
        else {
            this.vm.validarLocalidad = false;
            this.vm.validarEstadoLocalidad = true;

        }
        return this.vm.validarLocalidad;

    }
    validarDireccionSocial() {

        if (!isNull(this.vm.DatosBasicos.Direccion) && this.vm.DatosBasicos.Direccion.toString() != "") {
            this.vm.validarDirSocial = true;
            this.vm.validarEstadoDirSocial = false;
        }
        else {
            this.vm.validarDirSocial = false;
            this.vm.validarEstadoDirSocial = true;

        }
        return this.vm.validarDirSocial;
    }

    validarHaciendaRazonSocial(razonSocial: string) {

        var reqHacienda = new RequestHacienda();
        reqHacienda.nif = this.vm.DatosBasicos.Cif;
        reqHacienda.nombre = razonSocial;


        this.proveedorService.validarHacienda(reqHacienda).subscribe(
            response => {
                this.vm.RspHacienda = response;
                if (this.vm.RspHacienda.CodigoServicio == "OK") {

                    if (this.vm.RspHacienda.Hacienda == 1) {
                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = false;
                        this.vm.validarEstadoRazSocial = true;

                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = false;
                        this.vm.validarEstadoCif = true;
                        // $("#codigo_Sap").focus();
                    }
                    else {
                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = true;
                        this.vm.validarEstadoRazSocial = false;

                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = true;
                        this.vm.validarEstadoCif = false;
                    }
                    //this.vm.loading = false;

                } else {
                    this.vm.validarRazSocial = true;
                    this.vm.validarRazSocialExiste = false;
                    this.vm.validarEstadoRazSocial = true;

                    this.vm.validarCif = true;
                    this.vm.validarCifExiste = false;
                    this.vm.validarEstadoCif = true;
                    console.log(JSON.stringify(this.vm.RspHacienda.ListaErrores));
                    //this.vm.loading = false;

                }
            });

        return this.vm.validarRazSocialExiste;

    }

    validarHaciendaCif(cif: string) {

        var reqHacienda = new RequestHacienda();
        reqHacienda.nif = cif;
        reqHacienda.nombre = this.vm.DatosBasicos.Razon_Social;


        this.proveedorService.validarHacienda(reqHacienda).subscribe(
            response => {
                this.vm.RspHacienda = response;
                if (this.vm.RspHacienda.CodigoServicio == "OK") {

                    if (this.vm.RspHacienda.Hacienda == 1) {
                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = false;
                        this.vm.validarEstadoCif = true;

                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = false;
                        this.vm.validarEstadoRazSocial = true;
                        //$("#codigo_Sap").focus();
                    }
                    else {
                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = true;
                        this.vm.validarEstadoCif = false;

                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = true;
                        this.vm.validarEstadoRazSocial = false;
                    }
                    //this.vm.loading = false;

                } else {
                    this.vm.validarCif = true;
                    this.vm.validarCifExiste = false;
                    this.vm.validarEstadoCif = true;

                    this.vm.validarRazSocial = true;
                    this.vm.validarRazSocialExiste = false;
                    this.vm.validarEstadoRazSocial = true;
                    console.log(JSON.stringify(this.vm.RspHacienda.ListaErrores));
                    //this.vm.loading = false;

                }
            });

        return this.vm.validarCifExiste;

    }

    validarRazonSocial() {

        if (!isNull(this.vm.DatosBasicos.Razon_Social) && this.vm.DatosBasicos.Razon_Social.toString() != "") {

            if (!this.validarHaciendaRazonSocial(this.vm.DatosBasicos.Razon_Social)) {
                this.vm.validarRazSocial = true;
                this.vm.validarRazSocialExiste = false;
                this.vm.validarEstadoRazSocial = true;

                this.vm.validarCif = true;
                this.vm.validarCifExiste = false;
                this.vm.validarEstadoCif = true;

            }
            // else {
            //     this.vm.validarRazSocial = true;
            //     this.vm.validarRazSocialExiste = true;
            //     this.vm.validarEstadoRazSocial = false;
            // }
        }
        else {
            this.vm.validarRazSocial = false;
            this.vm.validarRazSocialExiste = true;
            this.vm.validarEstadoRazSocial = true;

        }
        return this.vm.validarRazSocial && this.vm.validarRazSocialExiste;
    }

    validarCif() {

        if (!isNull(this.vm.DatosBasicos.Cif) && this.vm.DatosBasicos.Cif.toString() != "") {
            if (!this.validarHaciendaCif(this.vm.DatosBasicos.Cif)) {
                this.vm.validarCif = true;
                this.vm.validarCifExiste = false;
                this.vm.validarEstadoCif = true;

                this.vm.validarRazSocial = true;
                this.vm.validarRazSocialExiste = false;
                this.vm.validarEstadoRazSocial = true;
                //$("cif").focus();               
            }
            // else {
            //     this.vm.validarCif = true;
            //     this.vm.validarCifExiste = true;
            //     this.vm.validarEstadoCif = false;
            // }
        }
        else {
            this.vm.validarCif = false;
            this.vm.validarCifExiste = true;
            this.vm.validarEstadoCif = true;
            //$("cif").focus(); 
        }
        return this.vm.validarCif;
    }


    validarCorreo1() {

        if (!isNull(this.vm.DatosBasicos.Email1) && this.vm.DatosBasicos.Email1.toString() != "") {

            if (!this.validarFormatoCorreo(this.vm.DatosBasicos.Email1)) {
                this.vm.validarFormatoCorreo1 = false;
                this.vm.validarEstadoCorreo1 = true;
            }
            else {
                this.vm.validarFormatoCorreo1 = true;
                this.vm.validarEstadoCorreo1 = false;
            }
        }
        else {
            this.vm.validarFormatoCorreo1 = true;
            this.vm.validarEstadoCorreo1 = true;

        }
        return this.vm.validarFormatoCorreo1;

    }

    validarCorreo2() {

        if (!isNull(this.vm.DatosBasicos.Email2) && this.vm.DatosBasicos.Email2.toString() != "") {

            if (!this.validarFormatoCorreo(this.vm.DatosBasicos.Email2)) {
                this.vm.validarFormatoCorreo2 = false;
                this.vm.validarEstadoCorreo2 = true;
            }
            else {
                this.vm.validarFormatoCorreo2 = true;
                this.vm.validarEstadoCorreo2 = false;
            }
        }
        else {
            this.vm.validarFormatoCorreo2 = true;
            this.vm.validarEstadoCorreo2 = true;

        }
        return this.vm.validarFormatoCorreo2;

    }

    validarCorreo3() {

        if (!isNull(this.vm.DatosBasicos.Email3) && this.vm.DatosBasicos.Email3.toString() != "") {

            if (!this.validarFormatoCorreo(this.vm.DatosBasicos.Email3)) {
                this.vm.validarFormatoCorreo3 = false;
                this.vm.validarEstadoCorreo3 = true;
            }
            else {
                this.vm.validarFormatoCorreo3 = true;
                this.vm.validarEstadoCorreo3 = false;
            }
        }
        else {
            this.vm.validarFormatoCorreo3 = true;
            this.vm.validarEstadoCorreo3 = true;

        }
        return this.vm.validarFormatoCorreo3;

    }

    validarFormatoFecha(texto: string) {

        var estado = true;
        let regEx = new RegExp(/^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/);

        //tambien funciona 
        // if (!this.vm.DatosBasicos.Fini_Acuerdo_str.match(regEx)) 
        if (!regEx.test(texto))
            estado = false;

        return estado;


    }

    validarFechaAlta() {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();

        if (!isNull(this.vm.DatosBasicos.Falta_str) && this.vm.DatosBasicos.Falta_str != "") {
            if (!this.validarFormatoFecha(this.vm.DatosBasicos.Falta_str)) {
                $(".errorFechaAlta").css("display", "block");
                $("#falta").addClass("error-validate-fecha");
                this.vm.validarFormatoFechaAlta = false;
                this.vm.validarFechaAlta = true;
            }
            else {
                if (this.vm.DatosBasicos.Falta_str.length == 10 && !this.isDate(this.vm.DatosBasicos.Falta_str)) {
                    $(".errorFechaAlta").css("display", "block");
                    $("#falta").addClass("error-validate-fecha");
                    this.vm.validarFechaAlta = false;
                    this.vm.validarFormatoFechaAlta = true;
                }
                else {
                    this.vm.validarFechaAlta = true;
                    this.vm.validarFormatoFechaAlta = true;
                }
            }
        } else {
            this.vm.validarFechaAlta = true;
            this.vm.validarFormatoFechaAlta = true;
        }

        return this.vm.validarFechaAlta && this.vm.validarFormatoFechaAlta;
    }

    validarFechaBaja() {

        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();

        if (!isNull(this.vm.DatosBasicos.Fbaja_str) && this.vm.DatosBasicos.Fbaja_str != "") {
            if (!this.validarFormatoFecha(this.vm.DatosBasicos.Fbaja_str)) {
                $(".errorFechaBaja").css("display", "block");
                $("#fbaja").addClass("error-validate-fecha");
                this.vm.validarFormatoFechaBaja = false;
                this.vm.validarFechaBaja = true;
            }
            else {
                if (this.vm.DatosBasicos.Fbaja_str.length == 10 && !this.isDate(this.vm.DatosBasicos.Fbaja_str)) {
                    $(".errorFechaBaja").css("display", "block");
                    $("#fbaja").addClass("error-validate-fecha");
                    this.vm.validarFechaBaja = false;
                    this.vm.validarFormatoFechaBaja = true;
                }
                else {
                    this.vm.validarFechaBaja = true;
                    this.vm.validarFormatoFechaBaja = true;
                }
            }
        } else {
            this.vm.validarFechaBaja = true;
            this.vm.validarFormatoFechaBaja = true;
        }

        return this.vm.validarFechaBaja && this.vm.validarFormatoFechaBaja;
    }


    validarFechaIni() {

        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();

        if (!isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) && this.vm.DatosBasicos.Fini_Acuerdo_str != "") {

            if (!this.validarFormatoFecha(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
                $(".errorFechaIniAcuerdo").css("display", "block");
                $("#fini_Acuerdo").addClass("error-validate-fecha");
                this.vm.validarFormatoFechaIni = false;
                this.vm.validarFechaIni = true;
            }
            else {



                if (this.vm.DatosBasicos.Fini_Acuerdo_str.length == 10 && !this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
                    $(".errorFechaIniAcuerdo").css("display", "block");
                    $("#fini_Acuerdo").addClass("error-validate-fecha");
                    this.vm.validarFechaIni = false;
                    this.vm.validarFormatoFechaIni = true;
                }
                else {
                    this.vm.validarFechaIni = true;
                    this.vm.validarFormatoFechaIni = true;
                }
            }
        } else {
            this.vm.validarFechaIni = true;
            this.vm.validarFormatoFechaIni = true;
        }

        return this.vm.validarFechaIni && this.vm.validarFormatoFechaIni;
    }


    validarFechaFin() {

        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();

        if (!isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) && this.vm.DatosBasicos.Ffin_Acuerdo_str != "") {
            if (!this.validarFormatoFecha(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
                $(".errorFechaFinAcuerdo").css("display", "block");
                $("#ffin_Acuerdo").addClass("error-validate-fecha");
                this.vm.validarFormatoFechaFin = false;
                this.vm.validarFechaFin = true;
            }
            else {

                if (this.vm.DatosBasicos.Ffin_Acuerdo_str.length == 10 && !this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
                    $(".errorFechaFinAcuerdo").css("display", "block");
                    $("#ffin_Acuerdo").addClass("error-validate-fecha");
                    this.vm.validarFechaFin = false;
                    this.vm.validarFormatoFechaFin = true;
                }
                else {
                    this.vm.validarFechaFin = true;
                    this.vm.validarFormatoFechaFin = true;
                }
            }
        } else {

            this.vm.validarFechaFin = true;
            this.vm.validarFormatoFechaFin = true;
        }
        return this.vm.validarFechaFin && this.vm.validarFormatoFechaFin;
    }


    cambiarFechaMesDiaAnnio(fecha: string) {

        var arrayFecha = fecha.split("/");
        var dia = arrayFecha[0];
        var mes = arrayFecha[1];
        var annio = arrayFecha[2];
        if (dia.length == 1)
            dia = "0" + dia;
        if (mes.length == 1)
            mes = "0" + mes;

        var fechaActual = new Date(mes + "/" + dia + "/" + annio);

        return fechaActual;

    }

    validarFechaAltaFinal() {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();
        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();

        if (isNullOrUndefined(this.vm.DatosBasicos.Falta_str)) {
            this.vm.validarFechaAltaFinal = true;
        }
        else {

            if (this.vm.DatosBasicos.Falta_str.length == 10 && this.isDate(this.vm.DatosBasicos.Falta_str)) {

                var fechaAlta = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Falta_str);
                var fechaBaja;
                if (isNull(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Fbaja_str == "" || !this.isDate(this.vm.DatosBasicos.Fbaja_str)) {
                    fechaBaja = new Date("12/12/2500");
                }
                else {
                    fechaBaja = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fbaja_str);
                }

                if (fechaBaja < fechaAlta) {
                    if (isNull(this.vm.DatosBasicos.Falta_str) || isNull(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Falta_str == "" || this.vm.DatosBasicos.Fbaja_str == "") {
                        this.vm.validarFechaAltaFinal = true;
                        this.vm.validarFechaBajaFinal = true;
                    } else {
                        $(".errorFechaAlta").css("display", "block");
                        $("#falta").addClass("error-validate-fecha");
                        $("#falta").focus();
                        this.vm.validarFechaAltaFinal = false;
                    }
                } else {
                    this.vm.validarFechaAltaFinal = true;
                    this.vm.validarFechaBajaFinal = true;
                }
            } else {
                this.vm.validarFechaAltaFinal = true;
            }
        }

        return this.vm.validarFechaAltaFinal;
    }

    validarFechaBajaFinal() {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();
        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();

        if (isNullOrUndefined(this.vm.DatosBasicos.Fbaja_str)) {
            this.vm.validarFechaBajaFinal = true;
        }
        else {

            if (this.vm.DatosBasicos.Fbaja_str.length == 10 && this.isDate(this.vm.DatosBasicos.Fbaja_str)) {

                var fechaBaja = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fbaja_str);
                var fechaAlta;
                if (isNull(this.vm.DatosBasicos.Falta_str) || this.vm.DatosBasicos.Falta_str == "" || !this.isDate(this.vm.DatosBasicos.Falta_str)) {
                    fechaAlta = new Date("12/12/1900");
                }
                else {
                    fechaAlta = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Falta_str);
                }

                if (fechaBaja < fechaAlta) {
                    if (isNull(this.vm.DatosBasicos.Falta_str) || isNull(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Falta_str == "" || this.vm.DatosBasicos.Fbaja_str == "") {
                        this.vm.validarFechaBajaFinal = true;
                        this.vm.validarFechaAltaFinal = true;
                    } else {
                        $(".errorFechaBaja").css("display", "block");
                        $("#fbaja").addClass("error-validate-fecha");
                        $("#fbaja").focus();
                        this.vm.validarFechaBajaFinal = false;
                    }
                } else {
                    this.vm.validarFechaBajaFinal = true;
                    this.vm.validarFechaAltaFinal = true;
                }

            } else {
                this.vm.validarFechaBajaFinal = true;
            }
        }

        return this.vm.validarFechaBajaFinal;
    }

    validarFechaIniFinal() {

        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();
        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();

        if (isNullOrUndefined(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
            this.vm.validarFechaIniFinal = true;
        }
        else {

            if (this.vm.DatosBasicos.Fini_Acuerdo_str.length == 10 && this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {

                var fechaIni = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fini_Acuerdo_str);
                var fechaFin;
                if (isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Ffin_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
                    fechaFin = new Date("12/12/2500");
                }
                else {
                    fechaFin = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Ffin_Acuerdo_str);
                }

                if (fechaFin < fechaIni) {
                    if (isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) || isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || this.vm.DatosBasicos.Ffin_Acuerdo_str == "") {
                        this.vm.validarFechaIniFinal = true;
                        this.vm.validarFechaFinFinal = true;
                    } else {
                        $(".errorFechaIniAcuerdo").css("display", "block");
                        $("#fini_Acuerdo").addClass("error-validate-fecha");
                        $("#fini_Acuerdo").focus();
                        this.vm.validarFechaIniFinal = false;
                    }
                } else {
                    this.vm.validarFechaIniFinal = true;
                    this.vm.validarFechaFinFinal = true;
                }
            } else {
                this.vm.validarFechaIniFinal = true;
            }
        }

        return this.vm.validarFechaIniFinal;
    }

    validarFechaFinFinal() {

        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();
        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();

        if (isNullOrUndefined(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
            this.vm.validarFechaFinFinal = true;
        }
        else {


            if (this.vm.DatosBasicos.Ffin_Acuerdo_str.length == 10 && this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {

                var fechaFin = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Ffin_Acuerdo_str);
                var fechaIni;
                if (isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
                    fechaIni = new Date("12/12/1900");
                }
                else {
                    fechaIni = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fini_Acuerdo_str);
                }

                if (fechaFin < fechaIni) {
                    if (isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) || isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || this.vm.DatosBasicos.Ffin_Acuerdo_str == "") {
                        this.vm.validarFechaFinFinal = true;
                        this.vm.validarFechaIniFinal = true;
                    } else {
                        $(".errorFechaFinAcuerdo").css("display", "block");
                        $("#ffin_Acuerdo").addClass("error-validate-fecha");
                        $("#ffin_Acuerdo").focus();
                        this.vm.validarFechaFinFinal = false;
                    }
                } else {
                    this.vm.validarFechaFinFinal = true;
                    this.vm.validarFechaIniFinal = true;
                }
            }
            else {
                this.vm.validarFechaFinFinal = true;

            }
        }

        return this.vm.validarFechaFinFinal;
    }

    asignarFocus() {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();
        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();
        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();
        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();

        var fechaAlta
        if (isNull(this.vm.DatosBasicos.Falta_str) || this.vm.DatosBasicos.Falta_str == "" || !this.isDate(this.vm.DatosBasicos.Falta_str)) {
            fechaAlta = new Date("12/12/1900");
        }
        else {
            fechaAlta = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Falta_str);
        }

        var fechaBaja
        if (isNull(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Fbaja_str == "" || !this.isDate(this.vm.DatosBasicos.Fbaja_str)) {
            fechaBaja = new Date("12/12/2500");
        }
        else {
            fechaBaja = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fbaja_str);
        }

        var fechaIni
        if (isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
            fechaIni = new Date("12/12/1900");
        }
        else {
            fechaIni = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fini_Acuerdo_str);
        }

        var fechaFin
        if (isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Ffin_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
            fechaFin = new Date("12/12/2500");
        }
        else {
            fechaFin = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Ffin_Acuerdo_str);
        }

        // if(!this.validarCodigoSap()){
        //     $("#codigo_Sap").focus();
        // }else 
        if (!this.validarFechaBaja()) {
            $("#fbaja").focus();
        } else if (!this.validarDireccionSocial()) {
            $("#direccion").focus();
        } else if (!this.validarCodigoPostal()) {
            $("#codigo_Postal").focus();
        } else if (!this.validarLocalidad()) {
            $("#localidad").focus();
        } else if (this.vm.DatosBasicos.Id_Provincia == 0) {
            $(".clsProvincia").focus();
            $('.clsProvincia').css("border-color", "red");
            $('#validarProvincia span').html("El campo provincia es obligatorio");
        } else if (!this.validarCorreo1()) {
            $("#email1").focus();
        } else if (!this.validarCorreo2()) {
            $("#email2").focus();
        } else if (!this.validarCorreo3()) {
            $("#email3").focus();
        } else if (this.vm.DatosBasicos.Clasificacion == 0) {
            $(".clsClasificacion").focus();
            $('.clsClasificacion').css("border-color", "red");
            $('#validarClasificacion span').html("El campo clasificación es obligatorio");
        } else if (!this.validarFechaAlta()) {
            $("#falta").focus();
        } else if (!this.validarAcuerdoComercial()) {
            $("#acuerdo_Comercial").focus();
        } else if (!this.validarImporteFijo()) {
            $("#importe_Fijo").focus();
        } else if (!this.validarFechaIni()) {
            $("#fini_Acuerdo").focus();
        } else if (!this.validarFechaFin()) {
            $("#ffin_Acuerdo").focus();
        } else if (fechaBaja < fechaAlta) {
            if (isNull(this.vm.DatosBasicos.Falta_str) || isNull(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Falta_str == "" || this.vm.DatosBasicos.Fbaja_str == "") {
                this.vm.validarFechaBajaFinal = true;
            } else {
                $("#fbaja").focus();
                this.vm.validarFechaBajaFinal = false;
            }
        } else if (fechaFin < fechaIni) {
            if (isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) || isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || this.vm.DatosBasicos.Ffin_Acuerdo_str == "") {
                this.vm.validarFechaFinFinal = true;
            } else {
                $("#ffin_Acuerdo").focus();
                this.vm.validarFechaFinFinal = false;
            }
        }
    }

    validarFormulario(validarCodSap: boolean, validarCif: boolean, validarRazSoc: boolean) {

        this.vm.DatosBasicos.Falta_str = $("#falta").val();
        this.vm.DatosBasicos.Fbaja_str = $("#fbaja").val();
        this.vm.DatosBasicos.Fini_Acuerdo_str = $("#fini_Acuerdo").val();
        this.vm.DatosBasicos.Ffin_Acuerdo_str = $("#ffin_Acuerdo").val();


        var fechaAlta
        if (isNullOrUndefined(this.vm.DatosBasicos.Falta_str) || this.vm.DatosBasicos.Falta_str == "" || !this.isDate(this.vm.DatosBasicos.Falta_str)) {
            fechaAlta = new Date("12/12/1900");
        }
        else {
            fechaAlta = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Falta_str);
        }

        var fechaBaja
        if (isNullOrUndefined(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Fbaja_str == "" || !this.isDate(this.vm.DatosBasicos.Fbaja_str)) {
            fechaBaja = new Date("12/12/2500");
        }
        else {
            fechaBaja = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fbaja_str);
        }

        var fechaIni
        if (isNullOrUndefined(this.vm.DatosBasicos.Fini_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
            fechaIni = new Date("12/12/1900");
        }
        else {
            fechaIni = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Fini_Acuerdo_str);
        }

        var fechaFin
        if (isNullOrUndefined(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Ffin_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
            fechaFin = new Date("12/12/2500");
        }
        else {
            fechaFin = this.cambiarFechaMesDiaAnnio(this.vm.DatosBasicos.Ffin_Acuerdo_str);
        }

        var estado = true;
        var estadoCodigoSap = true;
        var estadoCif = true;
        var estadoRazSoc = true;

        if (validarCodSap) {
            estado = false;
            estadoCodigoSap = false;
        }
        else if (validarCif) {
            if (!this.vm.validarCifExiste)
                estado = true;
            else {
                estado = false;
                estadoCif = false;
            }
        } else if (validarRazSoc) {
            if (!this.vm.validarRazSocialExiste)
                estado = true;
            else {
                estado = false;
                estadoRazSoc = false;
            }
        }


        if (!this.validarFechaBaja()) {
            estado = false;
            // $("#fbaja").focus();
        }
        if (!this.validarDireccionSocial()) {
            estado = false;
            // $("#direccion").focus();
        }
        if (!this.validarCodigoPostal()) {
            estado = false;
            // $("#codigo_Postal").focus();
        }
        if (!this.validarLocalidad()) {
            estado = false;
            // $("#localidad").focus();
        }
        if (this.vm.DatosBasicos.Id_Provincia == 0) {
            estado = false;
            // $(".clsProvincia").focus();
            $('.clsProvincia').css("border-color", "red");
            $('#validarProvincia span').html("El campo provincia es obligatorio");
        }
        if (!this.validarCorreo1()) {
            estado = false;
            // $("#email1").focus();
        }
        if (!this.validarCorreo2()) {
            estado = false;
            //$("#email2").focus();
        }
        if (!this.validarCorreo3()) {
            estado = false;
            // $("#email3").focus();
        }
        if (this.vm.DatosBasicos.Clasificacion == 0) {
            estado = false;
            //$(".clsClasificacion").focus();
            $('.clsClasificacion').css("border-color", "red");
            $('#validarClasificacion span').html("El campo clasificación es obligatorio");
        }
        if (!this.validarFechaAlta()) {
            estado = false;
            // $("#falta").focus();
        }
        if (!this.validarAcuerdoComercial()) {
            estado = false;
            // $("#acuerdo_Comercial").focus();
        }
        if (!this.validarImporteFijo()) {
            estado = false;
            // $("#importe_Fijo").focus();
        }
        if (!this.validarFechaIni()) {
            estado = false;
            //$("#fini_Acuerdo").focus();
        }
        if (!this.validarFechaFin()) {
            estado = false;
            // $("#ffin_Acuerdo").focus();
        }
        if (this.vm.DatosBasicos.Id_Facturador == 0) {
            this.vm.DatosBasicos.Id_Facturador = null;
            // estado = false;
            // $(".clsFacturador").focus();
            // $('.clsFacturador').css("border-color", "red");
            // $('#validarFacturador span').html("El campo facturador es obligatorio");
        }
        if (fechaBaja < fechaAlta) {
            if (isNullOrUndefined(this.vm.DatosBasicos.Falta_str) || isNullOrUndefined(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Falta_str == "" || this.vm.DatosBasicos.Fbaja_str == "") {
                estado = true;
                this.vm.validarFechaBajaFinal = true;
            } else {
                estado = false;
                //$("#fbaja").focus();
                this.vm.validarFechaBajaFinal = false;
            }
        }
        else if (fechaFin < fechaIni) {
            if (isNullOrUndefined(this.vm.DatosBasicos.Fini_Acuerdo_str) || isNullOrUndefined(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || this.vm.DatosBasicos.Ffin_Acuerdo_str == "") {
                estado = true;
                this.vm.validarFechaFinFinal = true;
            } else {
                estado = false;
                //$("#ffin_Acuerdo").focus();
                this.vm.validarFechaFinFinal = false;
            }

        }



        if (!estado) {
            this.vm.loading = false;
            if (!estadoCodigoSap) {
                $("#codigo_Sap").focus();
            } else if (!estadoCif) {
                $("#cif").focus();
            } else if (!estadoRazSoc) {
                $("#razon_Social").focus();
            } else {
                this.asignarFocus();
            }


        }

        if (estado) {
            if (isNullOrUndefined(this.vm.DatosBasicos.Acuerdo_Comercial) || this.vm.DatosBasicos.Acuerdo_Comercial.toString() == "") {
                this.vm.DatosBasicos.Acuerdo_Comercial = null;
            }
            //  else {
            //     this.vm.DatosBasicos.Acuerdo_Comercial = parseFloat(this.vm.DatosBasicos.Acuerdo_Comercial.toString().replace(",", "."));
            // }

            if (isNullOrUndefined(this.vm.DatosBasicos.Importe_Fijo) || this.vm.DatosBasicos.Importe_Fijo.toString() == "") {
                this.vm.DatosBasicos.Importe_Fijo = null;
            }
            // else {
            //     this.vm.DatosBasicos.Importe_Fijo = parseFloat(this.vm.DatosBasicos.Importe_Fijo.toString().replace(",", "."));
            // }

            this.vm.validarFechaBajaFinal = true;
            this.vm.validarFechaFinFinal = true;

            if (isNullOrUndefined(this.vm.DatosBasicos.Falta_str) || this.vm.DatosBasicos.Falta_str == "" || !this.isDate(this.vm.DatosBasicos.Falta_str)) {
                this.vm.DatosBasicos.Falta_str = null;
            }
            if (isNullOrUndefined(this.vm.DatosBasicos.Fbaja_str) || this.vm.DatosBasicos.Fbaja_str == "" || !this.isDate(this.vm.DatosBasicos.Fbaja_str)) {
                this.vm.DatosBasicos.Fbaja_str = null;
            }
            if (isNullOrUndefined(this.vm.DatosBasicos.Fini_Acuerdo_str) || this.vm.DatosBasicos.Fini_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Fini_Acuerdo_str)) {
                this.vm.DatosBasicos.Fini_Acuerdo_str = null;
            }
            if (isNullOrUndefined(this.vm.DatosBasicos.Ffin_Acuerdo_str) || this.vm.DatosBasicos.Ffin_Acuerdo_str == "" || !this.isDate(this.vm.DatosBasicos.Ffin_Acuerdo_str)) {
                this.vm.DatosBasicos.Ffin_Acuerdo_str = null;
            }
        }
        return estado;
    }

    inicializarComboDuplicado(idCombo:string) {

        var objDiv = $("#" + idCombo).siblings("div");
        $(objDiv).css("background-color", "#ffffff");
        //alert(obj.html());
        var objUl = objDiv.children("ul");
        var objSpan = objDiv.children("span");

        for (let index = 0; index < objUl[0].children.length; index++) {
            const element = objUl[0].children[index];
            var value = $(element).attr('data-value');
            $(element).removeClass("selected");
            $(element).removeClass("focus");
            if (value == 0) {
                $(element).addClass("selected");               
                objSpan[0].innerText = "--Seleccionar--";
            } 
        }

    }

    nuevoProveedor() {

        this.router.navigateByUrl('/HomeComponent', {skipLocationChange: true}).then(()=> this.router.navigate(["alta-proveedores"]));
        // alert("entro..!!")
      //  this.router.navigate(['/alta-proveedores']);
        // this.vm.DatosBasicos = new Proveedor();
        // this.vm.RspProvincias.ListaErrores = [];
        // this.vm.RspPaises.ListaPaises = [];
        // this.vm.RspFacturador.ListaProveedores = [];
        // this.vm.RspClasificacion = new ResponseClasificacion();
        // this.vm.RpsTiposCaracterizacion = new ResponseTiposCaracterizacion();
        // this.vm.RpsCaracterizacion = new ResponseCaracterizacion
        // this.vm.RspListaCodigosProveedor = new ResponseListaCodigosProveedor();
        // this.vm.RspValidacionGenerico.Validacion = false;
        // this.vm.RspValidacionGenerico.DescripcionValidacion="";
        // this.vm.RspHacienda.Hacienda = 0;
        // this.vm.RspHaciendaRazSoc.Hacienda = 0;
        // this.vm.ListaArticuloProveedor = [];
        // this.vm.ListaCodigosProveedor = [];
        // this.vm.nombreTipCaract = "";
        // this.vm.action = "";
        // this.vm.habilitarGuardar = false;
        // this.vm.habilitarModificar = true;
        // this.vm.habilitarModificarDetalle = true;
        // this.vm.habilitarSoap = true;
        // this.vm.resul = "";
        // this.vm.loading = false;
        // this.vm.timer = { search: { id: null, ms: 200 }, result: { id: null, ms: 200 } };
        // this.vm.hideSugerencias = true;
        // this.vm.validarLocalidad = true;
        // this.vm.validarEstadoLocalidad = true;
        // this.vm.validarDirSocial = true;
        // this.vm.validarEstadoDirSocial = true;
        // this.vm.validarRazSocial = true;
        // this.vm.validarRazSocialExiste = true;
        // this.vm.validarEstadoRazSocial = true;
        // this.vm.validarCif = true;
        // this.vm.validarEstadoCif = true;
        // this.vm.validarCifExiste = true;
        // this.vm.validarCodigoPostal = true;
        // this.vm.validarFormatoCodigoPostal = true;
        // this.vm.validarCodigoPostalFinal = true;
        // this.vm.validarEstadoCodigoPostal = true;
        // this.vm.validarAcuerdoComercial = true;
        // this.vm.validarEstadoAcuerdoComercial = true;
        // this.vm.validarFormatoAcuerdoComercial = true;
        // this.vm.validarImporteFijo = true;
        // this.vm.validarFormatoImporteFijo = true;
        // this.vm.validarEstadoImporteFijo = true;
        // this.vm.validarCodigoSap = true;
        // this.vm.validarCodigoSapFinal = true;
        // this.vm.validarEstadoCodigoSap = true;
        // this.vm.validarFechaAlta = true;
        // this.vm.validarFormatoFechaAlta = true;
        // this.vm.validarFechaBaja = true;
        // this.vm.validarFormatoFechaBaja = true;
        // this.vm.validarFechaIni = true;
        // this.vm.validarFormatoFechaIni = true;
        // this.vm.validarFechaFin = true;
        // this.vm.validarFormatoFechaFin = true;
        // this.vm.validarFechaAltaFinal = true;
        // this.vm.validarFechaBajaFinal = true;
        // this.vm.validarFechaIniFinal = true;
        // this.vm.validarFechaFinFinal = true;
        // this.vm.validarFormatoCorreo1 = true;
        // this.vm.validarFormatoCorreo2 = true;
        // this.vm.validarFormatoCorreo3 = true;
        // this.vm.validarEstadoCorreo1 = true;
        // this.vm.validarEstadoCorreo2 = true;
        // this.vm.validarEstadoCorreo3 = true;
        // this.vm.pageTablaCaracterizaciones = 0;
        // this.vm.fechaPlaceholder = "";

        // this.habilitarControles();

        // this.inicializarComboDuplicado("provincia");
        // this.inicializarComboDuplicado("pais");
        // this.inicializarComboDuplicado("clasificacion");
        // this.inicializarComboDuplicado("id_Facturador");

        // $('#tablaCaracteristica').DataTable().destroy();
        // $('#tablaArticulo').DataTable().destroy();
        // this.inicializarComponenteServices();
    }

    guardarProveedores(content) {

        this.vm.loading = true;
        var reqProveedor = new RequestProveedor();
        var rspProveedor = new ResponseProveedor();

        if (isNullOrUndefined(this.vm.DatosBasicos.Punto_Operacional) || this.vm.DatosBasicos.Punto_Operacional.toString() == "")
            this.vm.DatosBasicos.Punto_Operacional = null;
        else
            this.vm.DatosBasicos.Punto_Operacional = parseInt(this.vm.DatosBasicos.Punto_Operacional.toString());

        reqProveedor.Proveedor = this.vm.DatosBasicos;
        reqProveedor.Proveedor.Id_Empresa = 1;
        reqProveedor.Proveedor.Divisa = 1;


        reqProveedor.ListaCaracterizacionProveedores = this.obtenerListaTiposCaractAlRequest(reqProveedor.Proveedor.Id_Empresa);


        this.seleccionarProvinciaRepsol();
        this.seleccionarPaisRepsol();
        this.seleccionarIdFacturadorRepsol();
        this.seleccionarClasificacionRepsol();
        this.verificarFechas();


        if (this.vm.DatosBasicos.Id_Proveedores > 0) {

            if (!isNull(this.vm.DatosBasicos.Cif) && this.vm.DatosBasicos.Cif.toString() != "") {
                var reqHaciendaCif = new RequestHacienda();
                reqHaciendaCif.nif = this.vm.DatosBasicos.Cif;
                reqHaciendaCif.nombre = "";
            } else {
                var reqHaciendaCif = new RequestHacienda();
                reqHaciendaCif.nif = "";
                reqHaciendaCif.nombre = "";
                this.vm.validarCif = false;
                this.vm.validarCifExiste = true;
                this.vm.validarEstadoCif = true;
            }

            if (!isNull(this.vm.DatosBasicos.Razon_Social) && this.vm.DatosBasicos.Razon_Social.toString() != "") {
                var reqHaciendaRazSoc = new RequestHacienda();
                reqHaciendaRazSoc.nif = "";
                reqHaciendaRazSoc.nombre = this.vm.DatosBasicos.Razon_Social;
            } else {
                var reqHaciendaRazSoc = new RequestHacienda();
                reqHaciendaRazSoc.nif = "";
                reqHaciendaRazSoc.nombre = "";
                this.vm.validarRazSocial = false;
                this.vm.validarRazSocialExiste = true;
                this.vm.validarEstadoRazSocial = true;
            }

            const allrequests = Observable.forkJoin(
                this.proveedorService.validarHacienda(reqHaciendaCif),
                this.proveedorService.validarHacienda(reqHaciendaRazSoc)

            );
            allrequests.subscribe(latestResults => {
                this.vm.RspHacienda = latestResults[0];
                this.vm.RspHaciendaRazSoc = latestResults[1];


                if ((this.vm.RspHacienda.CodigoServicio == "OK" || this.vm.RspHacienda.CodigoServicio == "E") && (this.vm.RspHaciendaRazSoc.CodigoServicio == "OK" || this.vm.RspHaciendaRazSoc.CodigoServicio == "E")) {

                    if (!isNull(this.vm.DatosBasicos.Cif) && this.vm.DatosBasicos.Cif.toString() != "") {
                        if (this.vm.RspHacienda.Hacienda == 1) {
                            this.vm.validarCif = true;
                            this.vm.validarCifExiste = false;
                            this.vm.validarEstadoCif = true;
                            //$("#codigo_Sap").focus();
                        }
                        else {
                            this.vm.validarCif = true;
                            this.vm.validarCifExiste = true;
                            this.vm.validarEstadoCif = false;
                        }
                    } else {
                        this.vm.validarCif = false;
                        this.vm.validarCifExiste = true;
                        this.vm.validarEstadoCif = true;
                    }

                    if (!isNull(this.vm.DatosBasicos.Razon_Social) && this.vm.DatosBasicos.Razon_Social.toString() != "") {

                        if (this.vm.RspHaciendaRazSoc.Hacienda == 1) {
                            this.vm.validarRazSocial = true;
                            this.vm.validarRazSocialExiste = false;
                            this.vm.validarEstadoRazSocial = true;
                            // $("#codigo_Sap").focus();
                        }
                        else {
                            this.vm.validarRazSocial = true;
                            this.vm.validarRazSocialExiste = true;
                            this.vm.validarEstadoRazSocial = false;
                        }
                    }
                    else {
                        this.vm.validarRazSocial = false;
                        this.vm.validarRazSocialExiste = true;
                        this.vm.validarEstadoRazSocial = true;
                    }

                    if (this.validarFormulario(false, this.vm.validarEstadoCif, this.vm.validarEstadoRazSocial)) {

                        this.proveedorService.update(reqProveedor).subscribe(
                            response => {
                                rspProveedor = response;
                                if (rspProveedor.CodigoServicio == "OK") {
                                    this.vm.DatosBasicos = rspProveedor.Proveedor;
                                    this.vm.DatosBasicos.Falta_str = isNull(this.vm.DatosBasicos.Falta_str) ? "" : this.vm.DatosBasicos.Falta_str.substring(0, 10);
                                    this.vm.DatosBasicos.Fbaja_str = isNull(this.vm.DatosBasicos.Fbaja_str) ? "" : this.vm.DatosBasicos.Fbaja_str.substring(0, 10);
                                    this.vm.DatosBasicos.Fini_Acuerdo_str = isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) ? "" : this.vm.DatosBasicos.Fini_Acuerdo_str.substring(0, 10);
                                    this.vm.DatosBasicos.Ffin_Acuerdo_str = isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) ? "" : this.vm.DatosBasicos.Ffin_Acuerdo_str.substring(0, 10);
                                    this.asignarAlViewModelListaTiposCaracTerizaciones(rspProveedor.ListaCaracterizacionProveedores);
                                    $('#tablaArticulo').DataTable().destroy();
                                    this.vm.ListaArticuloProveedor = rspProveedor.ListaArticuloProveedor;
                                    this.documentReadyTable("tablaArticulo", this.vm.action);
                                    this.vm.resul = "El proveedor se ha actualizado correctamente.";
                                    this.modalService.open(content, { centered: true, size: 'sm' });
                                    this.vm.loading = false;
                                    this.validarComaPunto();

                                    this.activarDesactivarBotones(false);
                                }
                                else {
                                    console.log(JSON.stringify(rspProveedor.ListaErrores));
                                    this.vm.resul = "Se produjo un error al actualizar.";
                                    this.modalService.open(content, { centered: true, size: 'sm' });
                                    this.vm.loading = false;


                                }

                            }
                        );
                    }
                    else {
                        this.vm.loading = false;
                    }

                }
                else {
                    if (this.vm.RspHacienda.CodigoServicio == "E") {
                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = false;
                        this.vm.validarEstadoCif = true;
                        console.log(JSON.stringify(this.vm.RspHacienda.ListaErrores));
                    }

                    if (this.vm.RspHaciendaRazSoc.CodigoServicio == "E") {
                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = false;
                        this.vm.validarEstadoRazSocial = true;
                        console.log(JSON.stringify(this.vm.RspHaciendaRazSoc.ListaErrores));
                    }

                }

                // if (this.validarFormulario(false, true, true)) {
                //     this.proveedorService.update(reqProveedor).subscribe(
                //         response => {
                //             rspProveedor = response;
                //             if (rspProveedor.CodigoServicio == "OK") {
                //                 this.vm.DatosBasicos = rspProveedor.Proveedor;
                //                 this.vm.DatosBasicos.Falta_str = isNull(this.vm.DatosBasicos.Falta_str) ? "" : this.vm.DatosBasicos.Falta_str.substring(0, 10);
                //                 this.vm.DatosBasicos.Fbaja_str = isNull(this.vm.DatosBasicos.Fbaja_str) ? "" : this.vm.DatosBasicos.Fbaja_str.substring(0, 10);
                //                 this.vm.DatosBasicos.Fini_Acuerdo_str = isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) ? "" : this.vm.DatosBasicos.Fini_Acuerdo_str.substring(0, 10);
                //                 this.vm.DatosBasicos.Ffin_Acuerdo_str = isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) ? "" : this.vm.DatosBasicos.Ffin_Acuerdo_str.substring(0, 10);
                //                 this.asignarAlViewModelListaTiposCaracTerizaciones(rspProveedor.ListaCaracterizacionProveedores);
                //                 $('#tablaArticulo').DataTable().destroy();
                //                 this.vm.ListaArticuloProveedor = rspProveedor.ListaArticuloProveedor;
                //                 this.documentReadyTable("tablaArticulo", this.vm.action);
                //                 this.vm.resul = "El proveedor se ha actualizado correctamente.";
                //                 this.modalService.open(content, { centered: true, size: 'sm' });
                //                 this.vm.loading = false;
                //                 this.validarComaPunto();

                //                 this.activarDesactivarBotones(false);
                //             }
                //             else {
                //                 console.log(JSON.stringify(rspProveedor.ListaErrores));
                //                 this.vm.resul = "Se produjo un error al actualizar.";
                //                 this.modalService.open(content, { centered: true, size: 'sm' });
                //                 this.vm.loading = false;


                //             }

                //         }
                //     );
                // }

            });
        }
        else {

            if (!isNull(this.vm.DatosBasicos.Codigo_Sap) && this.vm.DatosBasicos.Codigo_Sap.toString() != "") {
                var reqValidarCodigoSap = new RequestValidarCodigoSap();
                reqValidarCodigoSap.Codigo_Sap = this.vm.DatosBasicos.Codigo_Sap;
                reqValidarCodigoSap.Id_Empresa = 1;
            }
            else {
                var reqValidarCodigoSap = new RequestValidarCodigoSap();
                reqValidarCodigoSap.Codigo_Sap = "";
                reqValidarCodigoSap.Id_Empresa = 1;
                this.vm.validarCodigoSap = false;
                this.vm.validarCodigoSapFinal = true;
                this.vm.validarEstadoCodigoSap = true;
            }

            if (!isNull(this.vm.DatosBasicos.Cif) && this.vm.DatosBasicos.Cif.toString() != "") {
                var reqHaciendaCif = new RequestHacienda();
                reqHaciendaCif.nif = this.vm.DatosBasicos.Cif;
                reqHaciendaCif.nombre = "";
            } else {
                var reqHaciendaCif = new RequestHacienda();
                reqHaciendaCif.nif = "";
                reqHaciendaCif.nombre = "";
                this.vm.validarCif = false;
                this.vm.validarCifExiste = true;
                this.vm.validarEstadoCif = true;
            }

            if (!isNull(this.vm.DatosBasicos.Razon_Social) && this.vm.DatosBasicos.Razon_Social.toString() != "") {
                var reqHaciendaRazSoc = new RequestHacienda();
                reqHaciendaRazSoc.nif = "";
                reqHaciendaRazSoc.nombre = this.vm.DatosBasicos.Razon_Social;
            } else {
                var reqHaciendaRazSoc = new RequestHacienda();
                reqHaciendaRazSoc.nif = "";
                reqHaciendaRazSoc.nombre = "";
                this.vm.validarRazSocial = false;
                this.vm.validarRazSocialExiste = true;
                this.vm.validarEstadoRazSocial = true;
            }

            const allrequests = Observable.forkJoin(
                this.proveedorService.ValidarCodigoSap(reqValidarCodigoSap),
                this.proveedorService.validarHacienda(reqHaciendaCif),
                this.proveedorService.validarHacienda(reqHaciendaRazSoc)

            );
            allrequests.subscribe(latestResults => {
                this.vm.RspValidacionGenerico = latestResults[0];
                this.vm.RspHacienda = latestResults[1];
                this.vm.RspHaciendaRazSoc = latestResults[2];


                if (this.vm.RspValidacionGenerico.CodigoServicio == "OK" && (this.vm.RspHacienda.CodigoServicio == "OK" || this.vm.RspHacienda.CodigoServicio == "E") && (this.vm.RspHaciendaRazSoc.CodigoServicio == "OK" || this.vm.RspHaciendaRazSoc.CodigoServicio == "E")) {

                    if (!isNull(this.vm.DatosBasicos.Codigo_Sap) && this.vm.DatosBasicos.Codigo_Sap.toString() != "") {
                        if (!this.vm.RspValidacionGenerico.Validacion) {
                            this.vm.validarCodigoSap = true;
                            this.vm.validarCodigoSapFinal = false;
                            this.vm.validarEstadoCodigoSap = true;
                        }
                        else {
                            this.vm.validarCodigoSap = true;
                            this.vm.validarCodigoSapFinal = true;
                            this.vm.validarEstadoCodigoSap = false;
                        }
                    }
                    else {
                        this.vm.validarCodigoSap = false;
                        this.vm.validarCodigoSapFinal = true;
                        this.vm.validarEstadoCodigoSap = true;
                    }

                    if (!isNull(this.vm.DatosBasicos.Cif) && this.vm.DatosBasicos.Cif.toString() != "") {
                        if (this.vm.RspHacienda.Hacienda == 1) {
                            this.vm.validarCif = true;
                            this.vm.validarCifExiste = false;
                            this.vm.validarEstadoCif = true;
                            //$("#codigo_Sap").focus();
                        }
                        else {
                            this.vm.validarCif = true;
                            this.vm.validarCifExiste = true;
                            this.vm.validarEstadoCif = false;
                        }
                    } else {
                        this.vm.validarCif = false;
                        this.vm.validarCifExiste = true;
                        this.vm.validarEstadoCif = true;
                    }

                    if (!isNull(this.vm.DatosBasicos.Razon_Social) && this.vm.DatosBasicos.Razon_Social.toString() != "") {

                        if (this.vm.RspHaciendaRazSoc.Hacienda == 1) {
                            this.vm.validarRazSocial = true;
                            this.vm.validarRazSocialExiste = false;
                            this.vm.validarEstadoRazSocial = true;
                            // $("#codigo_Sap").focus();
                        }
                        else {
                            this.vm.validarRazSocial = true;
                            this.vm.validarRazSocialExiste = true;
                            this.vm.validarEstadoRazSocial = false;
                        }
                    }
                    else {
                        this.vm.validarRazSocial = false;
                        this.vm.validarRazSocialExiste = true;
                        this.vm.validarEstadoRazSocial = true;
                    }

                    if (this.validarFormulario(this.vm.validarEstadoCodigoSap, this.vm.validarEstadoCif, this.vm.validarEstadoRazSocial)) {
                        this.proveedorService.create(reqProveedor).subscribe(
                            response => {
                                rspProveedor = response;
                                if (rspProveedor.CodigoServicio == "OK") {
                                    this.vm.DatosBasicos = rspProveedor.Proveedor;
                                    this.vm.DatosBasicos.Falta_str = isNull(this.vm.DatosBasicos.Falta_str) ? "" : this.vm.DatosBasicos.Falta_str.substring(0, 10);
                                    this.vm.DatosBasicos.Fbaja_str = isNull(this.vm.DatosBasicos.Fbaja_str) ? "" : this.vm.DatosBasicos.Fbaja_str.substring(0, 10);
                                    this.vm.DatosBasicos.Fini_Acuerdo_str = isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) ? "" : this.vm.DatosBasicos.Fini_Acuerdo_str.substring(0, 10);
                                    this.vm.DatosBasicos.Ffin_Acuerdo_str = isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) ? "" : this.vm.DatosBasicos.Ffin_Acuerdo_str.substring(0, 10);
                                    this.asignarAlViewModelListaTiposCaracTerizaciones(rspProveedor.ListaCaracterizacionProveedores);
                                    $('#tablaArticulo').DataTable().destroy();
                                    this.vm.ListaArticuloProveedor = rspProveedor.ListaArticuloProveedor;
                                    this.documentReadyTable("tablaArticulo", this.vm.action);
                                    this.vm.resul = "El proveedor se ha guardado correctamente.";
                                    this.modalService.open(content, { centered: true, size: 'sm' });
                                    this.vm.loading = false;
                                    this.validarComaPunto();

                                    this.activarDesactivarBotones(false);
                                }
                                else {
                                    console.log(JSON.stringify(rspProveedor.ListaErrores));
                                    this.vm.resul = "Se produjo un error al registrar.";
                                    this.modalService.open(content, { centered: true, size: 'sm' });
                                    this.vm.loading = false;
                                }

                            }
                        );
                    } else {
                        this.vm.loading = false;
                    }





                }
                else {

                    if (this.vm.RspValidacionGenerico.CodigoServicio == "E") {
                        this.vm.validarCodigoSap = true;
                        this.vm.validarCodigoSapFinal = false;
                        this.vm.validarEstadoCodigoSap = true;
                        console.log(JSON.stringify(this.vm.RspValidacionGenerico.ListaErrores));
                    }
                    if (this.vm.RspHacienda.CodigoServicio == "E") {
                        this.vm.validarCif = true;
                        this.vm.validarCifExiste = false;
                        this.vm.validarEstadoCif = true;
                        console.log(JSON.stringify(this.vm.RspHacienda.ListaErrores));
                    }

                    if (this.vm.RspHaciendaRazSoc.CodigoServicio == "E") {
                        this.vm.validarRazSocial = true;
                        this.vm.validarRazSocialExiste = false;
                        this.vm.validarEstadoRazSocial = true;
                        console.log(JSON.stringify(this.vm.RspHaciendaRazSoc.ListaErrores));
                    }

                    this.vm.loading = false;
                }

            });

            /*
                        if (this.validarFormulario(true)) {
                            this.proveedorService.create(reqProveedor).subscribe(
                                response => {
                                    rspProveedor = response;
                                    if (rspProveedor.CodigoServicio == "OK") {
                                        this.vm.DatosBasicos = rspProveedor.Proveedor;
                                        this.vm.DatosBasicos.Falta_str = isNull(this.vm.DatosBasicos.Falta_str) ? "" : this.vm.DatosBasicos.Falta_str.substring(0, 10);
                                        this.vm.DatosBasicos.Fbaja_str = isNull(this.vm.DatosBasicos.Fbaja_str) ? "" : this.vm.DatosBasicos.Fbaja_str.substring(0, 10);
                                        this.vm.DatosBasicos.Fini_Acuerdo_str = isNull(this.vm.DatosBasicos.Fini_Acuerdo_str) ? "" : this.vm.DatosBasicos.Fini_Acuerdo_str.substring(0, 10);
                                        this.vm.DatosBasicos.Ffin_Acuerdo_str = isNull(this.vm.DatosBasicos.Ffin_Acuerdo_str) ? "" : this.vm.DatosBasicos.Ffin_Acuerdo_str.substring(0, 10);
                                        this.asignarAlViewModelListaTiposCaracTerizaciones(rspProveedor.ListaCaracterizacionProveedores);
                                        $('#tablaArticulo').DataTable().destroy();
                                        this.vm.ListaArticuloProveedor = rspProveedor.ListaArticuloProveedor;
                                        this.documentReadyTable("tablaArticulo", this.vm.action);
                                        this.vm.resul = "El proveedor se ha guardado correctamente.";
                                        this.modalService.open(content, { centered: true, size: 'sm' });
                                        this.vm.loading = false;
                                        this.validarComaPunto();
            
                                        this.activarDesactivarBotones(false);
                                    }
                                    else {
                                        console.log(JSON.stringify(rspProveedor.ListaErrores));
                                        this.vm.resul = "Se produjo un error al registrar.";
                                        this.modalService.open(content, { centered: true, size: 'sm' });
                                        this.vm.loading = false;
                                    }
            
                                }
                            );
                        }
                        else {
                            this.vm.loading = false;
                        }
            
                        */


        }


    }

    sinTilde(dato: string): string {
        // let valor : string = ""
        // valor = dato.replace(/Á/g, 'A' );
        return dato
            .replace(/Á/g, 'A')
            .replace(/É/g, 'E')
            .replace(/Í/g, 'I')
            .replace(/Ó/g, 'O')
            .replace(/Ú/g, 'U')
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u');
    }

}