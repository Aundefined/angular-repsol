import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { Segmentos } from "../../segmentos";

export class ResponseListaSegmento extends ResponseBase
{
    ListaSegmentos : Segmentos[];
    SelectedAll: boolean;

    constructor()
    {
        super();
        this.ListaSegmentos =  [];
    }
}