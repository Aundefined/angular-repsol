export class Proveedor{

    Codigo_Sap : string; 
    Cif : string; 
    Contacto : string; 
    Distribuidor : boolean; 
    Divisa : number; 
    Facturador : boolean; 
    Falta_str : string;  
    Fbaja_str : string; 
    Id_Empresa : number; 
    Id_Proveedores : number; 
    Iva : number; 
    Nombre : string;    
    Observaciones : string; 
    Proveedor : boolean; 
    Razon_Social : string;   
    Tipo_Proveedor : number;    
    Clasificacion : number; 
    Preproveedor : boolean; 
    Direccion : string; 
    Codigo_Postal : string; 
    Localidad : string; 
    Id_Provincia : number; 
    Id_Pais : number; 
    Telefono1 : string; 
    Telefono2 : string; 
    Telefono3 : string; 
    Email1 : string; 
    Email2 : string; 
    Email3 : string; 
    Contacto2 : string; 
    Id_Facturador : number; 
    Acuerdo_Comercial : any; 
    Fini_Acuerdo_str : string; 
    Ffin_Acuerdo_str : string;  
    Importe_Fijo : any;
    Punto_Operacional:number;


    constructor()
    {
        this.Codigo_Sap = "" ; 
        this.Cif = "" ; 
        this.Contacto = null ; 
        this.Distribuidor = false; 
        this.Divisa = 0; 
        this.Facturador = false; 
        this.Falta_str = null;       
        this.Fbaja_str = null ; 
        this.Id_Empresa = 0; 
        this.Id_Proveedores = 0; 
        this.Iva = null; 
        this.Nombre = null;        
        this.Observaciones = null; 
        this.Proveedor = false; 
        this.Razon_Social = ""; 
        this.Telefono2 = null; 
        this.Tipo_Proveedor = null;        
        this.Clasificacion = 0; 
        this.Preproveedor = false; 
        this.Direccion = ""; 
        this.Codigo_Postal = ""; 
        this.Localidad = ""; 
        this.Id_Provincia = 0; 
        this.Id_Pais = 0; 
        this.Telefono1 = null; 
        this.Telefono3 = null; 
        this.Email1 = null; 
        this.Email2 = null; 
        this.Email3 = null; 
        this.Contacto2 = null; 
        this.Id_Facturador = null; 
        this.Acuerdo_Comercial = null; 
        this.Fini_Acuerdo_str = null; 
        this.Ffin_Acuerdo_str = null;  
        this.Importe_Fijo = null;
        this.Punto_Operacional = null;
        
    }
}