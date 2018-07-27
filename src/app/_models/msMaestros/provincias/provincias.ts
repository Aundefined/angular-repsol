export class Provincias{
    Selected:boolean;
    Id:number;   
    Id_Empresa:number;
    Id_Pais:number;    
    Nombre:string;
    Codigo_Postal:string;          


    constructor()
    {
        this.Id = 0;
        this.Id_Empresa = 0;
        this.Id_Pais=0;
        this.Nombre="";
        this.Codigo_Postal="";        
        
    }
}