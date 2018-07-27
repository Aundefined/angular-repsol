export class ArticuloProveedor {

    Id_Articulo: number;
    Id_Proveedor: number;
    Referencia_Articulo: string;
    Su_Ref: string;
    Nombre_Articulo: string;
    Id_Empresa: number;
    Pvd: number;
    Descuento: number;
    Descuento2: number;

    constructor() {
        this.Id_Articulo = 0;
        this.Id_Proveedor = 0;
        this.Referencia_Articulo = "";
        this.Su_Ref = "";
        this.Nombre_Articulo = "";
        this.Id_Empresa = 0;
        this.Pvd = 0;
        this.Descuento = 0;
        this.Descuento2 = 0;
    }

}