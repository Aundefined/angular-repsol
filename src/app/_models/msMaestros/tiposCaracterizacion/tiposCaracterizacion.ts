export class TiposCaracterizacion{
    ID:number;
    ID_EMPRESA:number;
    NOMBRE:string;
    NOMBREST:string;
    CARACTERISTICA:string;
    ID_CARACTERISTICA:number;
    COLOR:string;
 
    constructor(){
        this.ID = 0;
        this.ID_EMPRESA = 0;
        this.NOMBRE = "";
        this.CARACTERISTICA="";
        this.ID_CARACTERISTICA = -1;
        this.COLOR = "#e67600";
        this.NOMBREST = "";
    }
 }