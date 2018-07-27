export class ArticulosGruposOfertasFiltro {
    descripcionFiltro:string;
    familiaFiltro: number[];
    subFamiliaFiltro:number[];
    categoriaFiltro:number[];
    referenciaFiltro:string;
    proveedorFiltro:number;

    paginaActualGO:number;
    filasPorPaginaGO:number;
    orderByGO : string;
    orderDirectionGO:number;
    listPaginasGO: number[];
    paginacionBdGO : boolean;

    constructor()
    {
        this.descripcionFiltro = "";
        this.familiaFiltro = [];
        this.subFamiliaFiltro = [];
        this.categoriaFiltro = [];
        this.referenciaFiltro = "";
        this.proveedorFiltro = 0;

        this.orderByGO = "codigo";
        this.orderDirectionGO = 0;
        this.paginaActualGO=0;
        this.filasPorPaginaGO=10;
        this.listPaginasGO = [];
        this.paginacionBdGO = true;
    }
}