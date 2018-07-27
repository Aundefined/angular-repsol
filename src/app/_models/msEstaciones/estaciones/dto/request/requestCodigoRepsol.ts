export class RequestCodigoRepsol
{
    Id : number;
    Id_Empresa : number;
    Margen : number;
    Codigo_Repsol : string;

    constructor()
    {
        this.Id_Empresa = 0;
        this.Margen = 0;
        this.Codigo_Repsol = "";
    }
}