import { ResponseBase } from "../../../../baseResponseDto/responseBase";
import { TiposCaracterizacion } from "../../../..";


export class ResponseTiposCaracterizacion extends ResponseBase {

    ListaTiposCaracterizacion: TiposCaracterizacion[];

    public constructor() {
        super();
        this.ListaTiposCaracterizacion = [];             
    }
}