export class CaracterizacionProveedores {
    Id_Caracterizacion: number;
    Id_Empresa: number;
    Id_Proveedor: number;
    Nombre: string;
    Id_Tipo: number;
    NombreCaracterizacion: string;

    constructor(){
        this.Id_Caracterizacion = -1
        this.Id_Empresa = 0;
        this.Id_Proveedor = 0;
        this.Nombre = "";
        this.Id_Tipo = 0;
        this.NombreCaracterizacion = "";

    }
}