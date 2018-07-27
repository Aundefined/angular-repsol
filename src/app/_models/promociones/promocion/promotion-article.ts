import { DecimalPipe } from "@angular/common";

export class PromotionsArticle {
    id:number;
    selected:boolean;
    id_Promotions:number;
    id_Articulo: number;
    item: number;
    cant_Min:number;
    pvp_Promocional:any;
    dto:any;
    iva:number;

    accion:string;
    nombre:string;
    referencia:string;
    grupo:string;   
    importe:any;
    pvp:any;
   
    fondo:string;
    totalFilas:number;
    colorImporte:string;
    colorPvp:string;
    estadoCheck:boolean;
    id_Tipo_Promocion:number;

    
    

    constructor(){
        this.id = 0;
        this.selected = false;
        this.id_Promotions = 0;
        this.id_Articulo = 0;
        this.item=0;
        this.cant_Min=0;
        this.pvp_Promocional= 0.00;
        this.dto= 0.00;        
        this.accion = "";
        this.nombre = "";
        this.referencia = "";
        this.grupo = "";        
        this.importe=0.00;        
        this.pvp=  0.00;
        this.iva = 0;
        this.totalFilas = 0;
        
        this.fondo = "#d1dded";
        this.colorImporte="#000000";
        this.colorPvp = "#000000";
        this.estadoCheck=false;
        this.id_Tipo_Promocion = 0;

        
    }
}