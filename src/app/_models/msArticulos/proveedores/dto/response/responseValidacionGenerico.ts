import { ResponseBase } from "../../../../baseResponseDto/responseBase";

export class ResponseValidacionGenerico extends ResponseBase
{
    Validacion:boolean;
    DescripcionValidacion:string;

    constructor(){
        super();
        this.Validacion = false;
        this.DescripcionValidacion = "";
    }
}