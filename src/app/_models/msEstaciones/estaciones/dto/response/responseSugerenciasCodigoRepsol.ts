import { Estaciones } from "../../estaciones";
import { ResponseBase } from "../../../../baseResponseDto/responseBase";

export class ResponseSugerenciasCodigoRepsol extends ResponseBase
{
    ListaSugerencias : Estaciones[];

    constructor()
    {
        super();
        this.ListaSugerencias = [];
    }
}