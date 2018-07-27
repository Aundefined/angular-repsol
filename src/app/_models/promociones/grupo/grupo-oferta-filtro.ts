import { Paginacion } from "../../util/paginacion";

export class GruposOfertasFiltro {
    codigoFiltro: string;
    descripcionFiltro: string;

    orderByGO : string;
    orderDirectionGO:number;
     paginaActualGO:number;
     filasPorPaginaGO:number;
     listPaginasGO: number[];
     numeroPaginasGO: number = 0;
    p : Paginacion;
    id_Promotion:number;
    paginacionBd : boolean;
    constructor()
    {
        this.codigoFiltro = "";
        this.descripcionFiltro = "";
        this.orderByGO = "codigo";
        this.orderDirectionGO = 0;
        this.p = new Paginacion();
         this.paginaActualGO=0;
         this.filasPorPaginaGO=5;
         this.listPaginasGO = [];
         this.numeroPaginasGO = 0;
         this.id_Promotion = 0;
         this.paginacionBd = true;
    }
}