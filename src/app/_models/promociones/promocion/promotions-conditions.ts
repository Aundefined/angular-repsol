import { DecimalPipe } from "@angular/common";

export class PromotionsConditions {
    id:number;
    selected:boolean;
    id_Promotions:number;
    id_Articulo: number;
    promocion:string;    
    importe:any;
    nombre:string; 
    accion:string;   
    id_ArticuloAux : number;

    constructor(){
        this.id = 0;
        this.id_ArticuloAux = 0;
        this.selected = false;
        this.id_Promotions = 0;
        this.id_Articulo = 0;        
        this.importe=0.00;
        this.promocion = "";
        this.nombre="";
        this.accion="N";
    }
}