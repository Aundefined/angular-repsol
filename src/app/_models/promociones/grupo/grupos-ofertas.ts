import { ArticulosGruposOfertas, GruposOfertasFiltro } from '../../index';

export class GruposOfertas {

    id_Grupos_Oferta:number;
    codigo: string;
    nombre: string;
    totalFilas : number;
    numFila : number;
    paginacionBd : boolean;
    detalle:ArticulosGruposOfertas[];
    //filtro : GruposOfertasFiltro;

    constructor()
    {
        //this.filtro = new GruposOfertasFiltro();
        this.detalle = [];
        this.totalFilas = 10;
        this.numFila = 1;
        this.paginacionBd = false;
    }
}
