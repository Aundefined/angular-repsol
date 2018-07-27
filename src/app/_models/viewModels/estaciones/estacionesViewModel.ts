import { ResponseListaProvincias, ResponseListaPaises, ResponseListaEstacionDelegacionArea, 
        ResponseListaEstacionImagen, ResponseTiposCaracterizacion,ResponseListaEstacionHorario,
        ResponseListaSegmento, ResponseCaracterizacion, ResponseListaCategoriasBases, 
        ResponseSugerenciasCodigoRepsol } from "../../index";
import { Estaciones } from "../../msEstaciones/estaciones/estaciones";
import { CaracterizacionEstaciones } from "../../msEstaciones/estaciones/caracterizacionEstaciones";
import { EstacionCategoriaBase } from "../../msEstaciones/estaciones/estacionCategoriaBase";
import { EstacionesSurtidos } from "../../msEstaciones/estaciones/estacionesSurtidos";
// import { ResponseListaEstacionHorario } from "../../msEstaciones/estaciones/dto/response/responseListaEstacionHorario";
// import { ResponseListaSegmento } from "../../msEstaciones/estaciones/dto/response/responseListaSegmento";


export class EstacionesViewModel{

    datosBasicos: Estaciones;
    datosSurtidos: EstacionesSurtidos;
    // DatosCaracterizacion: CaracterizacionEstaciones[];
    // DatosPrecios: EstacionCategoriaBase[];
    rspProvincias:ResponseListaProvincias;
    rspPaises:ResponseListaPaises;
    rspDelegacionArea:ResponseListaEstacionDelegacionArea;
    rspImagen:ResponseListaEstacionImagen;
    rspHorario:ResponseListaEstacionHorario;
    rspSegmento:ResponseListaSegmento;
    rpsTiposCaracterizacion:ResponseTiposCaracterizacion;
    rpsCaracterizacion:ResponseCaracterizacion;
    rspDatosPrecios: ResponseListaCategoriasBases;
    rspSugerenciasCodigosRepsol : ResponseSugerenciasCodigoRepsol;
    ListaCodigosRepsol : Estaciones[];
    nombreTipCaract:string;
    action:string;
    validarCodigoPostal:boolean;
    habilitarGuardar:boolean;
    habilitarModificar:boolean;
    habilitarCodigoRepsol:boolean;
    timer: any;
    hideSugerencias:boolean;
    loading : boolean;
    resul: string;
    validarSelectTodas:boolean;
    pageTablaCaracterizaciones: number;
    fechaPlaceholder:string;
    btnName:string;
    ocultarBoton:boolean;
    

    constructor(){
        this.datosBasicos = new Estaciones();
        this.datosSurtidos = new EstacionesSurtidos();
        // this.DatosCaracterizacion = [];
        // this.DatosPrecios = [];
        this.rspProvincias= new ResponseListaProvincias();
        this.rspPaises= new  ResponseListaPaises();
        this.rspDelegacionArea = new ResponseListaEstacionDelegacionArea();
        this.rspImagen = new ResponseListaEstacionImagen();
        this.rspHorario = new ResponseListaEstacionHorario();
        this.rspSegmento = new ResponseListaSegmento();
        this.rpsTiposCaracterizacion = new ResponseTiposCaracterizacion();
        this.rpsCaracterizacion = new ResponseCaracterizacion();
        this.rspDatosPrecios = new ResponseListaCategoriasBases();
        this.rspSugerenciasCodigosRepsol = new ResponseSugerenciasCodigoRepsol();
        this.ListaCodigosRepsol = [];
        this.nombreTipCaract = "";
        this.validarCodigoPostal = true;
        this.habilitarGuardar=false;
        this.habilitarModificar=true;
        this.habilitarCodigoRepsol= true;
        this.timer = { search:{id: null,ms: 200},result:{id: null,ms: 200}};
        this.hideSugerencias = true;
        this.loading = false;
        this.resul = "";
        this.validarSelectTodas=true;
        this.pageTablaCaracterizaciones=0;
        this.fechaPlaceholder = "";
        this.btnName = "";
        this.ocultarBoton = false;
    }

}