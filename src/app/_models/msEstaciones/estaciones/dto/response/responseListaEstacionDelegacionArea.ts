import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { EstacionDelegacionArea } from "../../estacionDelegacionArea";


export class ResponseListaEstacionDelegacionArea extends ResponseBase
{
    ListaEstacionDelegacionArea : EstacionDelegacionArea[];

    constructor()
    {
        super();
        this.ListaEstacionDelegacionArea =  [];
    }
}