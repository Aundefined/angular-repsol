import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { CodigoProveedor } from "../../../..";

export class ResponseListaCodigosProveedor extends ResponseBase
{
    ListaCodigosProveedor : CodigoProveedor[];

    constructor()
    {
        super();
        this.ListaCodigosProveedor = [];
    }
}