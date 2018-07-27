import { Articulos, ArticulosPromotionsGrupo } from "../../index";
export class PromotionsGrupo {
    selected:boolean;    
    id_Grupos_Oferta:number;
    id_PromotionsGrupo:number;
    id_Articulo:number;
    codigo:string;
    nombre:string;
    nro_Articulo: number; 
    cant_Min:number;  
    referencia:string;
    nombre_Articulo:string;    
    pvp:number;
    iva:number;
    importe:any;     
    pvp_Promocional: any;
    dto:any;
    valor_Medio_Grupo:any;
    dto_Medio_Grupo:any;
    accion:string;
    fondo:string; 
    valorRowSpan:string;
    ocultarFila:boolean;
    
    articulo:Articulos[];
    detalle:ArticulosPromotionsGrupo[];
    totalFilas:number;
    colorImporte:string;
    colorPvp : string;
    codigoPG : string;
    fondoMedio:string;
    estadoCheck:boolean;

    constructor(){
        this.selected = false;
        this.id_Grupos_Oferta = 0;
        this.id_PromotionsGrupo=0;
        this.codigo = "";
        this.nombre = "";
        this.nro_Articulo = 1; 
        this.cant_Min=0;       
        this.valor_Medio_Grupo = 0.00;       

        this.referencia = "";
        this.nombre_Articulo ="";
        this.pvp = 0.00;
        this.iva = 0;
        this.importe = 0.00;  
        //this.pvp_Promocional = null;
       // this.dto = 0.00;
        //this.dto_Medio_Grupo = 0.00;

        this.accion = "";
        this.fondo = "#d1dded";
        this.articulo = [];
        this.valorRowSpan = "1";
        this.ocultarFila = false;
        this.detalle = [];

        this.totalFilas = 0;
        this.colorImporte="#000000";
        this.colorPvp = "#000000";
        this.codigoPG = "";

        this.fondoMedio = "#d1dded";
        this.estadoCheck = false;
    }
}