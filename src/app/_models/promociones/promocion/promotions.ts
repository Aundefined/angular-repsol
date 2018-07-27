import { DecimalPipe } from "@angular/common";
import { PromotionsArticle, PromotionsConditions, PromotionsGrupo,  } from "../../index";
import { Utilidades } from "../../../_models/util/utilidades";
import { Fechas } from "../../../_models/util/fechas";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";


export class Promotions{
    id_Promotion: number;
    code: string;
    description: string;
    description_Tpv: string;
    qt_Dtos:number;
    type :string;   
    v_From_str:string;    
    v_To_str:string;
    id_Empresa:number;   
    type_Promotion :number;
    limit_Car: any; 
    applytoalproducts: boolean;
    applicationmode:number;
    prioridad:number;
    central:boolean;
    tienda:string;
    is_Combo:boolean;
    importe_Minimo:any;    
    dto_Medio:any;
    cant_Min:number;
    pvp_Promotion:any;    
    valor_Dto:any;
    accion:string;
    totalFilas : number = 0;
    habilitarTipo:boolean;
    fechaDesdeTemp:string; 

   
    detalleArticulos: PromotionsArticle[];
    detalleConditions: PromotionsConditions[];
    detalleGrupos: PromotionsGrupo[];
    detalleConditionsTemp: PromotionsConditions[];
    
    fecha_desde : Fechas;
    fecha_hasta : Fechas;

    NumFila:number;
    TotalFilas:number;
    paginacionBd : boolean;
    orderBy:string
    orderDirection:number;

    constructor()
    {  

        
        this.description = "";
        this.description_Tpv = "";
        this.qt_Dtos = 1;
        this.type = "1";        
        this.v_From_str = this.obtenerFecha()
        this.v_To_str = "";
        this.id_Empresa = 1;
        this.type_Promotion = 0;
        this.limit_Car = 0.00;
        this.applytoalproducts = false;
        this.applicationmode = 0;
        this.prioridad = 0;
        this.central = false;
        this.tienda = null;
        this.is_Combo=false;
        this.importe_Minimo=0;
        this.dto_Medio = 0.00;
        this.cant_Min =0;
        this.pvp_Promotion = 0.00;
        this.valor_Dto=0.00;        
        
        this.detalleArticulos=[];
        this.detalleConditions=[];
        this.detalleGrupos=[];
        this.accion="";
        this.detalleConditionsTemp=[];
        this.habilitarTipo= false;
        this.fecha_desde = new Fechas();
        this.fecha_hasta = new Fechas();
        this.NumFila = 100;
        this.TotalFilas = 1;
        this.fechaDesdeTemp="";
      
        this.paginacionBd = false;
        
    }

    obtenerFecha(){

        var util = new Utilidades();
        return util.getFecha();
    }
}
