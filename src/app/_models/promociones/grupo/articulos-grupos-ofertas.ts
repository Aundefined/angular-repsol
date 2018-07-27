import { Paginacion } from "../../../_models/index";

export class ArticulosGruposOfertas {
    selected:boolean;
    id_Grupos_Oferta:number;
    id_Articulos_Grupos_Oferta:number;
    id_Articulo: number;
    accion:string;
    nombre:string;
    referencia:string;
    pvp:number;
    id_Tipo_Promocion:number;
    grupo:string;
    totalFilas:number;    

    constructor(){
        this.selected = false;
        this.id_Grupos_Oferta = 0;
        this.id_Articulos_Grupos_Oferta = 0;
        this.id_Articulo = 0;
        this.accion = "";
        this.nombre = "";
        this.referencia = "";
        this.pvp = 0;
        this.grupo="";
        this.totalFilas = 0;
        this.id_Tipo_Promocion =0;        
    }
}