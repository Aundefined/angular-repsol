export class Estaciones
{
    Id : number;
    Codigo_Ilion : string;
    Codigo_Repsol : string;
    Id_Empresa : number;
    Id_Provincia : number;
    Nombre : string;
    Codigo_Ilion_Tienda : string;
    Margen : number;
    Cod_Instalacion : string;
    Ceco : string;
    Ctc : string;
    Nombre_Comercial :  string;
    Razon_Social : string;
    Direccion : string;
    Codigo_Postal : string;
    Localidad : string;
    Pais : number;
    Id_Imagen : number;
    Id_Delegacion_Area : number;
    Jefe_Regional : string;
    Jefe_Provincial : string;
    Jefe_Zona : string;
    Fecha_Alta_str : string;
    Fecha_Baja_str : string;
    Id_Horario : number;
    Punto_Operacional : number;
    Codigo_Ilion_Almacen : string;
    Id_Segmento : number;

    constructor()
    {
        this.Id = 0;
        this.Codigo_Ilion = "";
        this.Codigo_Repsol = "";
        this.Id_Empresa = 0;
        this.Id_Provincia = 0;
        this.Nombre = "";
        this.Codigo_Ilion_Tienda = "";
        this.Margen = 0;
        this.Cod_Instalacion = "";
        this.Ceco = "";
        this.Ctc = "";
        this.Nombre_Comercial = "";
        this.Razon_Social = "";
        this.Direccion = "";
        this.Codigo_Postal = "";
        this.Localidad = "";
        this.Pais = 1;//Por Defecto españa
        this.Id_Imagen = 0;
        this.Id_Delegacion_Area = 0;
        this.Jefe_Regional = "";
        this.Jefe_Provincial = "";
        this.Jefe_Zona = "";
        this.Fecha_Alta_str = "";//new Date();
        this.Fecha_Baja_str = "";//new Date();
        this.Id_Horario = 0;
        //this.punto_Operacional = 0;
        this.Codigo_Ilion_Almacen = "";
        this.Id_Segmento = 0;
    }
}