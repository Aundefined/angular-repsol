import { Paginacion } from "../../util/paginacion";

export class PromotionsByIdFiltro {
    id_Promotions: number;

    orderBy : string;
    orderDirection:number;
    p : Paginacion;
    paginacionBd : boolean;
    constructor()
    {
        this.id_Promotions = 0;
        this.orderBy = "referencia";
        this.orderDirection = 0;
        this.paginacionBd = false;
        this.p = new Paginacion();
    }
}