import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { EstacionHorario } from "../../estacionHorario";

export class ResponseListaEstacionHorario extends ResponseBase
{
    ListaEstacionHorario : EstacionHorario[];

    constructor()
    {
        super();
        this.ListaEstacionHorario =  [];
    }
}