export class Articulos{
    descripcionFiltro:string;
    familiaFiltro: number[];
    subFamiliaFiltro:number[];
    referenciaFiltro:number;
    categoriaFiltro:number[];

    referencia:string;
    nombre_Articulo:string;    
    pvp:number;
    importe:any;     
    pvp_Promocional: any;
    dto:any;


    constructor()
    {
        this.descripcionFiltro = "";
        this.familiaFiltro = [];
        this.subFamiliaFiltro = [];
        this.referenciaFiltro = 0;
        this.categoriaFiltro = [];

        this.referencia = "";
        this.nombre_Articulo ="";
        this.pvp = 0.00;
        this.importe = 0.00;  
        this.pvp_Promocional = 0.00;
        this.dto = 0.00;
        
    }
}