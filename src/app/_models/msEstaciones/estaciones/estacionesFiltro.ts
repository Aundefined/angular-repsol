
export class EstacionesFiltro
{
    Id : number;
    Localidad : string;
    Codigo_Repsol : string;
    Nombre_Comercial : string;
    Provincia : string;
    Margen : string;

    constructor()
    {
        this.Id = 0;
        this.Localidad = "";
        this.Codigo_Repsol = "";
        this.Nombre_Comercial = "";
        this.Provincia = "";
        this.Margen = "";
    }
}