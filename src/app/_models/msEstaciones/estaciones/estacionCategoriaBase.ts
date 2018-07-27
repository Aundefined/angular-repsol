export class EstacionCategoriaBase
{
    Id_Categoria : number;
    Nombre : string;
    Fecha_Inicio_str : string;
    Fecha_Fin_str : string;
    Id_Categoria_Base : number;
    Id_Estacion : number;
    Nombre_Base : string;
    Id_Base : number;

    constructor()
    {
        this.Id_Categoria = 0;
        this.Nombre = "";
        this.Fecha_Inicio_str = "";
        this.Fecha_Fin_str = "";
        this.Id_Categoria_Base = 0;
        this.Id_Estacion = 0;
        this.Nombre_Base = "";
        this.Id_Base = 0;
    }
}