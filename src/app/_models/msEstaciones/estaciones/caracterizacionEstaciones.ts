export class CaracterizacionEstaciones
{
    Id_Caracterizacion : number;
    Id_Empresa : number;
    Id_Estacion : number;
    Nombre: string;
    Id_Tipo: number;
    NombreCaracterizacion: string;

    constructor()
    {
        this.Id_Caracterizacion = 0;
        this.Id_Empresa = 0;
        this.Id_Estacion = 0;
        this.Nombre = "";
        this.Id_Tipo = 0;
        this.NombreCaracterizacion = "";
    }
}