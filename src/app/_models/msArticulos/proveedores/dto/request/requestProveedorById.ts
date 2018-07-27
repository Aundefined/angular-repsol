export class RequestProveedorById
{
    Id_Proveedor : number;
    Id_Empresa : number;
    //RequestPaginacion : PaginationFilter

    public constructor()
    {
        this.Id_Proveedor = 0;
        this.Id_Empresa = 0;
        //PaginationFilter = new RequestPaginacion();
    }
}