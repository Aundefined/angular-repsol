import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { FormsModule, Validators } from '@angular/forms';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import {
    ProvinciasService, PaisesService, EstacionDelegacionAreaService,
    EstacionImagenService, EstacionHorarioService, SegmentoService,
    EstacionesService, TiposCaracterizacionService, CaracterizacionesService
} from '../../_services/index';
import {
    RequestProvinciasByIdEmpresa, RequestPaisesByIdEmpresa, RequestEstacion,
    ResponseEstacion, TiposCaracterizacion, RequestCaracterizacionByIdTipo,
    RequestTiposCaracterizacionByTipo,
    RequestEstacionById, RequestCodigoRepsol
} from '../../_models/index';
import { EstacionesViewModel } from '../../_models/viewModels/estaciones/EstacionesViewModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNull } from 'util';
import { CaracterizacionEstaciones } from '../../_models/msEstaciones/estaciones/caracterizacionEstaciones';
import { EstacionCategoriaBase } from '../../_models/msEstaciones/estaciones/estacionCategoriaBase';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Empresa } from '../../../environments/environment';
import { Estaciones } from '../../_models/msEstaciones/estaciones/estaciones';
import { ValidacionHelper } from '../../_helpers/index';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

declare var jQuery: any;
declare var $: any;
@Component({
    selector: 'app-crear-estacion',
    templateUrl: './crear-estacion.component.html',
    styleUrls: ['./crear-estacion.component.css']


})
export class CrearEstacionComponent implements OnInit {

    vm = new EstacionesViewModel();

    // categoriasBaseForm = new FormGroup({
    //     id_Base: new FormControl('', Validators.required),
    //     fecha_Inicio: new FormControl('', Validators.required),
    //     fecha_Fin: new FormControl('', Validators.required)
    //  });

    constructor(private provinciasService: ProvinciasService, private paisesService: PaisesService,
        private estacionDelegacionAreaService: EstacionDelegacionAreaService, private estacionImagenService: EstacionImagenService,
        private estacionHorarioService: EstacionHorarioService, private segmentoService: SegmentoService,
        private estacionesService: EstacionesService, private modalService: NgbModal,
        private tiposCaracterizacionService: TiposCaracterizacionService, private caracterizacionesService: CaracterizacionesService,
        private _routeParams: ActivatedRoute, private router: Router, private _validacionHelper: ValidacionHelper) {

        this._routeParams.queryParams.subscribe(params => {
            if (params['id']) {
                this.vm.datosBasicos.Id = parseInt(params['id']);
            }
            if (params['action']) {
                this.vm.action = (params['action']);
            }
        });

        this.vm.resul = "";
        this.vm.habilitarGuardar = false;
        this.vm.habilitarModificar = true;
        this.vm.habilitarCodigoRepsol = true;
    }

    ngOnInit() {

        // this.router.routeReuseStrategy.shouldReuseRoute = function(){ return false; }; 
        //     this.router.events.subscribe(
        //     (evt) => 
        //     { 
        //         if (evt instanceof NavigationEnd) 
        //         { 
        //             this.router.navigated = false; 
        //             window.scrollTo(0, 0); 
        //         } 
        //     });

        this.inicializarComponenteServices();

    }

    paginationPreciosRefresh() {
        $('#tablaCategoriaBase').DataTable().clear();
        $('#tablaCategoriaBase').DataTable().rows.add(this.vm.rspDatosPrecios.ListaCategorias);
        $('#tablaCategoriaBase').DataTable().draw();
        if (this.vm.rspDatosPrecios.ListaCategorias.length < 5) {
            $('.pagination').hide();
        }
    }

