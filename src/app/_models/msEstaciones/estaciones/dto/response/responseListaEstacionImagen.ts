import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { EstacionImagen } from "../../estacionImagen";

export class ResponseListaEstacionImagen extends ResponseBase
{
    ListaEstacionImagen : EstacionImagen[];

    constructor()
    {
        super();
        this.ListaEstacionImagen =  [];
    }
}