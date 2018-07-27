export class Caracterizaciones {
    ID: number;
    ID_EMPRESA: number;
    NOMBRE: string;
    SELECTED:boolean;
    ID_TIPO:number;

    constructor(){
        this.ID = 0;
        this.ID_EMPRESA = 0;
        this.NOMBRE="";
        this.SELECTED=false;
        this.ID_TIPO=0;
    }
}