    documentReadyDatePicker() {
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
                    if (this.id == "fecha_Alta" || this.id == "fecha_Baja") {
                        $("#errorMessageFechaAlta").removeClass("error-mensaje");
                        $("#errorMessageFechaAltaSpan").html("");
                        $("#fecha_Alta").removeClass("error-validate-fecha");
                        $("#fecha_Alta").removeClass("input-valido");
                        $("#errorMessageFechaBaja").removeClass("error-mensaje");
                        $("#errorMessageFechaBajaSpan").html("");
                        $("#fecha_Baja").removeClass("error-validate-fecha");
                        $("#fecha_Baja").removeClass("input-valido");

                        var fechaAlta = $("#fecha_Alta").val();
                        vmJquery.vm.datosBasicos.Fecha_Alta_str = fechaAlta;
                        var evaluarDiferencia = false;
                        if (fechaAlta != null && fechaAlta != "" && fechaAlta != undefined) {
                            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                            let regEx = new RegExp(regexStr);
                            if (!regEx.test(fechaAlta)) {
                                $("#errorMessageFechaAlta").addClass("error-mensaje");
                                $("#errorMessageFechaAltaSpan").html("Formato fecha incorrecto");
                                $("#fecha_Alta").addClass("error-validate-fecha");
                            }
                            else {
                                // if(!this._validacionHelper.isDate(fechaAlta))
                                // {
                                //     $("#errorMessageFechaAlta").addClass("error-mensaje");
                                //     $("#errorMessageFechaAltaSpan").html("La fecha es inválida.");
                                //     $("#fecha_Alta").addClass("error-validate-fecha");
                                // }
                                // else
                                // {
                                // $("#fecha_Alta").addClass("input-valido");
                                evaluarDiferencia = true;
                                // }
                            }
                        }
                        else {
                            // $("#fecha_Alta").addClass("input-valido");
                        }
                        var fechaBaja = $("#fecha_Baja").val();
                        vmJquery.vm.datosBasicos.Fecha_Baja_str = fechaBaja;
                        if (fechaBaja != null && fechaBaja != "" && fechaBaja != undefined) {
                            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                            let regEx = new RegExp(regexStr);
                            if (!regEx.test(fechaBaja)) {
                                $("#errorMessageFechaBaja").addClass("error-mensaje");
                                $("#errorMessageFechaBajaSpan").html("Formato fecha incorrecto");
                                $("#fecha_Baja").addClass("error-validate-fecha");
                            }
                            else {
                                // if(!this._validacionHelper.isDate(fechaBaja))
                                // {
                                //     $("#errorMessageFechaBaja").addClass("error-mensaje");
                                //     $("#errorMessageFechaBajaSpan").html("La fecha es inválida.");
                                //     $("#fecha_Baja").addClass("error-validate-fecha");
                                // }
                                // else
                                // {
                                if (evaluarDiferencia) {
                                    var fechaInicioNumeric = fechaAlta.substring(fechaAlta.length - 4, fechaAlta.length) + fechaAlta.substring(fechaAlta.length - 7, fechaAlta.length - 5) + fechaAlta.substring(fechaAlta.length - 10, fechaAlta.length - 8);
                                    var fechaFinNumeric = fechaBaja.substring(fechaBaja.length - 4, fechaBaja.length) + fechaBaja.substring(fechaBaja.length - 7, fechaBaja.length - 5) + fechaBaja.substring(fechaBaja.length - 10, fechaBaja.length - 8);
                                    if (fechaInicioNumeric >= fechaFinNumeric) {
                                        $("#errorMessageFechaBaja").addClass("error-mensaje");
                                        $("#errorMessageFechaBajaSpan").html("Debe ser mayor a fecha Alta.");
                                        $("#fecha_Baja").addClass("error-validate-fecha");
                                    }
                                }
                                else {
                                    // $("#fecha_Baja").addClass("input-valido");
                                }
                                // }
                            }
                        }
                        else {
                            // $("#fecha_Baja").addClass("input-valido");
                        }
                    }
                    else if (name == "fechaInicio" || name == "fechaFin") {
                        $("#errorMessageFechaInicio" + i).removeClass("error-mensaje");
                        $("#errorMessageFechaInicioSpan" + i).html("");
                        $("#fechaInicio" + i).removeClass("error-validate-fecha");
                        $("#errorMessageFechaFin" + i).removeClass("error-mensaje");
                        $("#errorMessageFechaFinSpan" + i).html("");
                        $("#fechaFin" + i).removeClass("error-validate-fecha");

                        if ($("#id_Base" + i).val() == "0") {
                            $("#fechaInicio" + i).val("");
                            $("#fechaFin" + i).val("");
                            vmJquery.vm.rspDatosPrecios.ListaCategorias[i].Fecha_Inicio_str = "";
                            vmJquery.vm.rspDatosPrecios.ListaCategorias[i].Fecha_Fin_str = "";
                        }
                        else {
                            var fechaIni = $("#fechaInicio" + i).val();
                            vmJquery.vm.rspDatosPrecios.ListaCategorias[i].Fecha_Inicio_str = fechaIni;
                            var evaluarDiferencia = false;
                            if (fechaIni != null && fechaIni != "" && fechaIni != undefined) {
                                let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                                let regEx = new RegExp(regexStr);
                                if (!regEx.test(fechaIni)) {
                                    $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                                    $("#errorMessageFechaInicioSpan" + i).html("Formato fecha incorrecto.");
                                    $("#fechaInicio" + i).addClass("error-validate-fecha");
                                }
                                else {
                                    // if(fechaIni)//Validar isDate Jquery
                                    // {
                                    //     $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                                    //     $("#errorMessageFechaInicioSpan" + i).html("La fecha es inválida.");
                                    //     $("#fechaInicio" + i).addClass("error-validate-fecha");
                                    // }
                                    // else
                                    // {
                                    evaluarDiferencia = true;
                                    // }
                                }
                            }
                            else {
                                $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                                $("#errorMessageFechaInicioSpan" + i).html("La fecha de inicio es obligatoria.");
                                $("#fechaInicio" + i).addClass("error-validate-fecha");
                            }
                            var fechaFin = $("#fechaFin" + i).val();
                            vmJquery.vm.rspDatosPrecios.ListaCategorias[i].Fecha_Fin_str = fechaFin;
                            if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                                let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                                let regEx = new RegExp(regexStr);
                                if (!regEx.test(fechaFin)) {
                                    $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                                    $("#errorMessageFechaFinSpan" + i).html("Formato fecha incorrecto");
                                    $("#fechaFin" + i).addClass("error-validate-fecha");
                                }
                                else {
                                    // if(fechaFin)//Validar isDate Jquery
                                    // {
                                    //     $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                                    //     $("#errorMessageFechaFinSpan" + i).html("La fecha es inválida.");
                                    //     $("#fechaFin"+i).addClass("error-validate-fecha");
                                    // }
                                    // else
                                    // {
                                    if (evaluarDiferencia) {
                                        var fechaInicioNumeric = fechaIni.substring(fechaIni.length - 4, fechaIni.length) + fechaIni.substring(fechaIni.length - 7, fechaIni.length - 5) + fechaIni.substring(fechaIni.length - 10, fechaIni.length - 8);
                                        var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                                        if (fechaInicioNumeric >= fechaFinNumeric) {
                                            $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                                            $("#errorMessageFechaFinSpan" + i).html("Debe ser mayor a fecha inicio.");
                                            $("#fechaFin" + i).addClass("error-validate-fecha");
                                        }
                                    }
                                    else {
                                        // $("#fecha_Baja").addClass("input-valido");
                                    }
                                    // }
                                }
                            }
                            else {
                                $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                                $("#errorMessageFechaFinSpan" + i).html("La fecha de fin es obligatoria.");
                                $("#fechaFin" + i).addClass("error-validate-fecha");
                            }
                        }
                    }
                    else if (this.id == "fechasur_inicio") {

                        $("#errorMessageFechaSurInicio").removeClass("error-mensaje");
                        $("#errorMessageFechaSurInicio").html("");
                        $("#fechasur_inicio").removeClass("error-validate-fecha");


                        var fechaInicio = $("#fechasur_inicio").val();
                        vmJquery.vm.datosSurtidos.FechaSurInicio = fechaInicio;
                        if (fechaInicio != null && fechaInicio != "" && fechaInicio != undefined) {
                            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                            let regEx = new RegExp(regexStr);
                            if (!regEx.test(fechaInicio)) {
                                $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                                $("#errorMessageFechaSurInicio").html("<span>Formato fecha incorrecto</span>");
                                $("#fechasur_inicio").addClass("error-validate-fecha");
                            }
                            else {
                                var fechaFin = $("#Fechasur_fin").val();
                                if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                                    var fechaInicioNumeric = fechaInicio.substring(fechaInicio.length - 4, fechaInicio.length) + fechaInicio.substring(fechaInicio.length - 7, fechaInicio.length - 5) + fechaInicio.substring(fechaInicio.length - 10, fechaInicio.length - 8);
                                    var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                                    if (fechaInicioNumeric >= fechaFinNumeric) {
                                        $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                                        $("#errorMessageFechaSurInicio").html("<span>La fecha inicial tiene que ser menor que la fecha final");
                                        $("#fechasur_inicio").addClass("error-validate-fecha");
                                    }
                                    else {
                                        $("#errorMessageFechaSurFin").removeClass("error-mensaje");
                                        $("#errorMessageFechaSurFin").html("");
                                        $("#Fechasur_fin").removeClass("error-validate-fecha");
                                    }
                                }
                            }
                        }
                        else {
                            $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                            $("#errorMessageFechaSurInicio").html("<span>Campo fecha inicio es obligatorio</span>");
                            $("#fechasur_inicio").addClass("error-validate-fecha");
                        }
                    }
                    else if (this.id == "Fechasur_fin") {

                        $("#errorMessageFechaSurFin").removeClass("error-mensaje");
                        $("#errorMessageFechaSurFin").html("");
                        $("#Fechasur_fin").removeClass("error-validate-fecha");


                        var fechaFin = $("#Fechasur_fin").val();
                        vmJquery.vm.datosSurtidos.FechaSurFin = fechaFin;
                        if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                            let regEx = new RegExp(regexStr);
                            if (!regEx.test(fechaFin)) {
                                $("#errorMessageFechaSurFin").addClass("error-mensaje");
                                $("#errorMessageFechaSurFin").html("<span>Formato fecha incorrecto</span>");
                                $("#Fechasur_fin").addClass("error-validate-fecha");
                            }
                            else {
                                var fechaInicio = $("#fechasur_inicio").val();
                                if (fechaInicio != null && fechaInicio != "" && fechaInicio != undefined) {
                                    var fechaInicioNumeric = fechaInicio.substring(fechaInicio.length - 4, fechaInicio.length) + fechaInicio.substring(fechaInicio.length - 7, fechaInicio.length - 5) + fechaInicio.substring(fechaInicio.length - 10, fechaInicio.length - 8);
                                    var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                                    if (fechaFinNumeric <= fechaInicioNumeric) {
                                        $("#errorMessageFechaSurFin").addClass("error-mensaje");
                                        $("#errorMessageFechaSurFin").html("<span>La fecha final tiene que ser mayor que la fecha inicial");
                                        $("#Fechasur_fin").addClass("error-validate-fecha");
                                    } else {
                                        $("#errorMessageFechaSurInicio").removeClass("error-mensaje");
                                        $("#errorMessageFechaSurInicio").html("");
                                        $("#fechasur_inicio").removeClass("error-validate-fecha");
                                    }
                                }
                            }
                        }
                        else {
                            $("#errorMessageFechaSurFin").addClass("error-mensaje");
                            $("#errorMessageFechaSurFin").html("<span>Campo fecha inicio es obligatorio</span>");
                            $("#Fechasur_fin").addClass("error-validate-fecha");
                        }

                    }
                }

            });

            //evaluar Habilitacion de controles precios
            vmJquery.evaluarHabilitacionControlesPrecios();

        });


    }

    evaluarHabilitacionControlesPrecios() {
        this.vm.rspDatosPrecios.ListaCategorias.forEach((element, i) => {
            if (this.vm.habilitarModificar) {
                var objDiv = $(".niceSelectBasePrecio").siblings("div");
                $(objDiv).css("background-color", "#ffffff");
                $(".niceSelectBasePrecio").removeAttr('disabled');
                $(".niceSelectBasePrecio").removeClass('disabled');

                var objFalta = $("#fecha_Alta").siblings("button");
                var objFbaja = $("#fecha_Baja").siblings("button");
                $(objFalta).removeAttr('disabled');
                $(objFbaja).removeAttr('disabled');

                if (element.Id_Base.toString() == "0") {
                    $("#fechaInicio" + i).prop("readonly", true);
                    $("#fechaFin" + i).prop("readonly", true);
                    $("#fechaInicio" + i).addClass("input-inhabilitado");
                    $("#fechaFin" + i).addClass("input-inhabilitado");
                    $("#datepickerFechaInicio" + i + " button").prop("disabled", true);
                    $("#datepickerFechaFin" + i + " button").prop("disabled", true);
                }
                else {
                    $("#fechaInicio" + i).prop("readonly", false);
                    $("#fechaFin" + i).prop("readonly", false);
                    $("#fechaInicio" + i).removeClass("input-inhabilitado");
                    $("#fechaFin" + i).removeClass("input-inhabilitado");
                    $("#datepickerFechaInicio" + i + " button").prop("disabled", false);
                    $("#datepickerFechaFin" + i + " button").prop("disabled", false);
                }
            }
            else {
                $("#fechaInicio" + i).prop("readonly", true);
                $("#fechaFin" + i).prop("readonly", true);
                $("#fechaInicio" + i).addClass("input-inhabilitado");
                $("#fechaFin" + i).addClass("input-inhabilitado");
                $("#datepickerFechaInicio" + i + " button").prop("disabled", true);
                $("#datepickerFechaFin" + i + " button").prop("disabled", true);

                $(".niceSelectBasePrecio").attr('disabled', 'disabled');
                $(".niceSelectBasePrecio").addClass('disabled');
                var objDiv = $(".niceSelectBasePrecio").siblings("div");
                $(objDiv).css("background-color", "#e5e3df");

                var objFalta = $("#fecha_Alta").siblings("button");
                var objFbaja = $("#fecha_Baja").siblings("button");
                objFalta.attr("disabled", true);
                objFbaja.attr("disabled", true);
            }
        });
    }

    documentReadyValidaciones() {

        $(document).ready(function () {

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

            $('input[type=number]').keydown(function (e) {

                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                    // Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                //Previene cuando no es un número
                if ((e.shiftKey ||
                    (e.keyCode < 48 || e.keyCode > 57))         // sea del 0 al 9
                    && (e.keyCode < 96 || e.keyCode > 105))     // sea del 0 al 9
                {
                    e.preventDefault();
                }

            });

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
                    e.keyCode == 188 ||
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

        });

    }

    documentReadyCombo() {
        let vmJquery = this;
        $(document).ready(function () {
            $('.rps-select').niceSelect();
            $('.niceSelectBasePrecio ul li').on('click', function () {
                var objSelect = this.parentElement.parentElement.previousElementSibling;
                var indexBase = objSelect.id.toString().substring(objSelect.id.length - 1, objSelect.id.length);
                var fechaIni = $("#fechaInicio" + indexBase).val();
                var fechaFin = $("#fechaFin" + indexBase).val();
                vmJquery.vm.rspDatosPrecios.ListaCategorias[indexBase].Id_Base = this.getAttribute("data-value");
                if (this.getAttribute("data-value") == "0") {
                    $("#fechaInicio" + indexBase).val(vmJquery.fechaActual());
                    $("#fechaFin" + indexBase).val("");
                    vmJquery.vm.rspDatosPrecios.ListaCategorias[indexBase].Fecha_Inicio_str = vmJquery.fechaActual();
                    vmJquery.vm.rspDatosPrecios.ListaCategorias[indexBase].Fecha_Fin_str = "";
                    $("#errorMessageFechaInicio" + indexBase).removeClass("error-mensaje");
                    $("#errorMessageFechaInicioSpan" + indexBase).html("");
                    $("#errorMessageFechaFin" + indexBase).removeClass("error-mensaje");
                    $("#errorMessageFechaFinSpan" + indexBase).html("");
                    $("#fechaInicio" + indexBase).removeClass("error-validate-fecha");
                    $("#fechaFin" + indexBase).removeClass("error-validate-fecha");
                    $("#fechaInicio" + indexBase).prop("readonly", true);
                    $("#fechaFin" + indexBase).prop("readonly", true);
                    $("#fechaInicio" + indexBase).addClass("input-inhabilitado");
                    $("#fechaFin" + indexBase).addClass("input-inhabilitado");
                    $("#datepickerFechaInicio" + indexBase + " button").prop("disabled", true);
                    $("#datepickerFechaFin" + indexBase + " button").prop("disabled", true);
                    $("#errorMessageFechaInicio" + indexBase).removeClass("spanErrorFechaPrecio");
                    $("#errorMessageFechaFin" + indexBase).removeClass("spanErrorFechaPrecio");
                }
                else {
                    $("#fechaInicio" + indexBase).prop("readonly", false);
                    $("#fechaFin" + indexBase).prop("readonly", false);
                    $("#fechaInicio" + indexBase).removeClass("input-inhabilitado");
                    $("#fechaFin" + indexBase).removeClass("input-inhabilitado");
                    $("#datepickerFechaInicio" + indexBase + " button").prop("disabled", false);
                    $("#datepickerFechaFin" + indexBase + " button").prop("disabled", false);
                    if (fechaIni == "") {
                        $("#errorMessageFechaInicio" + indexBase).addClass("error-mensaje");
                        $("#errorMessageFechaInicioSpan" + indexBase).html("La fecha de inicio es obligatoria.");
                        $("#fechaInicio" + indexBase).addClass("error-validate-fecha");
                        $("#errorMessageFechaInicio" + indexBase).addClass("spanErrorFechaPrecio");
                    }
                    if (fechaFin == "") {
                        $("#errorMessageFechaFin" + indexBase).addClass("error-mensaje");
                        $("#errorMessageFechaFinSpan" + indexBase).html("La fecha de fin es obligatoria.");
                        $("#fechaFin" + indexBase).addClass("error-validate-fecha");
                        $("#errorMessageFechaFin" + indexBase).addClass("spanErrorFechaPrecio");
                    }
                }

            });
            //Event combo provincia
            $('.niceSelectProvincia ul li').on('click', function () {
                if (this.getAttribute("data-value") == "0") {
                    $("#errorMessageProvincia").addClass("error-mensaje");
                    $("#errorMessageProvinciaSpan").html("El campo provincia es obligatorio.");
                    $("#id_Provincia").addClass("error-validate");
                    $('.niceSelectProvincia').css("border-color", "#e40028");
                    $(".niceSelectProvincia").addClass("error-validate");
                }
                else {
                    $("#errorMessageProvincia").removeClass("error-mensaje");
                    $("#errorMessageProvinciaSpan").html("");
                    $("#id_Provincia").removeClass("error-validate");
                    $('.niceSelectProvincia').css("border-color", "#d5d2cb");
                    $(".niceSelectProvincia").removeClass("error-validate");
                }
            });
            //Event combo pais
            $('.niceSelectPais ul li').on('click', function () {
                if (this.getAttribute("data-value") == "0") {
                    $("#errorMessagePais").addClass("error-mensaje");
                    $("#errorMessagePaisSpan").html("El campo Pais es obligatorio.");
                    $("#pais").addClass("error-validate");
                    $('.niceSelectPais').css("border-color", "#e40028");
                    $(".niceSelectPais").addClass("error-validate");
                }
                else {
                    $("#errorMessagePais").removeClass("error-mensaje");
                    $("#errorMessagePaisSpan").html("");
                    $("#pais").removeClass("error-validate");
                    $('.niceSelectPais').css("border-color", "#d5d2cb");
                    $(".niceSelectPais").removeClass("error-validate");
                }
            });
            //Event combo margen
            $('.niceSelectMargen ul li').on('click', function () {
                if (this.getAttribute("data-value") == "0") {
                    $("#errorMessageMargen").addClass("error-mensaje");
                    $("#errorMessageMargenSpan").html("El margen es obligatorio.");
                    $("#margen").addClass("error-validate");
                    $('.niceSelectMargen').css("border-color", "#e40028");
                    $(".niceSelectMargen").addClass("error-validate");
                }
                else {
                    $("#errorMessageMargen").removeClass("error-mensaje");
                    $("#errorMessageMargenSpan").html("");
                    $("#margen").removeClass("error-validate");
                    $('.niceSelectMargen').css("border-color", "#d5d2cb");
                    $(".niceSelectMargen").removeClass("error-validate");
                }
            });
        });
    }

    documentReadyTableCategoriaBase() {
        let vmJquery = this;
        $(document).ready(function () {
            $('#tablaCategoriaBase').DataTable({
                searching: false,
                info: false,
                pageLength: 7,
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

            var tam = $("#tablaCategoriaBase").DataTable().rows()[0].length;
            if (tam <= 7) {
                $("#tablaCategoriaBase_paginate").hide();
            }

            $('.niceSelectBasePrecio').css(
                {
                    'margin-bottom': '-3px',
                    'margin-top': '-3px',
                }
            );
            $('.datepickerDatosPrecios').css(
                {
                    'margin-bottom': '-36px',
                    'margin-top': '-5px',
                }
            );

            // $('.niceSelectBasePrecio').addClass("ajustNiceSelectPrecios");
            // $('.datepickerDatosPrecios').addClass("ajustCalendarPrecios");

            // $('.niceSelectBasePrecio').css(
            //     {
            //       'margin-bottom': '0em',
            //     //   'margin-top': '3px',
            //     }
            // );
            // $('.datepickerDatosPrecios').css(
            //     {
            //       'margin-bottom': '0em',
            //     }
            // );


        }).on('page.dt', () => {
            vmJquery.documentReadyDatePicker();
            vmJquery.evaluarHabilitacionControlesPrecios();
        }
        )
            .on('order.dt', () => {
                vmJquery.documentReadyDatePicker();
                vmJquery.evaluarHabilitacionControlesPrecios();
            }
            );
    }

    documentReadyTableCaracteristica() {
        let vmJquery = this;
        $(document).ready(function () {
            $('#tablaCaracteristica').DataTable({
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
            if ($("#tablaCaracteristica").DataTable().rows()[0].length > 0 && vmJquery.vm.pageTablaCaracterizaciones != undefined) {
                var tNewPaginacionCaracterizaciones = $('#tablaCaracteristica').DataTable();
                tNewPaginacionCaracterizaciones.page(vmJquery.vm.pageTablaCaracterizaciones).draw('page');
            }

            var tam = $("#tablaCaracteristica").DataTable().rows()[0].length;
            if (tam <= 5) {
                $("#tablaCaracteristica_paginate").hide();
            }

        });
    }


    // documentReadyTable(id) {
    //     let vmJquery = this;
    //     $(document).ready(function () {
    //         $('#' + id).DataTable({
    //             searching: false,
    //             info: false,
    //             pageLength: 5,
    //             lengthChange: false,
    //             paging: true,
    //             language: {
    //                 processing: "Lectura de datos en curso...",
    //                 paginate: {
    //                     previous: "&laquo;",
    //                     next: "&raquo;"
    //                 },
    //                 zeroRecords: "No se encontraron resultados",
    //             }
    //         });
    //         if(id == "tablaCaracteristica" && $("#tablaCaracteristica").DataTable().rows()[0].length > 0 && vmJquery.vm.pageTablaCaracterizaciones != undefined)
    //         {
    //             var tNewPaginacionCaracterizaciones = $('#tablaCaracteristica').DataTable();
    //             tNewPaginacionCaracterizaciones.page(vmJquery.vm.pageTablaCaracterizaciones).draw('page');
    //         }

    //         var tam = $("#" + id).DataTable().rows()[0].length;            
    //         if (tam <= 5) {
    //             $("#" + id + "_paginate").hide();
    //         }

    //     }).on('page.dt', () =>
    //         { 
    //             if(id == "tablaCategoriaBase")
    //             {
    //                 vmJquery.documentReadyDatePicker();
    //                 vmJquery.evaluarHabilitacionControlesPrecios();
    //             }
    //         }
    //     )
    //     .on('order.dt', () =>
    //         { 
    //             if(id == "tablaCategoriaBase")
    //             {
    //                 vmJquery.documentReadyDatePicker();
    //                 vmJquery.evaluarHabilitacionControlesPrecios();
    //             }
    //         }
    //     );

    // }

    inicializarComponenteServices() {

        this.documentReadyValidaciones();

        this.fechaActual();

        var reqProvincias = new RequestProvinciasByIdEmpresa();
        var reqPaises = new RequestPaisesByIdEmpresa();
        var reqTiposCaracterizacion = new RequestTiposCaracterizacionByTipo();
        reqProvincias.Id_Empresa = parseInt(Empresa);
        reqPaises.Id_Empresa = parseInt(Empresa);
        reqTiposCaracterizacion.Id_Empresa = parseInt(Empresa);
        reqTiposCaracterizacion.Tipo = 3;
        var reqCodigoRepsol = new RequestCodigoRepsol();
        reqCodigoRepsol.Id_Empresa = parseInt(Empresa);

        this.vm.loading = true;

        if (this.vm.datosBasicos.Id > 0) {
            var requestEstacionById = new RequestEstacionById();
            requestEstacionById.Id = this.vm.datosBasicos.Id;
            requestEstacionById.Id_Empresa = parseInt(Empresa);
            var responseEstacion = new ResponseEstacion();


            const allrequests = Observable.forkJoin(
                this.provinciasService.getByIdEmpresa(reqProvincias),
                this.paisesService.getByIdEmpresa(reqPaises),
                this.estacionDelegacionAreaService.getAll(),
                this.estacionImagenService.getAll(),
                this.estacionHorarioService.getAll(),
                this.segmentoService.getAll(),
                this.tiposCaracterizacionService.get(reqTiposCaracterizacion),
                this.estacionesService.getCategoriasBase(),
                this.estacionesService.getById(requestEstacionById),
                this.estacionesService.getSugerenciasCodigoRepsol(reqCodigoRepsol)
            );
            allrequests.subscribe(
                latestResults => {
                    this.vm.rspProvincias = latestResults[0];
                    this.vm.rspPaises = latestResults[1];
                    this.vm.rspDelegacionArea = latestResults[2];
                    this.vm.rspImagen = latestResults[3];
                    this.vm.rspHorario = latestResults[4];
                    this.vm.rspSegmento = latestResults[5];
                    this.vm.rpsTiposCaracterizacion = latestResults[6];
                    this.vm.rspDatosPrecios = latestResults[7];
                    responseEstacion = latestResults[8];
                    this.vm.rspSugerenciasCodigosRepsol = latestResults[9];

                    if (responseEstacion.CodigoServicio == "OK") {
                        this.vm.datosBasicos = responseEstacion.Estaciones;
                        this.vm.datosBasicos.Fecha_Alta_str = isNull(this.vm.datosBasicos.Fecha_Alta_str) ? "" : this.vm.datosBasicos.Fecha_Alta_str.substring(0, 10);
                        this.vm.datosBasicos.Fecha_Baja_str = isNull(this.vm.datosBasicos.Fecha_Baja_str) ? "" : this.vm.datosBasicos.Fecha_Baja_str.substring(0, 10);
                        this.asignarAlViewModelListaTiposCaracTerizaciones(responseEstacion.CaracterizacionEstaciones);
                        this.vm.rspDatosPrecios.ListaCategorias = [];
                        this.vm.rspDatosPrecios.ListaCategorias = responseEstacion.EstacionCategoriaBase;

                        this.vm.loading = false;
                    }
                    else {
                        console.log(JSON.stringify(responseEstacion.ListaErrores));
                        this.vm.loading = false;
                    }

                    this.documentReadyCombo();
                    this.documentReadyTableCategoriaBase();//this.documentReadyTable("tablaCategoriaBase");
                    this.documentReadyDatePicker();
                    this.vm.loading = false;
                },
                error => {
                    console.log(error);
                    this.documentReadyCombo();
                    this.documentReadyTableCategoriaBase();//this.documentReadyTable("tablaCategoriaBase");
                    this.documentReadyDatePicker();
                    this.vm.loading = false;
                }
            );
            this.activarDesactivarBotones(true);
        }
        else {
            const allrequests = Observable.forkJoin(
                this.provinciasService.getByIdEmpresa(reqProvincias),
                this.paisesService.getByIdEmpresa(reqPaises),
                this.estacionDelegacionAreaService.getAll(),
                this.estacionImagenService.getAll(),
                this.estacionHorarioService.getAll(),
                this.segmentoService.getAll(),
                this.tiposCaracterizacionService.get(reqTiposCaracterizacion),
                this.estacionesService.getCategoriasBase(),
                this.estacionesService.getSugerenciasCodigoRepsol(reqCodigoRepsol)
            );
            allrequests.subscribe(
                latestResults => {
                    this.vm.rspProvincias = latestResults[0];
                    this.vm.rspPaises = latestResults[1];
                    this.vm.rspDelegacionArea = latestResults[2];
                    this.vm.rspImagen = latestResults[3];
                    this.vm.rspHorario = latestResults[4];
                    this.vm.rspSegmento = latestResults[5];
                    this.vm.rpsTiposCaracterizacion = latestResults[6];
                    this.vm.rspDatosPrecios = latestResults[7];
                    this.vm.rspSugerenciasCodigosRepsol = latestResults[8];

                    this.documentReadyCombo();
                    this.documentReadyTableCaracteristica();
                    this.documentReadyTableCategoriaBase();
                    this.documentReadyDatePicker();
                    this.vm.loading = false;
                },
                error => {
                    console.log(error);
                    this.documentReadyCombo();
                    this.documentReadyTableCaracteristica();
                    this.documentReadyTableCategoriaBase();
                    this.documentReadyDatePicker();
                    this.vm.loading = false;
                }
            );
            this.activarDesactivarBotones(true);
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

    seleccionarProvincia() {

        var reqProvincias = new RequestProvinciasByIdEmpresa();
        reqProvincias.Id_Empresa = 1;

        // if (parseInt(this.vm.datosBasicos.Codigo_Postal) < 1000 || parseInt(this.vm.datosBasicos.Codigo_Postal) > 52999)
        //     this.vm.validarCodigoPostal = false;
        // else
        //     this.vm.validarCodigoPostal = true;


        // var tam = this.vm.datosBasicos.Codigo_Postal.length;
        // var texto = this.vm.datosBasicos.Codigo_Postal;
        // if (tam == 5 && this.isInteger(texto)) {
        var codigo = this.vm.datosBasicos.Codigo_Postal.substring(0, 2);
        var idSeleccion = 0;
        var nombre = "";
        for (let index = 0; index < this.vm.rspProvincias.ListaProvincias.length; index++) {
            const element = this.vm.rspProvincias.ListaProvincias[index];
            if (element.Codigo_Postal == codigo && element.Id_Empresa == reqProvincias.Id_Empresa) {
                idSeleccion = element.Id;
                nombre = element.Nombre;
                break
            }
        }
        this.vm.datosBasicos.Id_Provincia = idSeleccion;
        $("#id_Provincia").val(idSeleccion);
        var objDiv = $("#id_Provincia").siblings("div");
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
            } else {
                $(element).removeClass("selected");
                $(element).removeClass("focus");
            }


        }
        // }
    }

    asignarIdBaseToVM(i: number) {
        // var i : number=0;
        var idCombo = "id_Base" + i.toString();
        this.vm.rspDatosPrecios.ListaCategorias[i].Id_Base = $("#" + idCombo).val();
    }

    guardarEstaciones(content) {

        //Validar todos los campos obligatorios
        if (this.validarAllVista()) {
            this.vm.loading = true;
            try {
                var requestCodigoRepsol = new RequestCodigoRepsol();
                requestCodigoRepsol.Id = this.vm.datosBasicos.Id;
                requestCodigoRepsol.Id_Empresa = parseInt(Empresa);
                requestCodigoRepsol.Codigo_Repsol = this.vm.datosBasicos.Codigo_Repsol;
                requestCodigoRepsol.Margen = $("#margen").val() == null ? null : parseInt(($("#margen").val()).toString());
                this.estacionesService.validarCodigoRepsol(requestCodigoRepsol).subscribe(
                    responseValidar => {
                        if (responseValidar.CodigoServicio == "OK" && responseValidar.ExistCodigoRepsol == 0) {

                            var request = new RequestEstacion();
                            var response = new ResponseEstacion();

                            try {
                                request.Estaciones = this.vm.datosBasicos;
                                request.Estaciones.Id_Empresa = 1;

                                request.Estaciones.Id_Provincia = $("#id_Provincia").val() == null ? null : parseInt(($("#id_Provincia").val()).toString());
                                request.Estaciones.Pais = $("#pais").val() == null ? null : parseInt(($("#pais").val()).toString());
                                request.Estaciones.Margen = $("#margen").val() == null ? null : parseInt(($("#margen").val()).toString());
                                request.Estaciones.Id_Imagen = ($("#id_Imagen").val() == null || $("#id_Imagen").val() == "0") ? null : parseInt(($("#id_Imagen").val()).toString());
                                request.Estaciones.Id_Delegacion_Area = ($("#id_Delegacion_Area").val() == null || $("#id_Delegacion_Area").val() == "0") ? null : parseInt(($("#id_Delegacion_Area").val()).toString());
                                request.Estaciones.Id_Horario = ($("#id_Horario").val() == null || $("#id_Horario").val() == "0") ? null : parseInt(($("#id_Horario").val()).toString());
                                request.Estaciones.Id_Segmento = ($("#id_Segmento").val() == null || $("#id_Segmento").val() == "0") ? null : parseInt(($("#id_Segmento").val()).toString());
                                request.Estaciones.Punto_Operacional = ($("#punto_Operacional").val() == null || $("#punto_Operacional").val() == "") ? null : parseInt(($("#punto_Operacional").val()).toString());
                                request.Estaciones.Fecha_Alta_str = $("#fecha_Alta").val();
                                request.Estaciones.Fecha_Baja_str = $("#fecha_Baja").val();

                                //llenar las caracterizaciones
                                let objCaracterizacion: CaracterizacionEstaciones;
                                this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.filter(x => x.ID_CARACTERISTICA > 0).forEach(element => {
                                    objCaracterizacion = new CaracterizacionEstaciones();
                                    objCaracterizacion.Id_Empresa = 1;
                                    objCaracterizacion.Id_Caracterizacion = element.ID_CARACTERISTICA;
                                    request.CaracterizacionEstaciones.push(objCaracterizacion);
                                });

                                //llenar los datos de precios
                                let objEstacionCategoriaBase: EstacionCategoriaBase;
                                // var idCombo = "";
                                this.vm.rspDatosPrecios.ListaCategorias.forEach((element, i) => {
                                    if (element.Id_Base.toString() != "0") {
                                        objEstacionCategoriaBase = new EstacionCategoriaBase();
                                        objEstacionCategoriaBase.Id_Categoria = element.Id_Categoria;
                                        objEstacionCategoriaBase.Id_Base = element.Id_Base;
                                        objEstacionCategoriaBase.Fecha_Inicio_str = element.Fecha_Inicio_str;
                                        objEstacionCategoriaBase.Fecha_Fin_str = element.Fecha_Fin_str;
                                        request.EstacionCategoriaBase.push(objEstacionCategoriaBase);
                                    }
                                    // idCombo = "id_Base" + i.toString();
                                    // if ($("#" + idCombo).val() != null && $("#" + idCombo).val() != "0") {
                                    //     objEstacionCategoriaBase = new EstacionCategoriaBase();
                                    //     objEstacionCategoriaBase.Id_Categoria = element.Id_Categoria;
                                    //     objEstacionCategoriaBase.Id_Base = $("#" + idCombo).val();
                                    //     objEstacionCategoriaBase.Fecha_Inicio_str = $("#fechaInicio"+i).val()==""?null:$("#fechaInicio"+i).val();
                                    //     objEstacionCategoriaBase.Fecha_Fin_str = $("#fechaFin"+i).val()==""?null:$("#fechaFin"+i).val();
                                    //     request.EstacionCategoriaBase.push(objEstacionCategoriaBase);
                                    // }
                                });

                                if (this.vm.datosBasicos.Id > 0) {

                                    this.estacionesService.update(request).subscribe(
                                        estacion => {
                                            response = estacion;
                                            if (response.CodigoServicio == "OK") {
                                                this.vm.datosBasicos = response.Estaciones;
                                                this.vm.datosBasicos.Fecha_Alta_str = isNull(this.vm.datosBasicos.Fecha_Alta_str) ? "" : this.vm.datosBasicos.Fecha_Alta_str.substring(0, 10);
                                                this.vm.datosBasicos.Fecha_Baja_str = isNull(this.vm.datosBasicos.Fecha_Baja_str) ? "" : this.vm.datosBasicos.Fecha_Baja_str.substring(0, 10);
                                                // this.vm.rspDatosPrecios.ListaCategorias = [];
                                                // this.vm.rspDatosPrecios.ListaCategorias = response.EstacionCategoriaBase;
                                                this.vm.resul = "La estación se ha actualizado correctamente.";
                                                this.modalService.open(content, { centered: true, size: 'sm' });
                                                // this.documentReady(false,false);
                                                this.vm.loading = false;

                                                this.activarDesactivarBotones(false);
                                            }
                                            else {
                                                console.log(JSON.stringify(response.ListaErrores));
                                                this.vm.resul = "Ocurrió un error al actualizar la estación.";
                                                this.modalService.open(content, { centered: true, size: 'sm' });
                                                this.vm.loading = false;
                                            }

                                        }
                                    );

                                }
                                else {

                                    this.estacionesService.create(request).subscribe(
                                        proveedor => {
                                            response = proveedor;
                                            if (response.CodigoServicio == "OK") {
                                                this.vm.datosBasicos = response.Estaciones;
                                                this.vm.datosBasicos.Fecha_Alta_str = isNull(this.vm.datosBasicos.Fecha_Alta_str) ? "" : this.vm.datosBasicos.Fecha_Alta_str.substring(0, 10);
                                                this.vm.datosBasicos.Fecha_Baja_str = isNull(this.vm.datosBasicos.Fecha_Baja_str) ? "" : this.vm.datosBasicos.Fecha_Baja_str.substring(0, 10);
                                                // this.vm.rspDatosPrecios.ListaCategorias = [];
                                                // this.vm.rspDatosPrecios.ListaCategorias = response.EstacionCategoriaBase;
                                                this.vm.resul = "La estación se ha guardado correctamente.";
                                                this.modalService.open(content, { centered: true, size: 'sm' });
                                                // this.documentReady(false,false);
                                                this.vm.loading = false;

                                                this.activarDesactivarBotones(false);
                                            }
                                            else {
                                                console.log(JSON.stringify(response.ListaErrores));
                                                this.vm.resul = "Ocurrió un error al registrar la estación.";
                                                this.modalService.open(content, { centered: true, size: 'sm' });
                                                this.vm.loading = false;
                                            }

                                        }
                                    );

                                }

                            } catch (error) {
                                console.log(JSON.stringify(error));
                                this.vm.resul = "Ocurrió un error. Por favor intente más tarde.";
                                this.modalService.open(content, { centered: true, size: 'sm' });
                                this.vm.loading = false;
                            }

                        }
                        else if (responseValidar.CodigoServicio == "OK" && responseValidar.ExistCodigoRepsol == 1) {
                            this.vm.resul = "La estación " + this.vm.datosBasicos.Codigo_Repsol + " ya está dada de alta para el margen seleccionado";
                            this.modalService.open(content, { centered: true, size: 'sm' });
                            this.vm.loading = false;
                        }
                        else {
                            this.vm.resul = "Ocurrió un error al validar la estación " + this.vm.datosBasicos.Codigo_Repsol + " para el margen seleccionado.";
                            this.modalService.open(content, { centered: true, size: 'sm' });
                            this.vm.loading = false;
                        }
                    },
                    errorValidar => {
                        console.log(JSON.stringify(errorValidar));
                        this.vm.resul = " Ocurrió un error al validar el Código Repsol.";
                        this.modalService.open(content, { centered: true, size: 'sm' });
                        this.vm.loading = false;
                    }
                );

            } catch (errorValidacion) {
                console.log(JSON.stringify(errorValidacion));
                this.vm.resul = " Ocurrió un error al validar el Código Repsol.";
                this.modalService.open(content, { centered: true, size: 'sm' });
                this.vm.loading = false;
            }
        }
    }


    inicializarListaTiposCaracterizacion() {

        for (let index = 0; index < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            element.ID_CARACTERISTICA = -1;
        }
    }

    obtenerNombreTipoCaracterizacion(id: number) {

        var nombre = "";

        for (let index = 0; index < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            if (element.ID == id) {
                nombre = element.NOMBRE;
                break;
            }

        }

        return nombre;

    }

    validarSegunTipoCaracterizacion(id: number) {

        if (id == 1 || id == 3 || id == 15) {
            this.vm.validarSelectTodas = true;
        }
        else {
            this.vm.validarSelectTodas = false;
        }

    }

    mostrarCaracterizaciones(id: number) {

        $("#btnAsignarCaract").attr("data-ng-value", id.toString());
        var nombre = "";
        var reqCaracterizacion = new RequestCaracterizacionByIdTipo();
        nombre = this.obtenerNombreTipoCaracterizacion(id);
        this.validarSegunTipoCaracterizacion(id);
        this.vm.nombreTipCaract = nombre;
        reqCaracterizacion.IdTipo = id;
        reqCaracterizacion.Id_Empresa = 1;
        this.vm.rpsCaracterizacion.ListaCaracterizaciones = [];


        this.vm.loading = true;
        this.caracterizacionesService.get(reqCaracterizacion).subscribe(
            response => {
                this.vm.rpsCaracterizacion = response;
                if (this.vm.rpsCaracterizacion.CodigoServicio == "OK") {

                    for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                        const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
                        if (this.existeElementSelecTiposCaract(element.ID)) {
                            element.SELECTED = true;
                        }
                        else element.SELECTED = false;

                    }
                    this.verificarSelCaract("0", "0");
                    this.vm.loading = false;
                }
                else {
                    console.log(JSON.stringify(this.vm.rpsCaracterizacion.ListaErrores));
                    this.vm.loading = false;
                }
            }
        );
    }

    verificarSelCaract(idTipo: string, id: string) {

        if (idTipo == "1" || idTipo == "3" || idTipo == "15") {

            for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
                if (parseInt(id) != element.ID) {
                    element.SELECTED = false;
                }
            }

        }
        else {
            var estado = false;
            var cantSel = 0;
            var cant = 0;
            cant = this.vm.rpsCaracterizacion.ListaCaracterizaciones.length;

            for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
                if (element.SELECTED) {
                    cantSel = cantSel + 1;
                }
            }

            if (cant == cantSel) estado = true;

            if (estado) {
                this.vm.rpsCaracterizacion.Selected = true;
            }
            else {
                this.vm.rpsCaracterizacion.Selected = false;
            }
        }

    }

    selAllCaracterizacion() {

        var estado = false;

        if (this.vm.rpsCaracterizacion.Selected)
            estado = true;

        for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
            element.SELECTED = estado;
        }
    }

    existeElementSelecCaract(id: number) {

        var estado = false;
        for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
            if (element.SELECTED && element.ID_TIPO == id) {
                estado = true;
                break;
            }
        }

        return estado;
    }

    existeElementSelecTiposCaract(id: number) {

        var estado = false;
        for (let index = 0; index < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[index];
            if (element.ID_CARACTERISTICA == id) {
                estado = true;
                break;
            }
        }

        return estado;
    }

    existeElementSelecCaractEstacion(id: number, lista: CaracterizacionEstaciones[]) {

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

        for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
            const element = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
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
            for (let i = 0; i < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
                const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

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
            this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
            this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
            this.documentReadyTableCaracteristica();//this.documentReadyTable("tablaCaracteristica");            

        }
        else {

            var ListaTiposCaracterizacion: TiposCaracterizacion[];
            ListaTiposCaracterizacion = [];

            var idTemp = 0;
            var idTemporal2 = 0;

            for (let i = 0; i < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
                const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[i];


                if (this.existeElementSelecCaract(element.ID)) {
                    if (element.ID != idTemp) {
                        var idTemporal1 = 0;
                        for (let index = 0; index < this.vm.rpsCaracterizacion.ListaCaracterizaciones.length; index++) {
                            const elementCaract = this.vm.rpsCaracterizacion.ListaCaracterizaciones[index];
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
            this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
            this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
            this.documentReadyTableCaracteristica();//this.documentReadyTable("tablaCaracteristica");

        }


    }

    obtenerListaTiposCaractAlRequest(id_Empresa: number) {

        let listaCaracterizacionProveedores: CaracterizacionEstaciones[];
        listaCaracterizacionProveedores = [];

        for (let index = 0; index < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; index++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[index];

            if (element.ID_CARACTERISTICA != -1) {
                var caracterizacionProveedores = new CaracterizacionEstaciones;
                caracterizacionProveedores.Id_Caracterizacion = element.ID_CARACTERISTICA;
                caracterizacionProveedores.Id_Empresa = id_Empresa;
                listaCaracterizacionProveedores.push(caracterizacionProveedores);
            }
        }

        return listaCaracterizacionProveedores;
    }

    asignarAlViewModelListaTiposCaracTerizaciones(lista: CaracterizacionEstaciones[]) {

        var ListaTiposCaracterizacion: TiposCaracterizacion[];
        ListaTiposCaracterizacion = [];

        var idTemp = 0;
        var idTemporal2 = 0;

        for (let i = 0; i < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

            if (this.existeElementSelecCaractEstacion(element.ID, lista)) {
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
        this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = [];
        this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion = ListaTiposCaracterizacion;
        this.documentReadyTableCaracteristica();//this.documentReadyTable("tablaCaracteristica");


    }

    mostrarAltaArticuloForm() {

        this.router.navigate(['../../promociones/promociones']);
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
            this.vm.ListaCodigosRepsol = this.filtrarPorNombre(buscarSugerencia).splice(0, 8);
        }, this.vm.timer.search.ms);
    };


    filtrarPorNombre(obj) {
        var listaSugeridos: Estaciones[] = [];
        this.vm.ListaCodigosRepsol = this.vm.rspSugerenciasCodigosRepsol.ListaSugerencias.filter((el) => {
            return el.Codigo_Repsol.includes(obj.toLocaleUpperCase());
        });

        for (let index = 0; index < this.vm.ListaCodigosRepsol.length; index++) {
            const element = this.vm.ListaCodigosRepsol[index];
            if (index < 5) {
                var estacion = new Estaciones();
                estacion.Codigo_Repsol = element.Codigo_Repsol;
                listaSugeridos.push(estacion);
            }
        }

        this.vm.ListaCodigosRepsol = [];
        this.vm.ListaCodigosRepsol = listaSugeridos;

        return this.vm.ListaCodigosRepsol;
    }


    confirmSearch(inputBusqueda, busqueda) {
        this.vm.datosBasicos.Codigo_Repsol = busqueda;
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

            $("#id_Provincia").removeAttr('disabled');
            var objDiv = $("#id_Provincia").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#pais").removeAttr('disabled');
            var objDiv = $("#pais").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#margen").removeAttr('disabled');
            var objDiv = $("#margen").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#id_Delegacion_Area").removeAttr('disabled');
            var objDiv = $("#id_Delegacion_Area").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#id_Imagen").removeAttr('disabled');
            var objDiv = $("#id_Imagen").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#id_Horario").removeAttr('disabled');
            var objDiv = $("#id_Horario").siblings("div");
            $(objDiv).removeClass("disabled");

            $("#id_Segmento").removeAttr('disabled');
            var objDiv = $("#id_Segmento").siblings("div");
            $(objDiv).removeClass("disabled");
        }
        else {
            this.vm.habilitarGuardar = true;
            this.vm.habilitarModificar = false;
            this.vm.habilitarCodigoRepsol = false;

            this.reactivarColorDatosCaraterizacion(false);

            this.vm.validarCodigoPostal = true;

            $("#id_Provincia").attr('disabled', 'disabled');
            var objDiv = $("#id_Provincia").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#pais").attr('disabled', 'disabled');
            var objDiv = $("#pais").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#margen").attr('disabled', 'disabled');
            var objDiv = $("#margen").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#id_Delegacion_Area").attr('disabled', 'disabled');
            var objDiv = $("#id_Delegacion_Area").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#id_Imagen").attr('disabled', 'disabled');
            var objDiv = $("#id_Imagen").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#id_Horario").attr('disabled', 'disabled');
            var objDiv = $("#id_Horario").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");

            $("#id_Segmento").attr('disabled', 'disabled');
            var objDiv = $("#id_Segmento").siblings("div");
            $(objDiv).addClass("disabled");
            $(objDiv).css("background-color", "#e5e3df");
        }
        this.evaluarHabilitacionControlesPrecios();
    }

    reactivarColorDatosCaraterizacion(estado: boolean) {

        var idTemporal2 = 0;

        for (let i = 0; i < this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.length; i++) {
            const element = this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion[i];

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
        this.vm.habilitarCodigoRepsol = false;

        this.reactivarColorDatosCaraterizacion(true);

        $("#id_Provincia").removeAttr('disabled');
        var objDiv = $("#id_Provincia").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#pais").removeAttr('disabled');
        var objDiv = $("#pais").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#margen").removeAttr('disabled');
        var objDiv = $("#margen").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#id_Delegacion_Area").removeAttr('disabled');
        var objDiv = $("#id_Delegacion_Area").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#id_Imagen").removeAttr('disabled');
        var objDiv = $("#id_Imagen").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#id_Horario").removeAttr('disabled');
        var objDiv = $("#id_Horario").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        $("#id_Segmento").removeAttr('disabled');
        var objDiv = $("#id_Segmento").siblings("div");
        $(objDiv).removeClass("disabled");
        $(objDiv).css("background-color", "#ffffff");


        // $(".niceSelectBasePrecio").removeAttr('disabled');
        // $(".niceSelectBasePrecio").removeClass('disabled');
        // var objDiv = $(".niceSelectBasePrecio").siblings("div");
        // $(objDiv).css("background-color", "#ffffff");

        this.evaluarHabilitacionControlesPrecios();
    }


    validarAllVista() {
        let valid: boolean = false;

        // $("#errorMessageCaracteristica").removeClass("error-validate");
        $("#errorMessageCaracteristica").removeClass("alert alert-danger");
        $("#errorMessageCaracteristica").html("");
        $("#errorMessageCaracteristicaSpan").html("");
        var areaGeoSeleccionado = false;
        var surtidoSeleccionado = false;
        this.vm.rpsTiposCaracterizacion.ListaTiposCaracterizacion.forEach(element => {
            if (element.ID == 1 && element.ID_CARACTERISTICA != undefined && element.ID_CARACTERISTICA != -1) {
                areaGeoSeleccionado = true;
            }
            if (element.ID == 3 && element.ID_CARACTERISTICA != undefined && element.ID_CARACTERISTICA != -1) {
                surtidoSeleccionado = true;
            }
        });
        if (!areaGeoSeleccionado || !surtidoSeleccionado) {
            if (!areaGeoSeleccionado) {
                $("#errorMessageCaracteristica").addClass("alert alert-danger");
                $("#errorMessageCaracteristica").html("La característica Área Geográfica es obligatorio.");
                $("#errorMessageCaracteristicaSpan").html("¡Advertencia!");
            }

            // if(!areaGeoSeleccionado && !surtidoSeleccionado)
            // {
            //     $("#errorMessageCaracteristica").addClass("alert alert-danger");
            //     $("#errorMessageCaracteristica").html("Las características Área Geográfica y Surtido son obligatorios.");
            //     $("#errorMessageCaracteristicaSpan").html("¡Advertencia!");
            //     // $("#errorMessageCaracteristica").html("<span class='texto-resaltado-alerta'>¡Ouch!</span> Las caracteristicas Area Geografica y Surtido son obligatorios.");
            // }
            // else if(!areaGeoSeleccionado && surtidoSeleccionado)
            // {
            //     $("#errorMessageCaracteristica").addClass("alert alert-danger");
            //     $("#errorMessageCaracteristica").html("La característica Área Geográfica es obligatorio.");
            //     $("#errorMessageCaracteristicaSpan").html("¡Advertencia!");
            // }
            // else if(!surtidoSeleccionado && areaGeoSeleccionado)
            // {
            //     $("#errorMessageCaracteristica").addClass("alert alert-danger");
            //     $("#errorMessageCaracteristica").html("La característica Surtido es obligatorio.");
            //     $("#errorMessageCaracteristicaSpan").html("¡Advertencia!");
            // }
        }

        //Validar Codigo Empresa
        this.codigoEmpresaValidate();

        //Validar codigo instalacion
        this.codigoInstalacionValidate();

        //Validar ceco
        this.cecoValidate();

        //Validar ctc
        this.ctcValidate();

        //Validar nombre comercial
        this.nombreComercialValidate();

        //Validar razon social
        this.razonSocialValidate();

        //Validar direccion
        this.direccionValidate();

        //Validar codigo postal
        this.codigoPostalValidate();

        //Validar localidad
        this.localidadValidate();

        //Validar Punto Operacional
        this.puntoOperacionalValidate();

        //Validar Jefe Regional
        this.jefeRegionalValidate();

        //Validar Jefe Provincial
        this.jefeProvincialValidate();

        //Validar Jefe de zona
        this.jefeZonaValidate();

        //Validar Fecha Alta
        this.fechaAltaBajaValidate();

        //Validar Combo Provincia
        if ($("#id_Provincia").val() == "0") {
            $("#errorMessageProvincia").addClass("error-mensaje");
            $("#errorMessageProvinciaSpan").html("El campo provincia es obligatorio.");
            $("#id_Provincia").addClass("error-validate");
            $('.niceSelectProvincia').css("border-color", "#e40028");
            $(".niceSelectProvincia").addClass("error-validate");
        }

        //Validar Combo Pais
        if ($("#pais").val() == "0") {
            $("#errorMessagePais").addClass("error-mensaje");
            $("#errorMessagePaisSpan").html("El campo Pais es obligatorio.");
            $("#pais").addClass("error-validate");
            $('.niceSelectPais').css("border-color", "#e40028");
            $(".niceSelectPais").addClass("error-validate");
        }

        //Validar Combo Margen
        if ($("#margen").val() == "0") {
            $("#errorMessageMargen").addClass("error-mensaje");
            $("#errorMessageMargenSpan").html("El campo Margen es obligatorio.");
            $("#margen").addClass("error-validate");
            $('.niceSelectMargen').css("border-color", "#e40028");
            $(".niceSelectMargen").addClass("error-validate");
        }

        //validar precios
        var elementosWithError = $(".error-validate");
        var elementosWithErrorFecha = $(".error-validate-fecha");
        var elementosWithErrorAlert = $(".alert-danger");
        if (elementosWithError.length > 0 || elementosWithErrorAlert.length > 0 || elementosWithErrorFecha.length > 0) {
            // elementosWithError[0].focus();
            valid = false;
        }
        else {
            valid = true;
        }
        return valid;
    }


    //Region Validates
    codigoEmpresaValidate() {
        $("#errorMessageCodigoRepsol").removeClass("error-mensaje");
        $("#errorMessageCodigoRepsolSpan").html("");
        $("#codigo_Repsol").removeClass("error-validate");
        $("#codigo_Repsol").removeClass("input-valido");
        if (this.vm.datosBasicos.Codigo_Repsol == null || this.vm.datosBasicos.Codigo_Repsol == "" || this.vm.datosBasicos.Codigo_Repsol == undefined) {
            $("#errorMessageCodigoRepsol").addClass("error-mensaje");
            $("#errorMessageCodigoRepsolSpan").html("El campo Cod. Empresa es obligatorio.");
            $("#codigo_Repsol").addClass("error-validate");
        }
        else {
            // let regexStr = /^[A-Za-z\d]*$/;///[a-zA-Z0-9]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Codigo_Repsol))
            // {
            //     $("#errorMessageCodigoRepsol").addClass("error-mensaje");
            //     $("#errorMessageCodigoRepsolSpan").html("Debe ingresar solo números y letras");
            //     $("#codigo_Repsol").addClass("error-validate");
            // }
            // else
            // {
            $("#codigo_Repsol").addClass("input-valido");
            // }
        }
    }

    codigoInstalacionValidate() {
        $("#errorMessageCodigoInstalacion").removeClass("error-mensaje");
        $("#errorMessageCodigoInstalacionSpan").html("");
        $("#cod_Instalacion").removeClass("error-validate");
        $("#cod_Instalacion").removeClass("input-valido");
        if (this.vm.datosBasicos.Cod_Instalacion != null && this.vm.datosBasicos.Cod_Instalacion != "" && this.vm.datosBasicos.Cod_Instalacion != undefined) {
            // let regexStr = /^[A-Za-z\d]*$/;///[a-zA-Z0-9]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Cod_Instalacion))
            // {
            //     $("#errorMessageCodigoInstalacion").addClass("error-mensaje");
            //     $("#errorMessageCodigoInstalacionSpan").html("Debe ingresar solo números y letras");
            //     $("#cod_Instalacion").addClass("error-validate");
            // }
            // else
            // {
            $("#cod_Instalacion").addClass("input-valido");
            // }
        }
        // else 
        // {
        //     $("#cod_Instalacion").addClass("input-valido");
        // }
    }

    cecoValidate() {
        //Validar ceco
        $("#errorMessageCeco").removeClass("error-mensaje");
        $("#errorMessageCecoSpan").html("");
        $("#ceco").removeClass("error-validate");
        $("#ceco").removeClass("input-valido");
        if (this.vm.datosBasicos.Ceco != null && this.vm.datosBasicos.Ceco != "" && this.vm.datosBasicos.Ceco != undefined) {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Ceco))
            // {
            //     $("#errorMessageCeco").addClass("error-mensaje");
            //     $("#errorMessageCecoSpan").html("Debe ingresar solo números y letras");
            //     $("#ceco").addClass("error-validate");
            // }
            // else
            // {
            $("#ceco").addClass("input-valido");
            // }
        }
        // else
        // {
        //     $("#ceco").addClass("input-valido");
        // }
    }

    ctcValidate() {
        //Validar ctc
        $("#errorMessageCtc").removeClass("error-mensaje");
        $("#errorMessageCtcSpan").html("");
        $("#ctc").removeClass("error-validate");
        $("#ctc").removeClass("input-valido");
        if (this.vm.datosBasicos.Ctc != null && this.vm.datosBasicos.Ctc != "" && this.vm.datosBasicos.Ctc != undefined) {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Ctc))
            // {
            //     $("#errorMessageCtc").addClass("error-mensaje");
            //     $("#errorMessageCtcSpan").html("Debe ingresar solo números y letras");
            //     $("#ctc").addClass("error-validate");
            // }
            // else
            // {
            $("#ctc").addClass("input-valido");
            // }
        }
        // else
        // {
        //     $("#ctc").addClass("input-valido");
        // }
    }

    nombreComercialValidate() {
        //Validar nombre comercial
        $("#errorMessageNombreComercial").removeClass("error-mensaje");
        $("#errorMessageNombreComercialSpan").html("");
        $("#nombre_Comercial").removeClass("error-validate");
        $("#nombre_Comercial").removeClass("input-valido");
        if (this.vm.datosBasicos.Nombre_Comercial == null || this.vm.datosBasicos.Nombre_Comercial == "" || this.vm.datosBasicos.Nombre_Comercial == undefined) {
            $("#errorMessageNombreComercial").addClass("error-mensaje");
            $("#errorMessageNombreComercialSpan").html("El campo Nombre Comercial es obligatorio.");
            $("#nombre_Comercial").addClass("error-validate");
        }
        else {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Nombre_Comercial))
            // {
            //     $("#errorMessageNombreComercial").addClass("error-mensaje");
            //     $("#errorMessageNombreComercialSpan").html("Debe ingresar solo números y letras");
            //     $("#nombre_Comercial").addClass("error-validate");
            // }
            // else
            // {
            $("#nombre_Comercial").addClass("input-valido");
            // }
        }
    }

    razonSocialValidate() {
        //Validar razon social
        $("#errorMessageRazonSocial").removeClass("error-mensaje");
        $("#errorMessageRazonSocialSpan").html("");
        $("#razon_Social").removeClass("error-validate");
        $("#razon_Social").removeClass("input-valido");
        if (this.vm.datosBasicos.Razon_Social == null || this.vm.datosBasicos.Razon_Social == "" || this.vm.datosBasicos.Razon_Social == undefined) {
            $("#errorMessageRazonSocial").addClass("error-mensaje");
            $("#errorMessageRazonSocialSpan").html("El campo Razón Social es obligatorio.");
            $("#razon_Social").addClass("error-validate");
        }
        else {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Razon_Social))
            // {
            //     $("#errorMessageRazonSocial").addClass("error-mensaje");
            //     $("#errorMessageRazonSocialSpan").html("Debe ingresar solo números y letras");
            //     $("#razon_Social").addClass("error-validate");
            // }
            // else
            // {
            $("#razon_Social").addClass("input-valido");
            // }
        }
    }

    direccionValidate() {
        //Validar direccion
        $("#errorMessageDireccion").removeClass("error-mensaje");
        $("#errorMessageDireccionSpan").html("");
        $("#direccion").removeClass("error-validate");
        $("#direccion").removeClass("input-valido");
        if (this.vm.datosBasicos.Direccion == null || this.vm.datosBasicos.Direccion == "" || this.vm.datosBasicos.Direccion == undefined) {
            $("#errorMessageDireccion").addClass("error-mensaje");
            $("#errorMessageDireccionSpan").html("El campo Dirección es obligatorio.");
            $("#direccion").addClass("error-validate");
        }
        else {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Direccion))
            // {
            //     $("#errorMessageDireccion").addClass("error-mensaje");
            //     $("#errorMessageDireccionSpan").html("Debe ingresar solo números y letras");
            //     $("#direccion").addClass("error-validate");
            // }
            // else
            // {
            $("#direccion").addClass("input-valido");
            // }
        }
    }

    codigoPostalValidate() {
        //Validar codigo postal
        $("#errorMessageCodigoPostal").removeClass("error-mensaje");
        $("#errorMessageCodigoPostalSpan").html("");
        $("#codigo_Postal").removeClass("error-validate");
        $("#codigo_Postal").removeClass("input-valido");
        // $("#id_Provincia").val("0");
        // this.vm.datosBasicos.Id_Provincia = 0;
        $("#errorMessageProvincia").removeClass("error-mensaje");
        $("#errorMessageProvinciaSpan").html("");
        $("#id_Provincia").removeClass("error-validate");
        $('.niceSelectProvincia').css("border-color", "#d5d2cb");
        $(".niceSelectProvincia").removeClass("error-validate");
        if (this.vm.datosBasicos.Codigo_Postal == null || this.vm.datosBasicos.Codigo_Postal == "" || this.vm.datosBasicos.Codigo_Postal == undefined) {
            $("#errorMessageCodigoPostal").addClass("error-mensaje");
            $("#errorMessageCodigoPostalSpan").html("El campo Código Postal es obligatorio.");
            $("#codigo_Postal").addClass("error-validate");
            // $("#id_Provincia").val("0");
            // this.vm.datosBasicos.Id_Provincia = 0;
            // $("#errorMessageProvincia").addClass("error-mensaje");
            // $("#errorMessageProvinciaSpan").html("Ingrese un Codigo Postal válido.");
            // $("#id_Provincia").addClass("error-validate");
            // $('.niceSelectProvincia').css("border-color", "#e40028");
            // $(".niceSelectProvincia").addClass("error-validate");
        }
        else {
            let regexStr = /(\d{5})/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(this.vm.datosBasicos.Codigo_Postal)) {
                $("#errorMessageCodigoPostal").addClass("error-mensaje");
                $("#errorMessageCodigoPostalSpan").html("Codigo Postal no válido");
                $("#codigo_Postal").addClass("error-validate");
                // $("#id_Provincia").val("0");
                // this.vm.datosBasicos.Id_Provincia = 0;
                // $("#errorMessageProvincia").addClass("error-mensaje");
                // $("#errorMessageProvinciaSpan").html("Ingrese un Codigo Postal válido.");
                // $("#id_Provincia").addClass("error-validate");
                // $('.niceSelectProvincia').css("border-color", "#e40028");
                // $(".niceSelectProvincia").addClass("error-validate");
            }
            else {
                if ((parseInt(this.vm.datosBasicos.Codigo_Postal) < 1000 || parseInt(this.vm.datosBasicos.Codigo_Postal) > 52999)) {
                    $("#errorMessageCodigoPostal").addClass("error-mensaje");
                    $("#errorMessageCodigoPostalSpan").html("Codigo Postal no válido");
                    $("#codigo_Postal").addClass("error-validate");
                    // $("#id_Provincia").val("0");
                    // this.vm.datosBasicos.Id_Provincia = 0;
                    // $("#errorMessageProvincia").addClass("error-mensaje");
                    // $("#errorMessageProvinciaSpan").html("Ingrese un Codigo Postal válido.");
                    // $("#id_Provincia").addClass("error-validate");
                    // $('.niceSelectProvincia').css("border-color", "#e40028");
                    // $(".niceSelectProvincia").addClass("error-validate");
                }
                else {
                    $("#codigo_Postal").addClass("input-valido");
                    this.seleccionarProvincia();
                    //Validar Combo Provincia
                    // if($("#id_Provincia").val()=="0")
                    // {
                    //     this.vm.datosBasicos.Id_Provincia = 0;
                    //     $("#errorMessageProvincia").addClass("error-mensaje");
                    //     $("#errorMessageProvinciaSpan").html("Ingrese un Codigo Postal válido.");
                    //     $("#id_Provincia").addClass("error-validate");
                    //     $('.niceSelectProvincia').css("border-color", "#e40028");
                    //     $(".niceSelectProvincia").addClass("error-validate");
                    // }
                }
            }
        }
    }

    localidadValidate() {
        //Validar localidad
        $("#errorMessageLocalidad").removeClass("error-mensaje");
        $("#errorMessageLocalidadSpan").html("");
        $("#localidad").removeClass("error-validate");
        $("#localidad").removeClass("input-valido");
        if (this.vm.datosBasicos.Localidad == null || this.vm.datosBasicos.Localidad == "" || this.vm.datosBasicos.Localidad == undefined) {
            $("#errorMessageLocalidad").addClass("error-mensaje");
            $("#errorMessageLocalidadSpan").html("El campo Localidad es obligatorio.");
            $("#localidad").addClass("error-validate");
        }
        else {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Localidad))
            // {
            //     $("#errorMessageLocalidad").addClass("error-mensaje");
            //     $("#errorMessageLocalidadSpan").html("Debe ingresar solo números y letras");
            //     $("#localidad").addClass("error-validate");
            // }
            // else
            // {
            $("#localidad").addClass("input-valido");
            // }
        }
    }

    puntoOperacionalValidate() {//Validar Punto Operacional
        $("#errorMessagePuntoOperacional").removeClass("error-mensaje");
        $("#errorMessagePuntoOperacionalSpan").html("");
        $("#punto_Operacional").removeClass("error-validate");
        $("#punto_Operacional").removeClass("input-valido");
        if (this.vm.datosBasicos.Punto_Operacional != null && this.vm.datosBasicos.Punto_Operacional != undefined && this.vm.datosBasicos.Punto_Operacional.toString() != "") {
            let regexStr = /[0-9]+/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(this.vm.datosBasicos.Punto_Operacional.toString())) {
                $("#errorMessagePuntoOperacional").addClass("error-mensaje");
                $("#errorMessagePuntoOperacionalSpan").html("Debe ingresar solo números");
                $("#punto_Operacional").addClass("error-validate");
            }
            else {
                $("#punto_Operacional").addClass("input-valido");
            }
        }
        // else
        // {
        //     $("#punto_Operacional").addClass("input-valido");
        // }
    }

    jefeRegionalValidate() {
        //Validar Jefe Regional
        $("#errorMessageJefeRegional").removeClass("error-mensaje");
        $("#errorMessageJefeRegionalSpan").html("");
        $("#jefe_Regional").removeClass("error-validate");
        $("#jefe_Regional").removeClass("input-valido");
        if (this.vm.datosBasicos.Jefe_Regional != null && this.vm.datosBasicos.Jefe_Regional != "" && this.vm.datosBasicos.Jefe_Regional != undefined) {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Jefe_Regional))
            // {
            //     $("#errorMessageJefeRegional").addClass("error-mensaje");
            //     $("#errorMessageJefeRegionalSpan").html("Debe ingresar solo números y letras");
            //     $("#jefe_Regional").addClass("error-validate");
            // }
            // else
            // {
            $("#jefe_Regional").addClass("input-valido");
            // }
        }
        // else
        // {
        //     $("#jefe_Regional").addClass("input-valido");
        // }
    }

    jefeProvincialValidate() {
        //Validar Jefe Provincial
        $("#errorMessageJefeProvincial").removeClass("error-mensaje");
        $("#errorMessageJefeProvincialSpan").html("");
        $("#jefe_Provincial").removeClass("error-validate");
        $("#jefe_Provincial").removeClass("input-valido");
        if (this.vm.datosBasicos.Jefe_Provincial != null && this.vm.datosBasicos.Jefe_Provincial != "" && this.vm.datosBasicos.Jefe_Provincial != undefined) {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Jefe_Provincial))
            // {
            //     $("#errorMessageJefeProvincial").addClass("error-mensaje");
            //     $("#errorMessageJefeProvincialSpan").html("Debe ingresar solo números y letras");
            //     $("#jefe_Provincial").addClass("error-validate");
            // }
            // else
            // {
            $("#jefe_Provincial").addClass("input-valido");
            // }
        }
        // else
        // {
        //     $("#jefe_Provincial").addClass("input-valido");
        // }
    }

    jefeZonaValidate() {
        //Validar Jefe de zona
        $("#errorMessageJefeZona").removeClass("error-mensaje");
        $("#errorMessageJefeZonaSpan").html("");
        $("#jefe_Zona").removeClass("error-validate");
        $("#jefe_Zona").removeClass("input-valido");
        if (this.vm.datosBasicos.Jefe_Zona != null && this.vm.datosBasicos.Jefe_Zona != "" && this.vm.datosBasicos.Jefe_Zona != undefined) {
            // let regexStr = /^[ÁÉÍÓÚÑA-Záéíóúña-z\d ]*$/;///[a-zA-Z0-9 ]+/;
            // let regEx =  new RegExp(regexStr);    
            // if(!regEx.test(this.vm.datosBasicos.Jefe_Zona))
            // {
            //     $("#errorMessageJefeZona").addClass("error-mensaje");
            //     $("#errorMessageJefeZonaSpan").html("Debe ingresar solo números y letras");
            //     $("#jefe_Zona").addClass("error-validate");
            // }
            // else
            // {
            $("#jefe_Zona").addClass("input-valido");
            // }
        }
        // else
        // {
        //     $("#jefe_Zona").addClass("input-valido");
        // }
    }

    fechaAltaBajaValidate() {
        //Validar Fecha Alta
        $("#errorMessageFechaAlta").removeClass("error-mensaje");
        $("#errorMessageFechaAltaSpan").html("");
        $("#fecha_Alta").removeClass("error-validate-fecha");
        $("#fecha_Alta").removeClass("input-valido");
        $("#errorMessageFechaBaja").removeClass("error-mensaje");
        $("#errorMessageFechaBajaSpan").html("");
        $("#fecha_Baja").removeClass("error-validate-fecha");
        $("#fecha_Baja").removeClass("input-valido");

        var fechaAlta = $("#fecha_Alta").val();
        var evaluarDiferencia = false;
        if (fechaAlta != null && fechaAlta != "" && fechaAlta != undefined) {
            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(fechaAlta)) {
                $("#errorMessageFechaAlta").addClass("error-mensaje");
                $("#errorMessageFechaAltaSpan").html("Formato fecha incorrecto");
                $("#fecha_Alta").addClass("error-validate-fecha");
            }
            else {
                if (!this._validacionHelper.isDate(fechaAlta)) {
                    $("#errorMessageFechaAlta").addClass("error-mensaje");
                    $("#errorMessageFechaAltaSpan").html("La fecha es inválida.");
                    $("#fecha_Alta").addClass("error-validate-fecha");
                }
                else {
                    // $("#fecha_Alta").addClass("input-valido");
                    evaluarDiferencia = true;
                }
            }
        }
        else {
            // $("#fecha_Alta").addClass("input-valido");
        }
        var fechaBaja = $("#fecha_Baja").val();
        if (fechaBaja != null && fechaBaja != "" && fechaBaja != undefined) {
            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(fechaBaja)) {
                $("#errorMessageFechaBaja").addClass("error-mensaje");
                $("#errorMessageFechaBajaSpan").html("Formato fecha incorrecto");
                $("#fecha_Baja").addClass("error-validate-fecha");
            }
            else {
                if (!this._validacionHelper.isDate(fechaBaja)) {
                    $("#errorMessageFechaBaja").addClass("error-mensaje");
                    $("#errorMessageFechaBajaSpan").html("La fecha es inválida.");
                    $("#fecha_Baja").addClass("error-validate-fecha");
                }
                else {
                    if (evaluarDiferencia) {
                        var fechaInicioNumeric = fechaAlta.substring(fechaAlta.length - 4, fechaAlta.length) + fechaAlta.substring(fechaAlta.length - 7, fechaAlta.length - 5) + fechaAlta.substring(fechaAlta.length - 10, fechaAlta.length - 8);
                        var fechaFinNumeric = fechaBaja.substring(fechaBaja.length - 4, fechaBaja.length) + fechaBaja.substring(fechaBaja.length - 7, fechaBaja.length - 5) + fechaBaja.substring(fechaBaja.length - 10, fechaBaja.length - 8);
                        if (fechaInicioNumeric >= fechaFinNumeric) {
                            $("#errorMessageFechaBaja").addClass("error-mensaje");
                            $("#errorMessageFechaBajaSpan").html("Debe ser mayor a fecha Alta.");
                            $("#fecha_Baja").addClass("error-validate-fecha");
                        }
                    }
                    else {
                        // $("#fecha_Baja").addClass("input-valido");
                    }
                }
            }
        }
        else {
            // $("#fecha_Baja").addClass("input-valido");
        }
    }

    fechaInicioFinValidate(i: number) {
        $("#errorMessageFechaInicio" + i).removeClass("error-mensaje");
        $("#errorMessageFechaInicioSpan" + i).html("");
        $("#fechaInicio" + i).removeClass("error-validate-fecha");
        $("#errorMessageFechaFin" + i).removeClass("error-mensaje");
        $("#errorMessageFechaFinSpan" + i).html("");
        $("#fechaFin" + i).removeClass("error-validate-fecha");
        $("#errorMessageFechaInicio" + i).removeClass("spanErrorFechaPrecio");
        $("#errorMessageFechaFin" + i).removeClass("spanErrorFechaPrecio");

        if ($("#id_Base" + i).val() == "0") {
            $("#fechaInicio" + i).val("");
            $("#fechaFin" + i).val("");
        }
        else {
            var fechaIni = $("#fechaInicio" + i).val();
            var evaluarDiferencia = false;
            if (fechaIni != null && fechaIni != "" && fechaIni != undefined) {
                let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                let regEx = new RegExp(regexStr);
                if (!regEx.test(fechaIni)) {
                    $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                    $("#errorMessageFechaInicioSpan" + i).html("Formato fecha incorrecto.");
                    $("#fechaInicio" + i).addClass("error-validate-fecha");
                    $("#errorMessageFechaInicio" + i).addClass("spanErrorFechaPrecio");
                }
                else {
                    if (!this._validacionHelper.isDate(fechaIni)) {
                        $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                        $("#errorMessageFechaInicioSpan" + i).html("La fecha es inválida.");
                        $("#fechaInicio" + i).addClass("error-validate-fecha");
                        $("#errorMessageFechaInicio" + i).addClass("spanErrorFechaPrecio");
                    }
                    else {
                        // $("#fecha_Alta").addClass("input-valido");
                        evaluarDiferencia = true;
                    }
                }
            }
            else {
                $("#errorMessageFechaInicio" + i).addClass("error-mensaje");
                $("#errorMessageFechaInicioSpan" + i).html("La fecha de inicio es obligatoria.");
                $("#fechaInicio" + i).addClass("error-validate-fecha");
                $("#errorMessageFechaInicio" + i).addClass("spanErrorFechaPrecio");
            }
            var fechaFin = $("#fechaFin" + i).val();
            if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
                let regEx = new RegExp(regexStr);
                if (!regEx.test(fechaFin)) {
                    $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                    $("#errorMessageFechaFinSpan" + i).html("Formato fecha incorrecto");
                    $("#fechaFin" + i).addClass("error-validate-fecha");
                    $("#errorMessageFechaFin" + i).addClass("spanErrorFechaPrecio");
                }
                else {
                    if (!this._validacionHelper.isDate(fechaFin)) {
                        $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                        $("#errorMessageFechaFinSpan" + i).html("La fecha es inválida.");
                        $("#fechaFin" + i).addClass("error-validate-fecha");
                        $("#errorMessageFechaFin" + i).addClass("spanErrorFechaPrecio");
                    }
                    else {
                        if (evaluarDiferencia) {
                            var fechaInicioNumeric = fechaIni.substring(fechaIni.length - 4, fechaIni.length) + fechaIni.substring(fechaIni.length - 7, fechaIni.length - 5) + fechaIni.substring(fechaIni.length - 10, fechaIni.length - 8);
                            var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                            if (fechaInicioNumeric >= fechaFinNumeric) {
                                $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                                $("#errorMessageFechaFinSpan" + i).html("Debe ser mayor a fecha inicio.");
                                $("#fechaFin" + i).addClass("error-validate-fecha");
                                $("#errorMessageFechaFin" + i).addClass("spanErrorFechaPrecio");
                            }
                        }
                        else {
                            // $("#fecha_Baja").addClass("input-valido");
                        }
                    }
                }
            }
            else {
                $("#errorMessageFechaFin" + i).addClass("error-mensaje");
                $("#errorMessageFechaFinSpan" + i).html("La fecha de fin es obligatoria.");
                $("#fechaFin" + i).addClass("error-validate-fecha");
                $("#errorMessageFechaFin" + i).addClass("spanErrorFechaPrecio");
            }
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

    nuevaEstacion() {
        this.redirectTo("/alta-estaciones");
    }

    redirectTo(uri: string) {
        this.router.navigateByUrl('/HomeComponent', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }

    fechaSurInicioValidate() {

        var estado = true;
        //Validar Fecha Alta
        $("#errorMessageFechaSurInicio").removeClass("error-mensaje");
        $("#errorMessageFechaSurInicio").html("");
        $("#fechasur_inicio").removeClass("error-validate-fecha");

        var fechaInicio = $("#fechasur_inicio").val();
        if (fechaInicio != null && fechaInicio != "" && fechaInicio != undefined) {
            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(fechaInicio)) {
                $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                $("#errorMessageFechaSurInicio").html("<span> Formato fecha incorrecto</span>");
                $("#fechasur_inicio").addClass("error-validate-fecha");
                estado = false;
            }
            else {
                if (!this._validacionHelper.isDate(fechaInicio)) {
                    $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                    $("#errorMessageFechaSurInicio").html("<span>La fecha es inválida</span>");
                    $("#fechasur_inicio").addClass("error-validate-fecha");
                    estado = false;
                }
                else {
                    var fechaFin = $("#Fechasur_fin").val();
                    if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                        var fechaInicioNumeric = fechaInicio.substring(fechaInicio.length - 4, fechaInicio.length) + fechaInicio.substring(fechaInicio.length - 7, fechaInicio.length - 5) + fechaInicio.substring(fechaInicio.length - 10, fechaInicio.length - 8);
                        var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                        if (fechaInicioNumeric >= fechaFinNumeric) {
                            $("#errorMessageFechaSurInicio").addClass("error-mensaje");
                            $("#errorMessageFechaSurInicio").html("<span>La fecha inicial tiene que ser menor que la fecha final");
                            $("#fechasur_inicio").addClass("error-validate-fecha");
                            estado = false;
                        }
                    }
                }
            }
        }
        else {
            $("#errorMessageFechaSurInicio").addClass("error-mensaje");
            $("#errorMessageFechaSurInicio").html("<span>Campo fecha inicio es obligatorio</span>");
            $("#fechasur_inicio").addClass("error-validate-fecha");
            estado = false;
        }

        return estado;

    }

    fechaSurFinValidate() {
        //Validar Fecha Alta

        var estado = true;

        $("#errorMessageFechaSurFin").removeClass("error-mensaje");
        $("#errorMessageFechaSurFin").html("");
        $("#Fechasur_fin").removeClass("error-validate-fecha");

        var fechaFin = $("#Fechasur_fin").val();
        if (fechaFin != null && fechaFin != "" && fechaFin != undefined) {
            let regexStr = /^\s*(3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:19|[2-9][0-9])\d{2})\s*$/;
            let regEx = new RegExp(regexStr);
            if (!regEx.test(fechaFin)) {
                $("#errorMessageFechaSurFin").addClass("error-mensaje");
                $("#errorMessageFechaSurFin").html("<span> Formato fecha incorrecto</span>");
                $("#Fechasur_fin").addClass("error-validate-fecha");
                estado = false;
            }
            else {
                if (!this._validacionHelper.isDate(fechaFin)) {
                    $("#errorMessageFechaSurFin").addClass("error-mensaje");
                    $("#errorMessageFechaSurFin").html("<span>La fecha es inválida</span>");
                    $("#Fechasur_fin").addClass("error-validate-fecha");
                    estado = false;
                }
                else {
                    var fechaInicio = $("#fechasur_inicio").val();
                    if (fechaInicio != null && fechaInicio != "" && fechaInicio != undefined) {
                        var fechaInicioNumeric = fechaInicio.substring(fechaInicio.length - 4, fechaInicio.length) + fechaInicio.substring(fechaInicio.length - 7, fechaInicio.length - 5) + fechaInicio.substring(fechaInicio.length - 10, fechaInicio.length - 8);
                        var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                        if (fechaFinNumeric <= fechaInicioNumeric) {
                            $("#errorMessageFechaSurFin").addClass("error-mensaje");
                            $("#errorMessageFechaSurFin").html("<span>La fecha final tiene que ser mayor que la fecha inicial");
                            $("#Fechasur_fin").addClass("error-validate-fecha");
                            estado = false;
                        }
                    }
                }
            }
        }
        else {
            $("#errorMessageFechaSurFin").addClass("error-mensaje");
            $("#errorMessageFechaSurFin").html("<span>Campo fecha fin es obligatorio</span>");
            $("#Fechasur_fin").addClass("error-validate-fecha");
            estado = false;
        }

        return estado;

    }

    agregarSurtido(contentSurtido) {
        this.vm.loading = true;
        var estado = true;

        if (!this.fechaSurInicioValidate()) estado = false;
        if (!this.fechaSurFinValidate()) estado = false;

        if (estado) {

            // FALTA VALIDAR 
            // this.vm.resul = "La estación ya tiene asignada un surtido en ese rango de fechas";
            // this.modalService.open(contentSurtido, { centered: true, size: 'sm' });
            // this.vm.loading = false;

            var fechaActual = this.fechaActual();
            var fechaFin = $("#Fechasur_fin").val();
            if (fechaActual != null && fechaActual != "" && fechaActual != undefined && fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                var fechaActualNumeric = fechaActual.substring(fechaActual.length - 4, fechaActual.length) + fechaActual.substring(fechaActual.length - 7, fechaActual.length - 5) + fechaActual.substring(fechaActual.length - 10, fechaActual.length - 8);
                var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                if (fechaFinNumeric < fechaActualNumeric) {

                    this.vm.resul = "La fecha final es menor que la fecha actual, este registro no se podrá eliminar ni editar, ¿está seguro de continuar?” ";
                    this.vm.btnName = "Cancelar";
                    this.vm.ocultarBoton = false;
                    this.modalService.open(contentSurtido, { centered: true, size: 'sm' });
                    this.vm.loading = false;

                }
            }
        }
        else {

            var fechaInicio = $("#fechasur_inicio").val();
            var fechaFin = $("#Fechasur_fin").val();
            if (fechaInicio != null && fechaInicio != "" && fechaInicio != undefined && fechaFin != null && fechaFin != "" && fechaFin != undefined) {
                var fechaInicioNumeric = fechaInicio.substring(fechaInicio.length - 4, fechaInicio.length) + fechaInicio.substring(fechaInicio.length - 7, fechaInicio.length - 5) + fechaInicio.substring(fechaInicio.length - 10, fechaInicio.length - 8);
                var fechaFinNumeric = fechaFin.substring(fechaFin.length - 4, fechaFin.length) + fechaFin.substring(fechaFin.length - 7, fechaFin.length - 5) + fechaFin.substring(fechaFin.length - 10, fechaFin.length - 8);
                if (fechaFinNumeric <= fechaInicioNumeric) {
                    this.vm.resul = "La fecha inicial tiene que ser menor que la fecha final y la fecha final mayor que la fecha inicial";
                    this.vm.btnName = "Aceptar";
                    this.vm.ocultarBoton = true;
                    this.modalService.open(contentSurtido, { centered: true, size: 'sm' });
                    this.vm.loading = false;
                }
            }


            this.vm.loading = false;
        }

    }

    registrarSurtido() {
        // alert("Se registro correctamente");
    }



}