import {Utilidades } from '../../util/utilidades';

export class PromotionsFiltro {

    codigo: string;
    descripcion: string;
    fecha_desde:string;    
    fecha_hasta:string;

    paginaActualGO:number;
    filasPorPaginaGO:number;
    orderByGO : string;
    orderDirectionGO:number;
    listPaginasGO: number[];
    numeroPaginasGO : number;
    paginacionBd : boolean;
    util = new Utilidades();
    
    
    constructor()
    {  
        this.codigo="";
        this.descripcion = "";
        this.fecha_hasta= "";//this.util.getFecha();
        this.fecha_desde ="";// '01/01/1900';

        this.orderByGO = "code";
        this.orderDirectionGO = 0;
        this.paginaActualGO=0;
        this.filasPorPaginaGO=10;
        this.listPaginasGO = [];
        this.numeroPaginasGO = 0;
        this.paginacionBd = true;
    }
}
