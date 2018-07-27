export class Paginacion
{
    paginaActual:number;
    filasPorPagina:number;
    listPaginas: number[];
    numeroPaginas: number = 0;
    totalItems: number = 0;
    data : any[];

    constructor()
    {
        this.paginaActual=1;
        this.filasPorPagina=10;
        this.listPaginas = [];
        this.numeroPaginas = 0;
        this.totalItems = 0;
        this.data = [];
    }
}