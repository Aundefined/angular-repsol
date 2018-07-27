export class ArticulosPromotionsFiltro {
    codigoFiltro:string;
    descripcionFiltro:string;
    familiaFiltro: number[];
    subFamiliaFiltro:number[];
    referenciaFiltro:number;
    categoriaFiltro:number[];
    proveedorFiltro:number;

    constructor()
    {
        this.codigoFiltro = "";
        this.descripcionFiltro = "";
        this.familiaFiltro = [];
        this.subFamiliaFiltro = [];
        this.referenciaFiltro = 0;
        this.categoriaFiltro = [];
        this.proveedorFiltro = 0;
    }
}