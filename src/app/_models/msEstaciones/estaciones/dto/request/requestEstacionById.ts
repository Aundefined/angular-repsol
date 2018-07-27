export class RequestEstacionById
{
    Id : number;
    Id_Empresa : number;
    //RequestPaginacion : PaginationFilter

    public constructor()
    {
        this.Id = 0;
        this.Id_Empresa = 0;
        //PaginationFilter = new RequestPaginacion();
    }
}