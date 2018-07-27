import { Paginacion } from "../../util/paginacion";

export class GruposOfertasByIdFiltro {
    id_grupos_ofertas: number;

    orderBy : string;
    orderDirection:number;
    p : Paginacion;
    paginacionBd : boolean;
    constructor()
    {
        this.id_grupos_ofertas = 0;
        this.orderBy = "referencia";
        this.orderDirection = 0;
        this.p = new Paginacion();
        this.paginacionBd = false;
    }
}